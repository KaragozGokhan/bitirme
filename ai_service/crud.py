from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from typing import List, Optional, Dict
import models
import schemas
from passlib.context import CryptContext

# Şifre hashleme için
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# User CRUD işlemleri
class UserCRUD:
    @staticmethod
    def get_user(db: Session, user_id: int) -> Optional[models.User]:
        return db.query(models.User).filter(models.User.id == user_id).first()
    
    @staticmethod
    def get_user_by_email(db: Session, email: str) -> Optional[models.User]:
        return db.query(models.User).filter(models.User.email == email).first()
    
    @staticmethod
    def get_user_by_username(db: Session, username: str) -> Optional[models.User]:
        return db.query(models.User).filter(models.User.username == username).first()
    
    @staticmethod
    def get_users(db: Session, skip: int = 0, limit: int = 100) -> List[models.User]:
        return db.query(models.User).offset(skip).limit(limit).all()
    
    @staticmethod
    def create_user(db: Session, user: schemas.UserCreate) -> models.User:
        hashed_password = get_password_hash(user.password)
        db_user = models.User(
            username=user.username,
            email=user.email,
            password_hash=hashed_password,
            subscription_type=user.subscription_type
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    
    @staticmethod
    def update_user(db: Session, user_id: int, user_update: schemas.UserUpdate) -> Optional[models.User]:
        db_user = db.query(models.User).filter(models.User.id == user_id).first()
        if db_user:
            for field, value in user_update.dict(exclude_unset=True).items():
                setattr(db_user, field, value)
            db.commit()
            db.refresh(db_user)
        return db_user
    
    @staticmethod
    def delete_user(db: Session, user_id: int) -> bool:
        db_user = db.query(models.User).filter(models.User.id == user_id).first()
        if db_user:
            db.delete(db_user)
            db.commit()
            return True
        return False

# Book CRUD işlemleri
class BookCRUD:
    @staticmethod
    def get_book(db: Session, book_id: int) -> Optional[models.Book]:
        return db.query(models.Book).filter(models.Book.id == book_id).first()
    
    @staticmethod
    def get_books(db: Session, skip: int = 0, limit: int = 100) -> List[models.Book]:
        return db.query(models.Book).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_books_by_author(db: Session, author: str) -> List[models.Book]:
        return db.query(models.Book).filter(models.Book.author.ilike(f"%{author}%")).all()
    
    @staticmethod
    def get_books_by_title(db: Session, title: str) -> List[models.Book]:
        return db.query(models.Book).filter(models.Book.title.ilike(f"%{title}%")).all()
    
    @staticmethod
    def create_book(db: Session, book: schemas.BookCreate) -> models.Book:
        db_book = models.Book(**book.dict())
        db.add(db_book)
        db.commit()
        db.refresh(db_book)
        return db_book
    
    @staticmethod
    def update_book(db: Session, book_id: int, book_update: schemas.BookUpdate) -> Optional[models.Book]:
        db_book = db.query(models.Book).filter(models.Book.id == book_id).first()
        if db_book:
            for field, value in book_update.dict(exclude_unset=True).items():
                setattr(db_book, field, value)
            db.commit()
            db.refresh(db_book)
        return db_book
    
    @staticmethod
    def delete_book(db: Session, book_id: int) -> bool:
        db_book = db.query(models.Book).filter(models.Book.id == book_id).first()
        if db_book:
            db.delete(db_book)
            db.commit()
            return True
        return False

# UserBook CRUD işlemleri
class UserBookCRUD:
    @staticmethod
    def get_user_books(db: Session, user_id: int) -> List[models.UserBook]:
        return db.query(models.UserBook).filter(models.UserBook.user_id == user_id).all()
    
    @staticmethod
    def add_book_to_user(db: Session, user_book: schemas.UserBookCreate) -> models.UserBook:
        db_user_book = models.UserBook(**user_book.dict())
        db.add(db_user_book)
        db.commit()
        db.refresh(db_user_book)
        return db_user_book
    
    @staticmethod
    def check_user_has_book(db: Session, user_id: int, book_id: int) -> bool:
        return db.query(models.UserBook).filter(
            and_(models.UserBook.user_id == user_id, models.UserBook.book_id == book_id)
        ).first() is not None

# Rental CRUD işlemleri
class RentalCRUD:
    @staticmethod
    def get_user_rentals(db: Session, user_id: int) -> List[models.Rental]:
        return db.query(models.Rental).filter(models.Rental.user_id == user_id).all()
    
    @staticmethod
    def get_active_rentals(db: Session, user_id: int) -> List[models.Rental]:
        return db.query(models.Rental).filter(
            and_(models.Rental.user_id == user_id, models.Rental.status == 'active')
        ).all()
    
    @staticmethod
    def create_rental(db: Session, rental: schemas.RentalCreate) -> models.Rental:
        db_rental = models.Rental(**rental.dict())
        db.add(db_rental)
        db.commit()
        db.refresh(db_rental)
        return db_rental
    
    @staticmethod
    def update_rental(db: Session, rental_id: int, rental_update: schemas.RentalUpdate) -> Optional[models.Rental]:
        db_rental = db.query(models.Rental).filter(models.Rental.id == rental_id).first()
        if db_rental:
            for field, value in rental_update.dict(exclude_unset=True).items():
                setattr(db_rental, field, value)
            db.commit()
            db.refresh(db_rental)
        return db_rental

# ReadingHistory CRUD işlemleri
class ReadingHistoryCRUD:
    @staticmethod
    def get_reading_history(db: Session, user_id: int, book_id: int) -> Optional[models.ReadingHistory]:
        return db.query(models.ReadingHistory).filter(
            and_(models.ReadingHistory.user_id == user_id, models.ReadingHistory.book_id == book_id)
        ).first()
    
    @staticmethod
    def get_user_reading_history(db: Session, user_id: int) -> List[models.ReadingHistory]:
        return db.query(models.ReadingHistory).filter(models.ReadingHistory.user_id == user_id).all()
    
    @staticmethod
    def create_or_update_reading_history(db: Session, reading_history: schemas.ReadingHistoryCreate) -> models.ReadingHistory:
        db_reading_history = db.query(models.ReadingHistory).filter(
            and_(
                models.ReadingHistory.user_id == reading_history.user_id,
                models.ReadingHistory.book_id == reading_history.book_id
            )
        ).first()
        
        if db_reading_history:
            db_reading_history.last_page = reading_history.last_page
            db_reading_history.last_read = func.current_timestamp()
        else:
            db_reading_history = models.ReadingHistory(**reading_history.dict())
            db.add(db_reading_history)
        
        db.commit()
        db.refresh(db_reading_history)
        return db_reading_history

# Category CRUD işlemleri
class CategoryCRUD:
    @staticmethod
    def get_categories(db: Session) -> List[models.Category]:
        return db.query(models.Category).all()
    
    @staticmethod
    def get_category(db: Session, category_id: int) -> Optional[models.Category]:
        return db.query(models.Category).filter(models.Category.id == category_id).first()
    
    @staticmethod
    def create_category(db: Session, category: schemas.CategoryCreate) -> models.Category:
        db_category = models.Category(**category.dict())
        db.add(db_category)
        db.commit()
        db.refresh(db_category)
        return db_category

# Comment CRUD işlemleri
class CommentCRUD:
    @staticmethod
    def get_book_comments(db: Session, book_id: int) -> List[models.Comment]:
        return db.query(models.Comment).filter(models.Comment.book_id == book_id).all()
    
    @staticmethod
    def get_user_comments(db: Session, user_id: int) -> List[models.Comment]:
        return db.query(models.Comment).filter(models.Comment.user_id == user_id).all()
    
    @staticmethod
    def create_comment(db: Session, comment: schemas.CommentCreate) -> models.Comment:
        db_comment = models.Comment(**comment.dict())
        db.add(db_comment)
        db.commit()
        db.refresh(db_comment)
        return db_comment
    
    @staticmethod
    def update_comment(db: Session, comment_id: int, comment_update: schemas.CommentUpdate) -> Optional[models.Comment]:
        db_comment = db.query(models.Comment).filter(models.Comment.id == comment_id).first()
        if db_comment:
            for field, value in comment_update.dict(exclude_unset=True).items():
                setattr(db_comment, field, value)
            db.commit()
            db.refresh(db_comment)
        return db_comment
    
    @staticmethod
    def delete_comment(db: Session, comment_id: int) -> bool:
        db_comment = db.query(models.Comment).filter(models.Comment.id == comment_id).first()
        if db_comment:
            db.delete(db_comment)
            db.commit()
            return True
        return False

# Recommendation CRUD işlemleri - Kitap Önerisi Sistemi
class RecommendationCRUD:
    @staticmethod
    def get_user_favorite_categories(db: Session, user_id: int, limit: int = 5) -> List[int]:
        """
        Kullanıcının en çok puan verdiği kategorileri döndürür
        """
        from sqlalchemy import func
        
        # Kullanıcının yüksek puan verdiği kitapların kategorilerini bul
        result = (
            db.query(models.Book.categories)
            .join(models.Comment, models.Comment.book_id == models.Book.id)
            .filter(
                models.Comment.user_id == user_id,
                models.Comment.rate >= 7  # 7 ve üzeri puanlar
            )
            .all()
        )
        
        # Kategorileri topla ve sayılarını hesapla
        category_counts = {}
        for row in result:
            if row.categories:
                for category_id in row.categories:
                    category_counts[category_id] = category_counts.get(category_id, 0) + 1
        
        # En çok tercih edilen kategorileri döndür
        sorted_categories = sorted(category_counts.items(), key=lambda x: x[1], reverse=True)
        return [cat_id for cat_id, count in sorted_categories[:limit]]
    
    @staticmethod
    def get_popular_books_by_category(db: Session, category_ids: List[int], limit: int = 10) -> List[models.Book]:
        """
        Belirli kategorilerdeki en popüler kitapları döndürür
        """
        from sqlalchemy import func
        
        if not category_ids:
            return []
        
        # Kategorilerdeki kitapların ortalama puanlarını hesapla
        result = (
            db.query(
                models.Book,
                func.avg(models.Comment.rate).label('avg_rate'),
                func.count(models.Comment.id).label('comment_count')
            )
            .outerjoin(models.Comment, models.Comment.book_id == models.Book.id)
            .filter(models.Book.categories.overlap(category_ids))
            .group_by(models.Book.id)
            .having(func.count(models.Comment.id) >= 1)  # En az 1 yorumu olan kitaplar
            .order_by(func.avg(models.Comment.rate).desc(), func.count(models.Comment.id).desc())
            .limit(limit)
            .all()
        )
        
        return [row.Book for row in result]
    
    @staticmethod
    def get_user_unread_books(db: Session, user_id: int, book_ids: List[int]) -> List[models.Book]:
        """
        Kullanıcının henüz okumadığı kitapları filtreler
        """
        if not book_ids:
            return []
        
        # Kullanıcının sahip olduğu veya kiraladığı kitapları bul
        user_books = (
            db.query(models.UserBook.book_id)
            .filter(models.UserBook.user_id == user_id)
            .all()
        )
        user_book_ids = [ub.book_id for ub in user_books]
        
        # Kullanıcının kiraladığı kitapları da ekle
        user_rentals = (
            db.query(models.Rental.book_id)
            .filter(models.Rental.user_id == user_id)
            .all()
        )
        user_rental_ids = [ur.book_id for ur in user_rentals]
        
        # Tüm okunmuş kitap ID'lerini birleştir
        read_book_ids = set(user_book_ids + user_rental_ids)
        
        # Okunmamış kitapları döndür
        return (
            db.query(models.Book)
            .filter(models.Book.id.in_(book_ids))
            .filter(~models.Book.id.in_(read_book_ids))
            .all()
        )
    
    @staticmethod
    def recommend_books_for_user(db: Session, user_id: int, limit: int = 5) -> List[models.Book]:
        """
        Kullanıcı için kitap önerileri oluşturur
        """
        # 1. Kullanıcının favori kategorilerini bul
        favorite_categories = RecommendationCRUD.get_user_favorite_categories(db, user_id)
        
        # 2. Bu kategorilerdeki popüler kitapları bul
        popular_books = RecommendationCRUD.get_popular_books_by_category(db, favorite_categories, limit * 2)
        
        # 3. Kullanıcının okumadığı kitapları filtrele
        unread_books = RecommendationCRUD.get_user_unread_books(
            db, user_id, [book.id for book in popular_books]
        )
        
        # 4. Eğer yeterli öneri yoksa, genel popüler kitapları ekle
        if len(unread_books) < limit:
            from sqlalchemy import func
            
            # Genel popüler kitaplar
            general_popular = (
                db.query(models.Book)
                .outerjoin(models.Comment, models.Comment.book_id == models.Book.id)
                .group_by(models.Book.id)
                .order_by(func.avg(models.Comment.rate).desc().nullslast())
                .limit(limit * 2)
                .all()
            )
            
            # Henüz önerilmemiş kitapları ekle
            recommended_ids = {book.id for book in unread_books}
            additional_books = [
                book for book in general_popular 
                if book.id not in recommended_ids
            ]
            
            unread_books.extend(additional_books[:limit - len(unread_books)])
        
        return unread_books[:limit]
    
    @staticmethod
    def get_similar_books(db: Session, book_id: int, limit: int = 5) -> List[models.Book]:
        """
        Belirli bir kitaba benzer kitapları önerir
        """
        # Kitabın kategorilerini al
        book = db.query(models.Book).filter(models.Book.id == book_id).first()
        if not book or not book.categories:
            return []
        
        # Aynı kategorilerdeki diğer kitapları bul
        similar_books = (
            db.query(models.Book)
            .filter(models.Book.categories.overlap(book.categories))
            .filter(models.Book.id != book_id)
            .limit(limit)
            .all()
        )
        
        return similar_books
    
    @staticmethod
    def get_trending_books(db: Session, limit: int = 10) -> List[models.Book]:
        """
        Son zamanlarda en çok yorum alan ve yüksek puanlı kitapları döndürür
        """
        from sqlalchemy import func
        from datetime import datetime, timedelta
        
        # Son 30 gün içindeki yorumları al
        thirty_days_ago = datetime.now() - timedelta(days=30)
        
        result = (
            db.query(
                models.Book,
                func.avg(models.Comment.rate).label('avg_rate'),
                func.count(models.Comment.id).label('recent_comments')
            )
            .join(models.Comment, models.Comment.book_id == models.Book.id)
            .filter(models.Comment.created_at >= thirty_days_ago)
            .group_by(models.Book.id)
            .having(func.count(models.Comment.id) >= 2)  # En az 2 yorum
            .order_by(func.avg(models.Comment.rate).desc(), func.count(models.Comment.id).desc())
            .limit(limit)
            .all()
        )
        
        return [row.Book for row in result]

# AI Recommendation CRUD işlemleri - Collaborative Filtering Tabanlı Öneri Sistemi
class AIRecommendationCRUD:
    @staticmethod
    def train_ai_model(db: Session) -> bool:
        """
        Collaborative filtering modelini eğitir
        """
        from ml_recommendation import collaborative_recommender
        
        print("🤖 Collaborative filtering modeli eğitiliyor...")
        success = collaborative_recommender.train(db)
        
        if success:
            print("✅ Collaborative filtering modeli başarıyla eğitildi!")
        else:
            print("❌ Collaborative filtering modeli eğitimi başarısız!")
        
        return success
    
    @staticmethod
    def load_ai_model() -> bool:
        """
        Kaydedilmiş collaborative filtering modelini yükler
        """
        from ml_recommendation import collaborative_recommender
        
        print("📥 Collaborative filtering modeli yükleniyor...")
        success = collaborative_recommender.load_models()
        
        if success:
            print("✅ Collaborative filtering modeli başarıyla yüklendi!")
        else:
            print("❌ Collaborative filtering modeli yüklenemedi!")
        
        return success
    
    @staticmethod
    def get_ai_recommendations(db: Session, user_id: int, limit: int = 5) -> List[Dict]:
        """
        Collaborative filtering ile kitap önerileri
        """
        from ml_recommendation import collaborative_recommender
        
        if not collaborative_recommender.is_trained:
            # Model yüklenmemişse yüklemeyi dene
            if not AIRecommendationCRUD.load_ai_model():
                return []
        
        return collaborative_recommender.get_collaborative_recommendations(user_id, limit)
    
    @staticmethod
    def get_user_based_recommendations(db: Session, user_id: int, limit: int = 5) -> List[Dict]:
        """
        Kullanıcı tabanlı collaborative filtering önerileri
        """
        from ml_recommendation import collaborative_recommender
        
        if not collaborative_recommender.is_trained:
            if not AIRecommendationCRUD.load_ai_model():
                return []
        
        return collaborative_recommender.get_user_based_recommendations(user_id, limit)
    
    @staticmethod
    def get_ai_similar_books(book_id: int, limit: int = 5) -> List[Dict]:
        """
        Collaborative filtering ile benzer kitap önerileri
        """
        from ml_recommendation import collaborative_recommender
        
        if not collaborative_recommender.is_trained:
            if not AIRecommendationCRUD.load_ai_model():
                return []
        
        return collaborative_recommender.get_similar_books(book_id, limit)
    
    @staticmethod
    def get_similar_users(user_id: int, limit: int = 5) -> List[Dict]:
        """
        Benzer kullanıcıları bulur
        """
        from ml_recommendation import collaborative_recommender
        
        if not collaborative_recommender.is_trained:
            if not AIRecommendationCRUD.load_ai_model():
                return []
        
        return collaborative_recommender.get_similar_users(user_id, limit)
    
    @staticmethod
    def predict_rating_user_based(book_id: int, user_id: int) -> float:
        """
        Kullanıcı tabanlı collaborative filtering ile puan tahmini
        """
        from ml_recommendation import collaborative_recommender
        
        if not collaborative_recommender.is_trained:
            if not AIRecommendationCRUD.load_ai_model():
                return 5.0  # Varsayılan puan
        
        return collaborative_recommender.predict_rating_user_based(user_id, book_id)
    
    @staticmethod
    def predict_rating_item_based(book_id: int, user_id: int) -> float:
        """
        Öğe tabanlı collaborative filtering ile puan tahmini
        """
        from ml_recommendation import collaborative_recommender
        
        if not collaborative_recommender.is_trained:
            if not AIRecommendationCRUD.load_ai_model():
                return 5.0  # Varsayılan puan
        
        return collaborative_recommender.predict_rating_item_based(user_id, book_id)
    
    @staticmethod
    def predict_rating_hybrid(book_id: int, user_id: int) -> float:
        """
        Hibrit collaborative filtering ile puan tahmini
        """
        from ml_recommendation import collaborative_recommender
        
        if not collaborative_recommender.is_trained:
            if not AIRecommendationCRUD.load_ai_model():
                return 5.0  # Varsayılan puan
        
        return collaborative_recommender.predict_rating_hybrid(user_id, book_id)
    
    @staticmethod
    def predict_personalized_rating(book_id: int, user_id: int) -> Dict:
        """
        Collaborative filtering ile kişiselleştirilmiş puan tahmini
        """
        from ml_recommendation import collaborative_recommender
        
        if not collaborative_recommender.is_trained:
            if not AIRecommendationCRUD.load_ai_model():
                return {"predicted_rating": 5.0, "method": "default"}
        
        try:
            # Farklı yöntemlerle tahmin yap
            user_based_rating = collaborative_recommender.predict_rating_user_based(user_id, book_id)
            item_based_rating = collaborative_recommender.predict_rating_item_based(user_id, book_id)
            hybrid_rating = collaborative_recommender.predict_rating_hybrid(user_id, book_id)
            
            # Benzer kullanıcıları bul
            similar_users = collaborative_recommender.get_similar_users(user_id, 3)
            
            return {
                "predicted_rating": round(hybrid_rating, 2),
                "user_based_rating": round(user_based_rating, 2),
                "item_based_rating": round(item_based_rating, 2),
                "method": "collaborative_filtering",
                "similar_users_count": len(similar_users),
                "similar_users": [
                    {
                        "user_id": user["user_id"],
                        "username": user["username"],
                        "similarity_score": round(user["similarity_score"], 3)
                    }
                    for user in similar_users
                ]
            }
                
        except Exception as e:
            print(f"❌ Collaborative filtering tahmin hatası: {e}")
            return {"predicted_rating": 5.0, "method": "error"}
    
    @staticmethod
    def get_user_preferences(user_id: int) -> Dict:
        """
        Kullanıcının benzer kullanıcılarını ve tercihlerini döndürür
        """
        from ml_recommendation import collaborative_recommender
        
        if not collaborative_recommender.is_trained:
            if not AIRecommendationCRUD.load_ai_model():
                return {"error": "Model not trained"}
        
        try:
            # Benzer kullanıcıları bul
            similar_users = collaborative_recommender.get_similar_users(user_id, 5)
            
            # Kullanıcının puanladığı kitapları bul
            user_ratings = collaborative_recommender.user_item_matrix.loc[user_id]
            rated_books = user_ratings[user_ratings > 0]
            
            # Yüksek puanlı kitapları al
            high_rated_books = []
            for book_id, rating in rated_books.items():
                if rating >= 7.0:  # 7+ puanlı kitaplar
                    book_data = collaborative_recommender.books_df[collaborative_recommender.books_df['book_id'] == book_id]
                    if not book_data.empty:
                        high_rated_books.append({
                            "book_id": int(book_id),
                            "title": book_data.iloc[0]['title'],
                            "author": book_data.iloc[0]['author'],
                            "rating": float(rating)
                        })
            
            return {
                "user_id": user_id,
                "similar_users": similar_users,
                "total_ratings": len(rated_books),
                "high_rated_books": high_rated_books[:5],  # En yüksek 5 puanlı kitap
                "average_rating": float(rated_books.mean()) if len(rated_books) > 0 else 0.0
            }
            
        except Exception as e:
            return {"error": f"User preferences failed: {e}"}
    
    @staticmethod
    def compare_predictions(book_id: int, user_id: int) -> Dict:
        """
        Farklı collaborative filtering yöntemlerini karşılaştırır
        """
        from ml_recommendation import collaborative_recommender
        
        if not collaborative_recommender.is_trained:
            if not AIRecommendationCRUD.load_ai_model():
                return {"error": "Model not trained"}
        
        try:
            # Farklı yöntemlerle tahmin yap
            user_based_rating = collaborative_recommender.predict_rating_user_based(user_id, book_id)
            item_based_rating = collaborative_recommender.predict_rating_item_based(user_id, book_id)
            hybrid_rating = collaborative_recommender.predict_rating_hybrid(user_id, book_id)
            
            # Benzer kullanıcıları bul
            similar_users = collaborative_recommender.get_similar_users(user_id, 3)
            
            return {
                "book_id": book_id,
                "user_id": user_id,
                "user_based_rating": round(user_based_rating, 2),
                "item_based_rating": round(item_based_rating, 2),
                "hybrid_rating": round(hybrid_rating, 2),
                "method": "collaborative_filtering",
                "similar_users_count": len(similar_users),
                "similar_users": [
                    {
                        "user_id": user["user_id"],
                        "username": user["username"],
                        "similarity_score": round(user["similarity_score"], 3)
                    }
                    for user in similar_users
                ]
            }
            
        except Exception as e:
            return {"error": f"Prediction comparison failed: {e}"}
    
    @staticmethod
    def get_ai_model_info() -> Dict:
        """
        Collaborative filtering model bilgilerini döndürür
        """
        from ml_recommendation import collaborative_recommender
        
        return collaborative_recommender.get_model_info() 