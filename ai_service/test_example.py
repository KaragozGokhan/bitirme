#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Bookflix API Test Örneği
Bu dosya, veritabanı bağlantısını ve temel CRUD işlemlerini test eder.
"""

from database import test_connection, get_db, SessionLocal
from models import User, Book, Category
from crud import UserCRUD, BookCRUD, CategoryCRUD
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

def main():
    """Ana test fonksiyonu"""
    print("🚀 Bookflix API Test Başlatılıyor...\n")
    
    # Veritabanı bağlantısını test et
    if not test_database_connection():
        print("❌ Veritabanı bağlantısı kurulamadı. Test durduruluyor.")
        return
    
    # CRUD işlemlerini test et
    if test_crud_operations():
        print("\n✅ Tüm testler başarıyla tamamlandı!")
    else:
        print("\n❌ Testlerde hata oluştu!")

if __name__ == "__main__":
    main() 