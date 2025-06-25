#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Collaborative Filtering Tabanlı Kitap Önerisi Sistemi Test Dosyası
"""

import time
from database import SessionLocal
from crud import AIRecommendationCRUD, UserCRUD, BookCRUD, CategoryCRUD, CommentCRUD
import schemas

def test_collaborative_filtering_model():
    """
    Collaborative filtering modelini test eder
    """
    print("🧪 Collaborative Filtering Model Testi Başlıyor...")
    print("=" * 60)
    
    db = SessionLocal()
    
    try:
        # 1. Test verilerini hazırla
        print("1. Test verileri hazırlanıyor...")
        
        # Kategoriler oluştur
        categories_data = [
            {"name": "Roman", "description": "Roman kategorisi"},
            {"name": "Bilim Kurgu", "description": "Bilim kurgu kategorisi"},
            {"name": "Fantastik", "description": "Fantastik kategorisi"},
            {"name": "Polisiye", "description": "Polisiye kategorisi"},
            {"name": "Tarih", "description": "Tarih kategorisi"}
        ]
        
        categories = []
        for cat_data in categories_data:
            category = CategoryCRUD.create_category(db, schemas.CategoryCreate(**cat_data))
            categories.append(category)
            print(f"   ✅ Kategori: {category.name}")
        
        # Kullanıcılar oluştur
        users_data = [
            {"email": "user1@test.com", "username": "roman_sever", "password": "test123"},
            {"email": "user2@test.com", "username": "bilim_kurgu_sever", "password": "test123"},
            {"email": "user3@test.com", "username": "fantastik_sever", "password": "test123"},
            {"email": "user4@test.com", "username": "polisiye_sever", "password": "test123"},
            {"email": "user5@test.com", "username": "tarih_sever", "password": "test123"}
        ]
        
        users = []
        for user_data in users_data:
            user = UserCRUD.create_user(db, schemas.UserCreate(**user_data))
            users.append(user)
            print(f"   ✅ Kullanıcı: {user.username}")
        
        # Kitaplar oluştur
        books_data = [
            {"title": "Suç ve Ceza", "author": "Dostoyevski", "price": 25.0, "category_ids": [categories[0].id]},
            {"title": "1984", "author": "George Orwell", "price": 30.0, "category_ids": [categories[1].id]},
            {"title": "Yüzüklerin Efendisi", "author": "Tolkien", "price": 45.0, "category_ids": [categories[2].id]},
            {"title": "Sherlock Holmes", "author": "Arthur Conan Doyle", "price": 35.0, "category_ids": [categories[3].id]},
            {"title": "Savaş ve Barış", "author": "Tolstoy", "price": 40.0, "category_ids": [categories[0].id, categories[4].id]},
            {"title": "Dune", "author": "Frank Herbert", "price": 35.0, "category_ids": [categories[1].id]},
            {"title": "Harry Potter", "author": "J.K. Rowling", "price": 30.0, "category_ids": [categories[2].id]},
            {"title": "Agatha Christie", "author": "Agatha Christie", "price": 25.0, "category_ids": [categories[3].id]},
            {"title": "Romeo ve Juliet", "author": "Shakespeare", "price": 20.0, "category_ids": [categories[0].id]},
            {"title": "Yıldız Savaşları", "author": "George Lucas", "price": 30.0, "category_ids": [categories[1].id]}
        ]
        
        books = []
        for book_data in books_data:
            book = BookCRUD.create_book(db, schemas.BookCreate(**book_data))
            books.append(book)
            print(f"   ✅ Kitap: {book.title} - {book.author}")
        
        # 2. Kullanıcı puanları oluştur (Collaborative filtering için)         
        # Kullanıcı 1: Roman sever (yüksek puanlar)
        user1_ratings = [
            {"book_id": books[0].id, "rate": 9.0, "comment": "Harika bir roman!"},
            {"book_id": books[4].id, "rate": 8.5, "comment": "Çok etkileyici"},
            {"book_id": books[8].id, "rate": 8.0, "comment": "Klasik eser"},
            {"book_id": books[1].id, "rate": 6.0, "comment": "İyi ama roman değil"},
            {"book_id": books[2].id, "rate": 5.0, "comment": "Fantastik sevmiyorum"}
        ]
        
        # Kullanıcı 2: Bilim kurgu sever (yüksek puanlar)
        user2_ratings = [
            {"book_id": books[1].id, "rate": 9.5, "comment": "Mükemmel bilim kurgu!"},
            {"book_id": books[5].id, "rate": 9.0, "comment": "Harika dünya"},
            {"book_id": books[9].id, "rate": 8.5, "comment": "İyi bilim kurgu"},
            {"book_id": books[0].id, "rate": 6.5, "comment": "İyi roman ama bilim kurgu değil"},
            {"book_id": books[3].id, "rate": 5.5, "comment": "Polisiye sevmiyorum"}
        ]
        
        # Kullanıcı 3: Fantastik sever (yüksek puanlar)
        user3_ratings = [
            {"book_id": books[2].id, "rate": 9.5, "comment": "En iyi fantastik!"},
            {"book_id": books[6].id, "rate": 9.0, "comment": "Harika seri"},
            {"book_id": books[1].id, "rate": 7.0, "comment": "İyi ama fantastik değil"},
            {"book_id": books[4].id, "rate": 6.0, "comment": "Çok uzun"},
            {"book_id": books[7].id, "rate": 5.0, "comment": "Polisiye sevmiyorum"}
        ]
        
        # Kullanıcı 4: Polisiye sever (yüksek puanlar)
        user4_ratings = [
            {"book_id": books[3].id, "rate": 9.0, "comment": "Harika dedektif!"},
            {"book_id": books[7].id, "rate": 8.5, "comment": "İyi polisiye"},
            {"book_id": books[0].id, "rate": 7.5, "comment": "İyi roman"},
            {"book_id": books[2].id, "rate": 5.5, "comment": "Fantastik sevmiyorum"},
            {"book_id": books[5].id, "rate": 6.0, "comment": "Bilim kurgu sevmiyorum"}
        ]
        
        # Kullanıcı 5: Tarih sever (yüksek puanlar)
        user5_ratings = [
            {"book_id": books[4].id, "rate": 9.0, "comment": "Harika tarih romanı!"},
            {"book_id": books[0].id, "rate": 8.0, "comment": "İyi tarihsel roman"},
            {"book_id": books[8].id, "rate": 7.5, "comment": "Klasik"},
            {"book_id": books[1].id, "rate": 6.5, "comment": "İyi ama tarih değil"},
            {"book_id": books[6].id, "rate": 5.0, "comment": "Fantastik sevmiyorum"}
        ]
        
        # Tüm puanları ekle
        all_ratings = [
            (users[0].id, user1_ratings),
            (users[1].id, user2_ratings),
            (users[2].id, user3_ratings),
            (users[3].id, user4_ratings),
            (users[4].id, user5_ratings)
        ]
        
        for user_id, ratings in all_ratings:
            for rating_info in ratings:
                comment_data = schemas.CommentCreate(
                    book_id=rating_info["book_id"],
                    user_id=user_id,
                    rate=rating_info["rate"],
                    comment=rating_info["comment"]
                )
                comment = CommentCRUD.create_comment(db, comment_data)
                print(f"   ✅ Yorum: Kullanıcı {user_id} -> {comment.rate}/10 puan")
        
        # 3. Collaborative filtering modelini eğit
        print("3. Collaborative filtering modeli eğitiliyor...")
        start_time = time.time()
        
        success = AIRecommendationCRUD.train_ai_model(db)
        if not success:
            print("❌ Model eğitimi başarısız!")
            return False
        
        training_time = time.time() - start_time
        print(f"   ✅ Model eğitimi tamamlandı ({training_time:.2f} saniye)")
        
        # 4. Model bilgilerini göster           
        print("4. Model bilgileri:")
        model_info = AIRecommendationCRUD.get_ai_model_info()
        for key, value in model_info.items():
            print(f"   📊 {key}: {value}")
        
        # 5. Collaborative filtering testleri
        print("5. Collaborative filtering testleri...")
        
        # Kullanıcı 1 için öneriler (Roman sever)
        print("   👤 Kullanıcı 1 (Roman sever) için öneriler:")
        recommendations1 = AIRecommendationCRUD.get_ai_recommendations(db, users[0].id, limit=3)
        for i, book in enumerate(recommendations1, 1):
            print(f"      {i}. {book['title']} - {book['author']} (Tahmin: {book['predicted_rating']:.1f})")
        
        # Kullanıcı 2 için öneriler (Bilim kurgu sever)
        print("   👤 Kullanıcı 2 (Bilim kurgu sever) için öneriler:")
        recommendations2 = AIRecommendationCRUD.get_ai_recommendations(db, users[1].id, limit=3)
        for i, book in enumerate(recommendations2, 1):
            print(f"      {i}. {book['title']} - {book['author']} (Tahmin: {book['predicted_rating']:.1f})")
        
        # 6. Benzer kullanıcı testleri
        print("6. Benzer kullanıcı testleri...")
        
        # Kullanıcı 1'in benzer kullanıcıları
        print("   👥 Kullanıcı 1'in benzer kullanıcıları:")
        similar_users1 = AIRecommendationCRUD.get_similar_users(users[0].id, limit=3)
        for i, user in enumerate(similar_users1, 1):
            print(f"      {i}. {user['username']} (Benzerlik: {user['similarity_score']:.3f})")
        
        # Kullanıcı 2'nin benzer kullanıcıları
        print("   👥 Kullanıcı 2'nin benzer kullanıcıları:")
        similar_users2 = AIRecommendationCRUD.get_similar_users(users[1].id, limit=3)
        for i, user in enumerate(similar_users2, 1):
            print(f"      {i}. {user['username']} (Benzerlik: {user['similarity_score']:.3f})")
        
        # 7. Puan tahmin testleri
        print("7. Puan tahmin testleri...")
        
        # Kullanıcı 1 için kitap 1 puan tahmini
        test_book = books[1]  # 1984 (Bilim kurgu)
        test_user = users[0]  # Roman sever
        
        print(f"   📚 Kitap: {test_book.title} - Kullanıcı: {test_user.username}")
        
        user_based_rating = AIRecommendationCRUD.predict_rating_user_based(test_book.id, test_user.id)
        item_based_rating = AIRecommendationCRUD.predict_rating_item_based(test_book.id, test_user.id)
        hybrid_rating = AIRecommendationCRUD.predict_rating_hybrid(test_book.id, test_user.id)
        
        print(f"      Kullanıcı tabanlı tahmin: {user_based_rating:.2f}")
        print(f"      Öğe tabanlı tahmin: {item_based_rating:.2f}")
        print(f"      Hibrit tahmin: {hybrid_rating:.2f}")
        
        # 8. Kullanıcı tercihleri testi
        print("8. Kullanıcı tercihleri testi...")
        
        user_preferences = AIRecommendationCRUD.get_user_preferences(test_user.id)
        print(f"   👤 Kullanıcı {test_user.username} tercihleri:")
        print(f"      Toplam puan: {user_preferences['total_ratings']}")
        print(f"      Ortalama puan: {user_preferences['average_rating']:.2f}")
        print(f"      Benzer kullanıcı sayısı: {len(user_preferences['similar_users'])}")
        print(f"      Yüksek puanlı kitaplar: {len(user_preferences['high_rated_books'])}")
        
        # 9. Benzer kitap testi
        print("9. Benzer kitap testi...")
        
        test_book = books[0]  # Suç ve Ceza
        similar_books = AIRecommendationCRUD.get_ai_similar_books(test_book.id, limit=3)
        
        print(f"   📚 '{test_book.title}' kitabına benzer kitaplar:")
        for i, book in enumerate(similar_books, 1):
            print(f"      {i}. {book['title']} - {book['author']} (Benzerlik: {book['similarity_score']:.3f})")
        
        print("\n🎉 Collaborative filtering testi başarıyla tamamlandı!")
        return True
        
    except Exception as e:
        print(f"❌ Test hatası: {e}")
        return False
        
    finally:
        db.close()

if __name__ == "__main__":
    test_collaborative_filtering_model() 