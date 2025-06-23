from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from decimal import Decimal

# Base şemalar
class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    password: str
    subscription_type: Optional[str] = 'free'

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None
    subscription_type: Optional[str] = None
    subscription_end_date: Optional[datetime] = None

class User(UserBase):
    id: int
    created_at: datetime
    subscription_type: str
    subscription_end_date: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Kitap şemaları
class BookBase(BaseModel):
    title: str
    author: str
    description: Optional[str] = None
    cover_image_url: Optional[str] = None
    pdf_url: Optional[str] = None
    audio_url: Optional[str] = None
    price: Decimal
    categories: Optional[List[int]] = None

class BookCreate(BookBase):
    pass

class BookUpdate(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    description: Optional[str] = None
    cover_image_url: Optional[str] = None
    pdf_url: Optional[str] = None
    audio_url: Optional[str] = None
    price: Optional[Decimal] = None
    categories: Optional[List[int]] = None

class Book(BookBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Kullanıcı kitapları şemaları
class UserBookBase(BaseModel):
    user_id: int
    book_id: int
    acquisition_method: str = 'purchase'

class UserBookCreate(UserBookBase):
    pass

class UserBook(UserBookBase):
    id: int
    acquired_at: datetime
    
    class Config:
        from_attributes = True

# Kiralama şemaları
class RentalBase(BaseModel):
    user_id: int
    book_id: int
    status: str = 'active'

class RentalCreate(RentalBase):
    pass

class RentalUpdate(BaseModel):
    return_date: Optional[datetime] = None
    status: Optional[str] = None

class Rental(RentalBase):
    id: int
    rental_date: datetime
    return_date: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Okuma geçmişi şemaları
class ReadingHistoryBase(BaseModel):
    user_id: int
    book_id: int
    last_page: int = 1

class ReadingHistoryCreate(ReadingHistoryBase):
    pass

class ReadingHistoryUpdate(BaseModel):
    last_page: Optional[int] = None

class ReadingHistory(ReadingHistoryBase):
    id: int
    last_read: datetime
    
    class Config:
        from_attributes = True

# Kategori şemaları
class CategoryBase(BaseModel):
    name: str

class CategoryCreate(CategoryBase):
    pass

class Category(CategoryBase):
    id: int
    
    class Config:
        from_attributes = True

# Yorum şemaları
class CommentBase(BaseModel):
    comment: str
    book_id: int
    user_id: int
    rate: Optional[int] = None

class CommentCreate(CommentBase):
    pass

class CommentUpdate(BaseModel):
    comment: Optional[str] = None
    rate: Optional[int] = None

class Comment(CommentBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True 