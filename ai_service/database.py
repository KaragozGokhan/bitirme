import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import psycopg2

# .env dosyasını yükle
load_dotenv()

# Veritabanı bağlantı bilgileri
DB_USER = os.getenv('DB_USER', 'postgres')
DB_HOST = os.getenv('DB_HOST', 'localhost')
DB_NAME = os.getenv('DB_NAME', 'Bookflix')
DB_PASSWORD = os.getenv('DB_PASSWORD', '12345')
DB_PORT = os.getenv('DB_PORT', '5432')

# PostgreSQL bağlantı URL'si
DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# SQLAlchemy engine oluştur
engine = create_engine(DATABASE_URL, echo=True)

# SessionLocal sınıfı oluştur
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base sınıfı oluştur
Base = declarative_base()

# Veritabanı bağlantısını test etmek için fonksiyon
def test_connection():
    try:
        with psycopg2.connect(
            host=DB_HOST,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD,
            port=DB_PORT
        ) as conn:
            print("✅ Veritabanı bağlantısı başarılı!")
            return True
    except Exception as e:
        print(f"❌ Veritabanı bağlantı hatası: {e}")
        return False

# Veritabanı session'ı almak için dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 