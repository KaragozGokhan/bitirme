# 📚 Bookflix API - Python PostgreSQL Projesi

Bu proje, Python SQLAlchemy ORM kullanarak PostgreSQL veritabanı ile kitap kiralama ve satış platformu için API oluşturur.

## 🚀 Hızlı Başlangıç

### Gereksinimler

- Python 3.8+
- PostgreSQL 12+
- pip (Python paket yöneticisi)

### Kurulum

1. **Bağımlılıkları yükleyin:**

```bash
pip install -r requirements.txt
```

2. **Çevre değişkenlerini ayarlayın:**
   `.env` dosyasını düzenleyin veya oluşturun:

```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=Bookflix
DB_PASSWORD=12345
DB_PORT=5432
SECRET_KEY=your-secret-key-here
```

3. **Veritabanı tablolarını oluşturun:**
   PostgreSQL'de `Bookflix` veritabanını oluşturun ve SQL şemasını çalıştırın.

4. **Uygulamayı başlatın:**

```bash
# FastAPI uygulamasını çalıştır
python main.py

# veya uvicorn ile
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

5. **Test çalıştırın:**

```bash
python test_example.py
```

## 📁 Proje Yapısı

```
├── database.py      # Veritabanı bağlantı konfigürasyonu
├── models.py        # SQLAlchemy ORM modelleri
├── schemas.py       # Pydantic şemaları (API doğrulama)
├── crud.py          # CRUD işlemleri (Repository pattern)
├── main.py          # FastAPI uygulaması
├── config.py        # Uygulama konfigürasyonu
├── test_example.py  # Test örneği
├── requirements.txt # Python bağımlılıkları
└── README.md        # Bu dosya
```

## 🗄️ Veritabanı Tabloları

- **users** - Kullanıcı bilgileri
- **books** - Kitap bilgileri
- **user_books** - Kullanıcıların sahip olduğu kitaplar
- **rentals** - Kiralama işlemleri
- **reading_history** - Okuma geçmişi
- **categories** - Kitap kategorileri
- **comments** - Kitap yorumları ve puanları

## 🔧 API Kullanımı

### Ana Endpoints

- `GET /` - API bilgisi
- `POST /users/` - Yeni kullanıcı oluştur
- `GET /users/` - Kullanıcıları listele
- `GET /users/{user_id}` - Kullanıcı detayı
- `POST /books/` - Yeni kitap ekle
- `GET /books/` - Kitapları listele
- `GET /books/{book_id}` - Kitap detayı
- `POST /categories/` - Kategori oluştur
- `GET /categories/` - Kategorileri listele
- `POST /comments/` - Yorum ekle
- `GET /books/{book_id}/comments` - Kitap yorumları

### Swagger Dokümantasyonu

Uygulama çalıştıktan sonra: `http://localhost:8000/docs`

## 💾 CRUD İşlemleri

Her model için ayrı CRUD sınıfları:

- `UserCRUD` - Kullanıcı işlemleri
- `BookCRUD` - Kitap işlemleri
- `UserBookCRUD` - Kullanıcı-kitap ilişki işlemleri
- `RentalCRUD` - Kiralama işlemleri
- `ReadingHistoryCRUD` - Okuma geçmişi işlemleri
- `CategoryCRUD` - Kategori işlemleri
- `CommentCRUD` - Yorum işlemleri

## 🔐 Güvenlik

- Kullanıcı şifreleri bcrypt ile hashlenir
- SQLAlchemy ORM SQL injection saldırılarına karşı koruma sağlar
- Pydantic ile veri doğrulama

## 🧪 Test

```bash
# Veritabanı bağlantısını ve CRUD işlemlerini test et
python test_example.py
```

## 📝 Örnek Kullanım

```python
from database import SessionLocal
from crud import UserCRUD, BookCRUD
import schemas
from decimal import Decimal

# Veritabanı session'ı
db = SessionLocal()

# Kullanıcı oluştur
user_data = schemas.UserCreate(
    username="ahmet123",
    email="ahmet@example.com",
    password="güvenli_şifre",
    subscription_type="premium"
)
user = UserCRUD.create_user(db, user_data)

# Kitap oluştur
book_data = schemas.BookCreate(
    title="Python Programlama",
    author="Ahmet Yılmaz",
    description="Python ile uygulama geliştirme",
    price=Decimal("49.99"),
    categories=[1, 2]
)
book = BookCRUD.create_book(db, book_data)

db.close()
```

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/yeni-ozellik`)
3. Commit yapın (`git commit -am 'Yeni özellik eklendi'`)
4. Branch'i push edin (`git push origin feature/yeni-ozellik`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.
