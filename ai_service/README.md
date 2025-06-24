# 📚 Bookflix API - Python PostgreSQL Projesi

Bu proje, Python SQLAlchemy ORM kullanarak PostgreSQL veritabanı ile kitap kiralama ve satış platformu için API oluşturur. **Yapay zeka destekli kitap önerisi sistemi** ile kullanıcılara kişiselleştirilmiş öneriler sunar.

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

## 🤖 Yapay Zeka Destekli Kitap Önerisi Sistemi

### Özellikler

1. **Kişiselleştirilmiş Öneriler:** Kullanıcının okuma geçmişi ve puanlarına göre
2. **Kategori Bazlı Öneriler:** Favori kategorilerdeki popüler kitaplar
3. **Benzer Kitap Önerileri:** Belirli bir kitaba benzer kitaplar
4. **Trend Kitaplar:** Son zamanlarda popüler olan kitaplar
5. **Akıllı Filtreleme:** Kullanıcının zaten okuduğu kitapları hariç tutar

### Algoritma

1. **Kullanıcı Profili Analizi:**
   - Kullanıcının yüksek puan verdiği kitapların kategorilerini analiz eder
   - En çok tercih edilen kategorileri belirler

2. **Kitap Önerisi:**
   - Favori kategorilerdeki popüler kitapları bulur
   - Kullanıcının henüz okumadığı kitapları filtreler
   - Yeterli öneri yoksa genel popüler kitapları ekler

3. **Benzerlik Analizi:**
   - Aynı kategorilerdeki kitapları önerir
   - Kullanıcı davranışlarını analiz eder

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

### 🤖 Kitap Önerisi Endpoints

- `GET /recommendations/{user_id}` - Kullanıcı için kişiselleştirilmiş öneriler
- `GET /books/{book_id}/similar` - Benzer kitaplar
- `GET /trending` - Trend kitaplar
- `GET /users/{user_id}/favorite-categories` - Kullanıcının favori kategorileri
- `GET /categories/{category_id}/popular` - Kategorideki popüler kitaplar

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
- `RecommendationCRUD` - **Kitap önerisi işlemleri**

## 🔐 Güvenlik

- Kullanıcı şifreleri bcrypt ile hashlenir
- SQLAlchemy ORM SQL injection saldırılarına karşı koruma sağlar
- Pydantic ile veri doğrulama

## 🧪 Test

```bash
# Veritabanı bağlantısını ve CRUD işlemlerini test et
python test_example.py
```

Test dosyası şunları test eder:
- Veritabanı bağlantısı
- Temel CRUD işlemleri
- **Kitap önerisi sistemi**
- Kullanıcı profili analizi
- Benzer kitap önerileri
- Trend kitaplar

## 📝 Örnek Kullanım

### Temel İşlemler

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

### Kitap Önerisi Sistemi

```python
from crud import RecommendationCRUD

# Kullanıcı için öneriler
recommendations = RecommendationCRUD.recommend_books_for_user(db, user_id=1, limit=5)
for book in recommendations:
    print(f"Önerilen: {book.title} - {book.author}")

# Benzer kitaplar
similar_books = RecommendationCRUD.get_similar_books(db, book_id=1, limit=3)
for book in similar_books:
    print(f"Benzer: {book.title} - {book.author}")

# Trend kitaplar
trending = RecommendationCRUD.get_trending_books(db, limit=10)
for book in trending:
    print(f"Trend: {book.title} - {book.author}")
```

### API Kullanımı

```bash
# Kullanıcı için öneriler
curl "http://localhost:8000/recommendations/1?limit=5"

# Benzer kitaplar
curl "http://localhost:8000/books/1/similar?limit=3"

# Trend kitaplar
curl "http://localhost:8000/trending?limit=10"

# Kullanıcının favori kategorileri
curl "http://localhost:8000/users/1/favorite-categories"
```

## 🎯 Öneri Sistemi Özellikleri

### Kullanıcı Profili
- Okuma geçmişi analizi
- Kategori tercihleri
- Puanlama davranışları

### Öneri Algoritması
- **Collaborative Filtering:** Benzer kullanıcıların tercihleri
- **Content-Based Filtering:** Kitap içerik ve kategori analizi
- **Hybrid Approach:** Her iki yöntemin kombinasyonu

### Performans Optimizasyonu
- Veritabanı indeksleri
- Önbellekleme stratejileri
- Asenkron işlemler

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

Proje hakkında sorularınız için issue açabilirsiniz.

---

**🚀 Bookflix API ile yapay zeka destekli kitap önerileri keşfedin!**
