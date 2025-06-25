#!/usr/bin/env python3  
# -*- coding: utf-8 -*-

import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.decomposition import NMF
from sklearn.preprocessing import StandardScaler
import joblib
import os
from typing import List, Dict, Tuple, Optional
from sqlalchemy.orm import Session
import models
from datetime import datetime
import warnings
warnings.filterwarnings('ignore')

class CollaborativeFilteringRecommender:
    """
    Collaborative Filtering tabanlı kitap önerisi sistemi
    Benzer kullanıcıların puanlarına göre öneri yapar
    """
    
    def __init__(self, model_path: str = "models/"):
        self.model_path = model_path
        self.user_item_matrix = None
        self.user_similarity_matrix = None
        self.item_similarity_matrix = None
        self.nmf_model = None
        self.scaler = StandardScaler()
        self.users_df = None
        self.books_df = None
        self.ratings_df = None
        self.is_trained = False
        
        os.makedirs(model_path, exist_ok=True)
    
    def prepare_data(self, db: Session) -> pd.DataFrame:
        """
        Veritabanından veriyi hazırlar
        """
        print("📊 Veri hazırlanıyor...")
        
        try:
            books = db.query(models.Book).all()
            books_data = []
            for book in books:
                categories = book.categories if book.categories else []
                books_data.append({
                    'book_id': book.id,
                    'title': book.title,
                    'author': book.author,
                    'categories': categories,
                    'categories_str': ','.join(map(str, categories)) if categories else '',
                    'price': float(book.price) if book.price else 0.0
                })
            
            comments = db.query(models.Comment).all()
            ratings_data = []
            for comment in comments:
                ratings_data.append({
                    'user_id': comment.user_id,
                    'book_id': comment.book_id,
                    'rate': float(comment.rate) if comment.rate else 5.0,
                    'comment': comment.comment or ''
                })
            
            users = db.query(models.User).all()
            users_data = []
            for user in users:
                users_data.append({
                    'user_id': user.id,
                    'email': user.email,
                    'username': user.username or ''
                })
            
            self.books_df = pd.DataFrame(books_data)
            self.ratings_df = pd.DataFrame(ratings_data)
            self.users_df = pd.DataFrame(users_data)
            
            if self.books_df.empty or self.ratings_df.empty:
                print("❌ Yeterli veri bulunamadı!")
                return pd.DataFrame()
            
            print(f"✅ Veri hazırlandı: {len(self.books_df)} kitap, {len(self.ratings_df)} puan, {len(self.users_df)} kullanıcı")
            return self.ratings_df
            
        except Exception as e:
            print(f"❌ Veri hazırlama hatası: {e}")
            return pd.DataFrame()
    
    def create_user_item_matrix(self) -> None:
        """
        Kullanıcı-Öğe matrisini oluşturur
        """
        print("📊 Kullanıcı-Öğe matrisi oluşturuluyor...")
        
        self.user_item_matrix = self.ratings_df.pivot_table(
            index='user_id', 
            columns='book_id', 
            values='rate', 
            fill_value=0
        )
        
        print(f"✅ Kullanıcı-Öğe matrisi oluşturuldu: {self.user_item_matrix.shape}")
    
    def calculate_user_similarity(self) -> None:
        """
        Kullanıcı benzerlik matrisini hesaplar
        """
        print("👥 Kullanıcı benzerlik matrisi hesaplanıyor...")
        
        self.user_similarity_matrix = cosine_similarity(self.user_item_matrix)
        
        self.user_similarity_matrix = pd.DataFrame(
            self.user_similarity_matrix,
            index=self.user_item_matrix.index,
            columns=self.user_item_matrix.index
        )
        
        print(f"✅ Kullanıcı benzerlik matrisi hesaplandı: {self.user_similarity_matrix.shape}")
    
    def calculate_item_similarity(self) -> None:
        """
        Öğe benzerlik matrisini hesaplar
        """
        print("📚 Öğe benzerlik matrisi hesaplanıyor...")
        
        item_matrix = self.user_item_matrix.T
        self.item_similarity_matrix = cosine_similarity(item_matrix)
        
        self.item_similarity_matrix = pd.DataFrame(
            self.item_similarity_matrix,
            index=item_matrix.index,
            columns=item_matrix.index
        )
        
        print(f"✅ Öğe benzerlik matrisi hesaplandı: {self.item_similarity_matrix.shape}")
    
    def train_nmf_model(self) -> None:
        """
        Non-negative Matrix Factorization modelini eğitir
        """
        print("🔧 NMF modeli eğitiliyor...")
        
        n_components = min(50, min(self.user_item_matrix.shape) // 2)
        self.nmf_model = NMF(n_components=n_components, random_state=42, max_iter=200)
        
        self.nmf_model.fit(self.user_item_matrix)
        
        print(f"✅ NMF modeli eğitildi: {n_components} bileşen")
    
    def get_similar_users(self, user_id: int, n_similar: int = 5) -> List[Dict]:
        """
        Belirli bir kullanıcıya benzer kullanıcıları bulur
        """
        if user_id not in self.user_similarity_matrix.index:
            return []
        
        user_similarities = self.user_similarity_matrix.loc[user_id].sort_values(ascending=False)
        
        similar_users = []
        for similar_user_id, similarity in user_similarities[1:n_similar+1].items():
            if similarity > 0:
                similar_users.append({
                    'user_id': int(similar_user_id),
                    'similarity_score': float(similarity),
                    'username': self.users_df[self.users_df['user_id'] == similar_user_id]['username'].iloc[0] if not self.users_df[self.users_df['user_id'] == similar_user_id].empty else f"User_{similar_user_id}"
                })
        
        return similar_users
    
    def get_similar_books(self, book_id: int, n_similar: int = 5) -> List[Dict]:
        """
        Belirli bir kitaba benzer kitapları bulur
        """
        if book_id not in self.item_similarity_matrix.index:
            return []
        
        book_similarities = self.item_similarity_matrix.loc[book_id].sort_values(ascending=False)
        
        similar_books = []
        for similar_book_id, similarity in book_similarities[1:n_similar+1].items():
            if similarity > 0:
                book_data = self.books_df[self.books_df['book_id'] == similar_book_id]
                if not book_data.empty:
                    similar_books.append({
                        'book_id': int(similar_book_id),
                        'title': book_data.iloc[0]['title'],
                        'author': book_data.iloc[0]['author'],
                        'similarity_score': float(similarity)
                    })
        
        return similar_books
    
    def predict_rating_user_based(self, user_id: int, book_id: int) -> float:
        """
        Kullanıcı tabanlı collaborative filtering ile puan tahmini
        """
        if user_id not in self.user_similarity_matrix.index or book_id not in self.user_item_matrix.columns:
            return 5.0
        
        similar_users = self.get_similar_users(user_id, n_similar=10)
        
        if not similar_users:
            return 5.0
        
        weighted_sum = 0
        similarity_sum = 0
        
        for similar_user in similar_users:
            similar_user_id = similar_user['user_id']
            similarity = similar_user['similarity_score']
            
            rating = self.user_item_matrix.loc[similar_user_id, book_id]
            
            if rating > 0:
                weighted_sum += similarity * rating
                similarity_sum += similarity
        
        if similarity_sum > 0:
            predicted_rating = weighted_sum / similarity_sum
            return max(1.0, min(10.0, predicted_rating))
        else:
            return 5.0
    
    def predict_rating_item_based(self, user_id: int, book_id: int) -> float:
        """
        Öğe tabanlı collaborative filtering ile puan tahmini
        """
        if user_id not in self.user_item_matrix.index or book_id not in self.item_similarity_matrix.index:
            return 5.0
        
        user_ratings = self.user_item_matrix.loc[user_id]
        rated_books = user_ratings[user_ratings > 0]
        
        if len(rated_books) == 0:
            return 5.0
        
        book_similarities = self.item_similarity_matrix.loc[book_id]
        
        weighted_sum = 0
        similarity_sum = 0
        
        for rated_book_id, user_rating in rated_books.items():
            if rated_book_id in book_similarities.index:
                similarity = book_similarities[rated_book_id]
                
                if similarity > 0:
                    weighted_sum += similarity * user_rating
                    similarity_sum += similarity
        
        if similarity_sum > 0:
            predicted_rating = weighted_sum / similarity_sum
            return max(1.0, min(10.0, predicted_rating))
        else:
            return 5.0
    
    def predict_rating_hybrid(self, user_id: int, book_id: int) -> float:
        """
        Hibrit yaklaşım ile puan tahmini (kullanıcı + öğe tabanlı)
        """
        user_based = self.predict_rating_user_based(user_id, book_id)
        item_based = self.predict_rating_item_based(user_id, book_id)
        
        hybrid_rating = 0.7 * user_based + 0.3 * item_based
        return max(1.0, min(10.0, hybrid_rating))
    
    def get_collaborative_recommendations(self, user_id: int, limit: int = 10, db: Session = None) -> List[Dict]:
        """
        Collaborative filtering ile kitap önerileri (kullanıcının sahip olduğu ve aktif kiraladığı kitaplar hariç)
        """
        if user_id not in self.user_item_matrix.index:
            return []

        # Exclude the books the user has and is renting
        exclude_ids = set()
        if db is not None:
            user_book_ids = [ub.book_id for ub in db.query(models.UserBook).filter(models.UserBook.user_id == user_id).all()]
            active_rental_ids = [r.book_id for r in db.query(models.Rental).filter(models.Rental.user_id == user_id, models.Rental.status == 'active').all()]
            exclude_ids = set(user_book_ids + active_rental_ids)

        user_ratings = self.user_item_matrix.loc[user_id]
        unrated_books = [bid for bid in user_ratings[user_ratings == 0].index.tolist() if bid not in exclude_ids]

        if not unrated_books:
            return []

        predictions = []
        for book_id in unrated_books:
            predicted_rating = self.predict_rating_hybrid(user_id, book_id)
            book_data = self.books_df[self.books_df['book_id'] == book_id]
            if not book_data.empty:
                predictions.append({
                    'book_id': int(book_id),
                    'title': book_data.iloc[0]['title'],
                    'author': book_data.iloc[0]['author'],
                    'predicted_rating': round(predicted_rating, 2),
                    'method': 'collaborative_filtering'
                })

        predictions.sort(key=lambda x: x['predicted_rating'], reverse=True)
        # If the number of recommendations is less than the limit, complete the remaining ones by rating
        if len(predictions) < limit and db is not None:
            # Sort the remaining ones by rating
            all_candidate_ids = [bid for bid in self.books_df['book_id'].tolist() if bid not in exclude_ids and bid not in [p['book_id'] for p in predictions]]
            extra_predictions = []
            for book_id in all_candidate_ids:
                predicted_rating = self.predict_rating_hybrid(user_id, book_id)
                book_data = self.books_df[self.books_df['book_id'] == book_id]
                if not book_data.empty:
                    extra_predictions.append({
                        'book_id': int(book_id),
                        'title': book_data.iloc[0]['title'],
                        'author': book_data.iloc[0]['author'],
                        'predicted_rating': round(predicted_rating, 2),
                        'method': 'collaborative_filtering_extra'
                    })
            extra_predictions.sort(key=lambda x: x['predicted_rating'], reverse=True)
            predictions.extend(extra_predictions[:limit - len(predictions)])
        return predictions[:limit]

    def get_user_based_recommendations(self, user_id: int, limit: int = 10, db: Session = None) -> List[Dict]:
        """
        Sadece kullanıcı tabanlı öneriler (kategori ve puan ağırlıklı benzerlik ile, sahip olunan ve aktif kiralananlar hariç)
        """
        if user_id not in self.user_item_matrix.index:
            return []
        similar_users = self.get_similar_users_hybrid(user_id, n_similar=5)
        if not similar_users:
            return []
        # Exclude the books the user has and is renting
        exclude_ids = set()
        if db is not None:
            user_book_ids = [ub.book_id for ub in db.query(models.UserBook).filter(models.UserBook.user_id == user_id).all()]
            active_rental_ids = [r.book_id for r in db.query(models.Rental).filter(models.Rental.user_id == user_id, models.Rental.status == 'active').all()]
            exclude_ids = set(user_book_ids + active_rental_ids)
        user_ratings = self.user_item_matrix.loc[user_id]
        unrated_books = [bid for bid in user_ratings[user_ratings == 0].index.tolist() if bid not in exclude_ids]
        book_scores = {}
        for similar_user in similar_users:
            similar_user_id = similar_user['user_id']
            similarity = similar_user['similarity_score']
            similar_user_ratings = self.user_item_matrix.loc[similar_user_id]
            high_rated_books = similar_user_ratings[similar_user_ratings >= 7.0]
            for book_id, rating in high_rated_books.items():
                if book_id in unrated_books:
                    if book_id not in book_scores:
                        book_scores[book_id] = {'total_score': 0, 'count': 0}
                    book_scores[book_id]['total_score'] += similarity * rating
                    book_scores[book_id]['count'] += 1
        recommendations = []
        for book_id, scores in book_scores.items():
            if scores['count'] >= 1:
                avg_score = scores['total_score'] / scores['count']
                book_data = self.books_df[self.books_df['book_id'] == book_id]
                if not book_data.empty:
                    recommendations.append({
                        'book_id': int(book_id),
                        'title': book_data.iloc[0]['title'],
                        'author': book_data.iloc[0]['author'],
                        'predicted_rating': round(avg_score, 2),
                        'similar_users_count': scores['count'],
                        'method': 'user_based_hybrid'
                    })
        recommendations.sort(key=lambda x: x['predicted_rating'], reverse=True)
        # If the number of recommendations is less than the limit, complete the remaining ones by rating
        if len(recommendations) < limit and db is not None:
            all_candidate_ids = [bid for bid in self.books_df['book_id'].tolist() if bid not in exclude_ids and bid not in [r['book_id'] for r in recommendations]]
            extra_recommendations = []
            for book_id in all_candidate_ids:
                avg_score = self.predict_rating_hybrid(user_id, book_id)
                book_data = self.books_df[self.books_df['book_id'] == book_id]
                if not book_data.empty:
                    extra_recommendations.append({
                        'book_id': int(book_id),
                        'title': book_data.iloc[0]['title'],
                        'author': book_data.iloc[0]['author'],
                        'predicted_rating': round(avg_score, 2),
                        'similar_users_count': 0,
                        'method': 'user_based_hybrid_extra'
                    })
            extra_recommendations.sort(key=lambda x: x['predicted_rating'], reverse=True)
            recommendations.extend(extra_recommendations[:limit - len(recommendations)])
        return recommendations[:limit]
    
    def calculate_category_profile_matrix(self) -> None:
        """
        Her kullanıcı için kategori bazlı ortalama puan vektörü oluşturur
        """
        print("📚 Kullanıcı-Kategori profil matrisi oluşturuluyor...")
        user_category_scores = {}
        for _, row in self.ratings_df.iterrows():
            user_id = row['user_id']
            book_id = row['book_id']
            rate = row['rate']
            book_row = self.books_df[self.books_df['book_id'] == book_id]
            if book_row.empty:
                continue
            categories = book_row.iloc[0]['categories']
            if not categories:
                continue
            if user_id not in user_category_scores:
                user_category_scores[user_id] = {}
            for cat in categories:
                if cat not in user_category_scores[user_id]:
                    user_category_scores[user_id][cat] = []
                user_category_scores[user_id][cat].append(rate)
        all_categories = sorted({cat for user in user_category_scores for cat in user_category_scores[user]})
        data = []
        user_ids = []
        for user_id in self.users_df['user_id']:
            user_ids.append(user_id)
            user_vec = []
            for cat in all_categories:
                if user_id in user_category_scores and cat in user_category_scores[user_id]:
                    user_vec.append(np.mean(user_category_scores[user_id][cat]))
                else:
                    user_vec.append(0.0)
            data.append(user_vec)
        self.user_category_profile_matrix = pd.DataFrame(data, index=user_ids, columns=all_categories)
        print(f"✅ Kullanıcı-Kategori profil matrisi: {self.user_category_profile_matrix.shape}")

    def calculate_hybrid_user_similarity(self, category_weight: float = 0.65, rate_weight: float = 0.35) -> None:
        """
        Kategori ve puan benzerliğini ağırlıklı birleştirerek kullanıcı benzerlik matrisini oluşturur
        """
        print("🔗 Hibrit kullanıcı benzerlik matrisi hesaplanıyor...")
        category_sim = cosine_similarity(self.user_category_profile_matrix)
        category_sim_df = pd.DataFrame(category_sim, index=self.user_category_profile_matrix.index, columns=self.user_category_profile_matrix.index)
        rate_sim = cosine_similarity(self.user_item_matrix)
        rate_sim_df = pd.DataFrame(rate_sim, index=self.user_item_matrix.index, columns=self.user_item_matrix.index)
        common_users = list(set(category_sim_df.index) & set(rate_sim_df.index))
        hybrid_sim = category_weight * category_sim_df.loc[common_users, common_users] + rate_weight * rate_sim_df.loc[common_users, common_users]
        self.hybrid_user_similarity_matrix = hybrid_sim
        print(f"✅ Hibrit kullanıcı benzerlik matrisi: {self.hybrid_user_similarity_matrix.shape}")

    def get_similar_users_hybrid(self, user_id: int, n_similar: int = 5) -> List[Dict]:
        """
        Kategori ve puan ağırlıklı benzer kullanıcıları bulur
        """
        if not hasattr(self, 'hybrid_user_similarity_matrix') or user_id not in self.hybrid_user_similarity_matrix.index:
            return []
        user_similarities = self.hybrid_user_similarity_matrix.loc[user_id].sort_values(ascending=False)
        similar_users = []
        for similar_user_id, similarity in user_similarities[1:n_similar+1].items():
            if similarity > 0:
                similar_users.append({
                    'user_id': int(similar_user_id),
                    'similarity_score': float(similarity),
                    'username': self.users_df[self.users_df['user_id'] == similar_user_id]['username'].iloc[0] if not self.users_df[self.users_df['user_id'] == similar_user_id].empty else f"User_{similar_user_id}"
                })
        return similar_users
    
    def train(self, db: Session) -> bool:
        """
        Collaborative filtering modellerini eğitir
        """
        try:
            df = self.prepare_data(db)
            if df.empty:
                return False
            self.create_user_item_matrix()
            self.calculate_category_profile_matrix()
            self.calculate_user_similarity()
            self.calculate_item_similarity()
            self.calculate_hybrid_user_similarity(category_weight=0.65, rate_weight=0.35)
            self.train_nmf_model()
            self.save_models()
            self.is_trained = True
            print("🎉 Collaborative filtering modelleri başarıyla eğitildi!")
            return True
        except Exception as e:
            print(f"❌ Model eğitimi hatası: {e}")
            return False
    
    def save_models(self) -> None:
        """
        Eğitilmiş modelleri kaydeder
        """
        try:
            joblib.dump(self.user_item_matrix, f"{self.model_path}/user_item_matrix.pkl")
            joblib.dump(self.user_similarity_matrix, f"{self.model_path}/user_similarity_matrix.pkl")
            joblib.dump(self.item_similarity_matrix, f"{self.model_path}/item_similarity_matrix.pkl")
            joblib.dump(self.nmf_model, f"{self.model_path}/nmf_model.pkl")
            joblib.dump(self.books_df, f"{self.model_path}/books_df.pkl")
            joblib.dump(self.users_df, f"{self.model_path}/users_df.pkl")
            joblib.dump(self.ratings_df, f"{self.model_path}/ratings_df.pkl")
            print("💾 Collaborative filtering modelleri kaydedildi")
        except Exception as e:
            print(f"❌ Model kaydetme hatası: {e}")
    
    def load_models(self) -> bool:
        """
        Kaydedilmiş modelleri yükler
        """
        try:
            if not os.path.exists(f"{self.model_path}/user_similarity_matrix.pkl"):
                return False
            
            self.user_item_matrix = joblib.load(f"{self.model_path}/user_item_matrix.pkl")
            self.user_similarity_matrix = joblib.load(f"{self.model_path}/user_similarity_matrix.pkl")
            self.item_similarity_matrix = joblib.load(f"{self.model_path}/item_similarity_matrix.pkl")
            self.nmf_model = joblib.load(f"{self.model_path}/nmf_model.pkl")
            self.books_df = joblib.load(f"{self.model_path}/books_df.pkl")
            self.users_df = joblib.load(f"{self.model_path}/users_df.pkl")
            self.ratings_df = joblib.load(f"{self.model_path}/ratings_df.pkl")
            
            self.is_trained = True
            print("📥 Collaborative filtering modelleri yüklendi")
            return True
            
        except Exception as e:
            print(f"❌ Model yükleme hatası: {e}")
            return False
    
    def get_model_info(self) -> Dict:
        """
        Model bilgilerini döndürür
        """
        return {
            'is_trained': self.is_trained,
            'total_books': len(self.books_df) if self.books_df is not None else 0,
            'total_users': len(self.users_df) if self.users_df is not None else 0,
            'total_ratings': len(self.ratings_df) if self.ratings_df is not None else 0,
            'model_path': self.model_path,
            'algorithms': ['User-based Collaborative Filtering', 'Item-based Collaborative Filtering', 'NMF Matrix Factorization'],
            'description': 'Collaborative filtering tabanlı kitap önerisi sistemi - benzer kullanıcıların puanlarına göre öneri yapar'
        }

collaborative_recommender = CollaborativeFilteringRecommender() 