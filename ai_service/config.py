import os
from dotenv import load_dotenv

# .env dosyasını yükle
load_dotenv()

class Settings:
    """Uygulama ayarları"""
    
    # Database settings
    DB_USER: str = os.getenv("DB_USER", "postgres")
    DB_HOST: str = os.getenv("DB_HOST", "localhost")
    DB_NAME: str = os.getenv("DB_NAME", "Bookflix")
    DB_PASSWORD: str = os.getenv("DB_PASSWORD", "12345")
    DB_PORT: str = os.getenv("DB_PORT", "5432")
    
    # Application settings
    API_TITLE: str = "Bookflix API"
    API_DESCRIPTION: str = "Kitap Kiralama ve Satış Platformu API"
    API_VERSION: str = "1.0.0"
    
    # Security settings
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-here")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    
    @property
    def database_url(self) -> str:
        """PostgreSQL bağlantı URL'si"""
        return f"postgresql://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
    
    def get_db_config(self) -> dict:
        """Veritabanı konfigürasyonu sözlüğü döndürür"""
        return {
            "host": self.DB_HOST,
            "database": self.DB_NAME,
            "user": self.DB_USER,
            "password": self.DB_PASSWORD,
            "port": self.DB_PORT
        }

# Global settings instance  
settings = Settings() 