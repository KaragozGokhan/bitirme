from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import models
import schemas
import crud
from database import engine, get_db, test_connection



app = FastAPI(title="Bookflix API", description="Kitap Kiralama ve Satış Platformu API", version="1.0.0")

# Startup event - veritabanı bağlantısını test et
@app.on_event("startup")
async def startup_event():
    print("🚀 Uygulama başlatılıyor...")
    if test_connection():
        print("✅ Veritabanı bağlantısı doğrulandı!")
    else:
        print("❌ Veritabanı bağlantısı başarısız!")

@app.get("/")
async def root():
    return {"message": "Bookflix API'ye hoş geldiniz!", "version": "1.0.0"}

# Kullanıcı endpoints
@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.UserCRUD.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Bu email adresi zaten kayıtlı")
    
    db_user = crud.UserCRUD.get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Bu kullanıcı adı zaten alınmış")
    
    return crud.UserCRUD.create_user(db=db, user=user)

@app.get("/users/", response_model=List[schemas.User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = crud.UserCRUD.get_users(db, skip=skip, limit=limit)
    return users

@app.get("/users/{user_id}", response_model=schemas.User)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.UserCRUD.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı")
    return db_user

# Kitap endpoints
@app.post("/books/", response_model=schemas.Book)
def create_book(book: schemas.BookCreate, db: Session = Depends(get_db)):
    return crud.BookCRUD.create_book(db=db, book=book)

@app.get("/books/", response_model=List[schemas.Book])
def read_books(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    books = crud.BookCRUD.get_books(db, skip=skip, limit=limit)
    return books

@app.get("/books/{book_id}", response_model=schemas.Book)
def read_book(book_id: int, db: Session = Depends(get_db)):
    db_book = crud.BookCRUD.get_book(db, book_id=book_id)
    if db_book is None:
        raise HTTPException(status_code=404, detail="Kitap bulunamadı")
    return db_book

# Kullanıcı kitapları endpoints
@app.post("/user-books/", response_model=schemas.UserBook)
def add_book_to_user(user_book: schemas.UserBookCreate, db: Session = Depends(get_db)):
    # Kullanıcının bu kitaba zaten sahip olup olmadığını kontrol et
    if crud.UserBookCRUD.check_user_has_book(db, user_book.user_id, user_book.book_id):
        raise HTTPException(status_code=400, detail="Kullanıcı bu kitaba zaten sahip")
    
    return crud.UserBookCRUD.add_book_to_user(db=db, user_book=user_book)

@app.get("/users/{user_id}/books", response_model=List[schemas.UserBook])
def get_user_books(user_id: int, db: Session = Depends(get_db)):
    return crud.UserBookCRUD.get_user_books(db, user_id=user_id)

# Kategori endpoints
@app.get("/categories/", response_model=List[schemas.Category])
def read_categories(db: Session = Depends(get_db)):
    return crud.CategoryCRUD.get_categories(db)

@app.post("/categories/", response_model=schemas.Category)
def create_category(category: schemas.CategoryCreate, db: Session = Depends(get_db)):
    return crud.CategoryCRUD.create_category(db=db, category=category)

# Yorum endpoints
@app.get("/books/{book_id}/comments", response_model=List[schemas.Comment])
def get_book_comments(book_id: int, db: Session = Depends(get_db)):
    return crud.CommentCRUD.get_book_comments(db, book_id=book_id)

@app.post("/comments/", response_model=schemas.Comment)
def create_comment(comment: schemas.CommentCreate, db: Session = Depends(get_db)):
    return crud.CommentCRUD.create_comment(db=db, comment=comment)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 