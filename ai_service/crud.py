from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from typing import List, Optional
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