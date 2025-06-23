from sqlalchemy import Column, Integer, String, Text, DECIMAL, TIMESTAMP, Boolean, ForeignKey, ARRAY, CheckConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
from datetime import datetime
from typing import List, Optional

# Kullanıcılar modeli
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(100), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())
    subscription_type = Column(String(20), default='free')
    subscription_end_date = Column(TIMESTAMP, nullable=True)
    
    # İlişkiler
    user_books = relationship("UserBook", back_populates="user", cascade="all, delete-orphan")
    rentals = relationship("Rental", back_populates="user")
    reading_history = relationship("ReadingHistory", back_populates="user")
    comments = relationship("Comment", back_populates="user", cascade="all, delete-orphan")

# Kitaplar modeli
class Book(Base):
    __tablename__ = "books"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    author = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    cover_image_url = Column(String(255), nullable=True)
    pdf_url = Column(String(255), nullable=True)
    audio_url = Column(String(255), nullable=True)
    price = Column(DECIMAL(10, 2), nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())
    categories = Column(ARRAY(Integer), nullable=True)
    
    # İlişkiler
    user_books = relationship("UserBook", back_populates="book", cascade="all, delete-orphan")
    rentals = relationship("Rental", back_populates="book")
    reading_history = relationship("ReadingHistory", back_populates="book")
    comments = relationship("Comment", back_populates="book", cascade="all, delete-orphan")

# Kullanıcı kitapları modeli
class UserBook(Base):
    __tablename__ = "user_books"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    book_id = Column(Integer, ForeignKey("books.id", ondelete="CASCADE"), nullable=False)
    acquisition_method = Column(String(20), nullable=False, default='purchase')
    acquired_at = Column(TIMESTAMP, server_default=func.current_timestamp())
    
    # İlişkiler
    user = relationship("User", back_populates="user_books")
    book = relationship("Book", back_populates="user_books")
    
    # Unique constraint
    __table_args__ = (
        CheckConstraint("acquisition_method IN ('purchase', 'premium', 'gift')", name='check_acquisition_method'),
    )

# Kiralama modeli
class Rental(Base):
    __tablename__ = "rentals"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    book_id = Column(Integer, ForeignKey("books.id"), nullable=False)
    rental_date = Column(TIMESTAMP, server_default=func.current_timestamp())
    return_date = Column(TIMESTAMP, nullable=True)
    status = Column(String(20), default='active')
    
    # İlişkiler
    user = relationship("User", back_populates="rentals")
    book = relationship("Book", back_populates="rentals")

# Okuma geçmişi modeli
class ReadingHistory(Base):
    __tablename__ = "reading_history"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    book_id = Column(Integer, ForeignKey("books.id"), nullable=False)
    last_page = Column(Integer, default=1)
    last_read = Column(TIMESTAMP, server_default=func.current_timestamp())
    
    # İlişkiler
    user = relationship("User", back_populates="reading_history")
    book = relationship("Book", back_populates="reading_history")

# Kategoriler modeli
class Category(Base):
    __tablename__ = "categories"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), unique=True, nullable=False)

# Yorumlar modeli
class Comment(Base):
    __tablename__ = "comments"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    comment = Column(Text, nullable=False)
    book_id = Column(Integer, ForeignKey("books.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())
    rate = Column(Integer, CheckConstraint("rate >= 1 AND rate <= 10"), nullable=True)
    
    # İlişkiler
    user = relationship("User", back_populates="comments")
    book = relationship("Book", back_populates="comments") 