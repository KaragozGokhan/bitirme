#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Bookflix API Test Örneği
Bu dosya, veritabanı bağlantısını ve temel CRUD işlemlerini test eder.
"""

from database import test_connection, get_db, SessionLocal
from models import User, Book, Category, Comment
from crud import UserCRUD, BookCRUD, CategoryCRUD, CommentCRUD, RecommendationCRUD
import schemas
from decimal import Decimal

def test_database_connection():
    """Veritabanı bağlantısını test eder"""
    print("🔍 Veritabanı bağlantısı test ediliyor...")
    if test_connection():
        print("✅ Veritabanı bağlantısı başarılı!")
        return True
    else:
        print("❌ Veritabanı bağlantısı başarısız!")
        return False

def test_crud_operations():
    """Temel CRUD işlemlerini test eder"""
    print("\n📝 CRUD işlemleri test ediliyor...")
    
    db = SessionLocal()
    try:
        # 1. Kategori oluştur
        print("1. Kategori oluşturuluyor...")
        category_data = schemas.CategoryCreate(name="Roman")
        category = CategoryCRUD.create_category(db, category_data)
        print(f"✅ Kategori oluşturuldu: {category.name} (ID: {category.id})")
        
        # 2. Kullanıcı oluştur
        print("2. Kullanıcı oluşturuluyor...")
        user_data = schemas.UserCreate(
            username="test_user",
            email="test@example.com",
            password="test123",
            subscription_type="free"
        )
        user = UserCRUD.create_user(db, user_data)
        print(f"✅ Kullanıcı oluşturuldu: {user.username} (ID: {user.id})")
        
        # 3. Kitap oluştur
        print("3. Kitap oluşturuluyor...")
        book_data = schemas.BookCreate(
            title="Test Kitabı",
            author="Test Yazarı",
            description="Bu bir test kitabıdır.",
            price=Decimal("29.99"),
            categories=[category.id]
        )
        book = BookCRUD.create_book(db, book_data)
        print(f"✅ Kitap oluşturuldu: {book.title} (ID: {book.id})")
        
        # 4. Verileri listele
        print("4. Veriler listeleniyor...")
        users = UserCRUD.get_users(db, limit=5)
        books = BookCRUD.get_books(db, limit=5)
        categories = CategoryCRUD.get_categories(db)
        
        print(f"📊 Toplam {len(users)} kullanıcı, {len(books)} kitap, {len(categories)} kategori bulundu")
        
        return True
        
    except Exception as e:
        print(f"❌ CRUD test hatası: {e}")
        return False
    finally:
        db.close()

def test_recommendation_system():
    """Kitap önerisi sistemini test eder"""
    print("\n🤖 Kitap önerisi sistemi test ediliyor...")
    
    db = SessionLocal()
    try:
        # Test verileri oluştur
        print("1. Test verileri oluşturuluyor...")
        
        # Kategoriler oluştur
        categories = []
        category_names = ["Roman", "Bilim Kurgu", "Tarih", "Bilim", "Felsefe"]
        for name in category_names:
            category_data = schemas.CategoryCreate(name=name)
            category = CategoryCRUD.create_category(db, category_data)
            categories.append(category)
            print(f"   ✅ Kategori: {category.name} (ID: {category.id})")
        
        # Kullanıcı oluştur
        user_data = schemas.UserCreate(
            username="test_recommendation_user",
            email="recommendation@example.com",
            password="test123",
            subscription_type="premium"
        )
        user = UserCRUD.create_user(db, user_data)
        print(f"   ✅ Test kullanıcısı: {user.username} (ID: {user.id})")
        
        # Kitaplar oluştur
        books = []
        book_data_list = [
            {"title": "Suç ve Ceza", "author": "Dostoyevski", "categories": [categories[0].id], "price": "25.99"},
            {"title": "1984", "author": "George Orwell", "categories": [categories[1].id], "price": "30.99"},
            {"title": "Savaş ve Barış", "author": "Tolstoy", "categories": [categories[0].id, categories[2].id], "price": "45.99"},
            {"title": "Dune", "author": "Frank Herbert", "categories": [categories[1].id], "price": "35.99"},
            {"title": "Felsefe Tarihi", "author": "Bertrand Russell", "categories": [categories[4].id], "price": "40.99"},
            {"title": "Küçük Prens", "author": "Saint-Exupéry", "categories": [categories[0].id], "price": "20.99"},
            {"title": "Hobbit", "author": "Tolkien", "categories": [categories[1].id], "price": "28.99"},
            {"title": "İnce Memed", "author": "Yaşar Kemal", "categories": [categories[0].id], "price": "32.99"},
        ]
        
        for book_info in book_data_list:
            book_data = schemas.BookCreate(
                title=book_info["title"],
                author=book_info["author"],
                description=f"{book_info['title']} kitabının açıklaması",
                price=Decimal(book_info["price"]),
                categories=book_info["categories"]
            )
            book = BookCRUD.create_book(db, book_data)
            books.append(book)
            print(f"   ✅ Kitap: {book.title} (ID: {book.id})")
        
        # Yorumlar ve puanlar ekle
        print("2. Yorumlar ve puanlar ekleniyor...")
        comments_data = [
            {"book_id": books[0].id, "rate": 9, "comment": "Harika bir kitap!"},
            {"book_id": books[1].id, "rate": 8, "comment": "Çok etkileyici"},
            {"book_id": books[2].id, "rate": 9, "comment": "Muhteşem bir eser"},
            {"book_id": books[3].id, "rate": 7, "comment": "İyi bir bilim kurgu"},
            {"book_id": books[4].id, "rate": 8, "comment": "Felsefe severler için mükemmel"},
            {"book_id": books[5].id, "rate": 6, "comment": "Güzel bir hikaye"},
            {"book_id": books[6].id, "rate": 8, "comment": "Fantastik edebiyatın başyapıtı"},
            {"book_id": books[7].id, "rate": 9, "comment": "Türk edebiyatının şaheseri"},
        ]
        
        for comment_info in comments_data:
            comment_data = schemas.CommentCreate(
                book_id=comment_info["book_id"],
                user_id=user.id,
                rate=comment_info["rate"],
                comment=comment_info["comment"]
            )
            comment = CommentCRUD.create_comment(db, comment_data)
            print(f"   ✅ Yorum: {comment.rate}/10 puan")
        
        # Öneri sistemi testleri
        print("3. Öneri sistemi testleri...")
        
        # Kullanıcının favori kategorilerini test et
        favorite_categories = RecommendationCRUD.get_user_favorite_categories(db, user.id)
        print(f"   📊 Kullanıcının favori kategorileri: {favorite_categories}")
        
        # Kullanıcı için kitap önerilerini test et
        recommendations = RecommendationCRUD.recommend_books_for_user(db, user.id, limit=3)
        print(f"   📚 Önerilen kitaplar ({len(recommendations)} adet):")
        for i, book in enumerate(recommendations, 1):
            print(f"      {i}. {book.title} - {book.author}")
        
        # Benzer kitaplar testi
        similar_books = RecommendationCRUD.get_similar_books(db, books[0].id, limit=3)
        print(f"   🔍 '{books[0].title}' kitabına benzer kitaplar ({len(similar_books)} adet):")
        for i, book in enumerate(similar_books, 1):
            print(f"      {i}. {book.title} - {book.author}")
        
        # Trend kitaplar testi
        trending_books = RecommendationCRUD.get_trending_books(db, limit=5)
        print(f"   📈 Trend kitaplar ({len(trending_books)} adet):")
        for i, book in enumerate(trending_books, 1):
            print(f"      {i}. {book.title} - {book.author}")
        
        print("✅ Kitap önerisi sistemi testi başarılı!")
        return True
        
    except Exception as e:
        print(f"❌ Öneri sistemi test hatası: {e}")
        import traceback
        traceback.print_exc()
        return False
    finally:
        db.close()

def main():
    """Ana test fonksiyonu"""
    print("🧪 Bookflix API Test Suite")
    print("=" * 50)
    
    # Veritabanı bağlantısını test et
    if not test_database_connection():
        print("❌ Veritabanı bağlantısı başarısız! Testler durduruluyor.")
        return
    
    # Temel CRUD işlemlerini test et
    if not test_crud_operations():
        print("❌ CRUD testleri başarısız!")
        return
    
    # Kitap önerisi sistemini test et
    if not test_recommendation_system():
        print("❌ Öneri sistemi testleri başarısız!")
        return
    
    print("\n🎉 Tüm testler başarıyla tamamlandı!")
    print("🚀 API kullanıma hazır!")

if __name__ == "__main__":
    main() 