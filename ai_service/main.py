from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import models
import schemas
import crud
from database import engine, get_db, test_connection
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Bookflix AI API", description="Yapay Zeka Tabanlı Kitap Önerisi API", version="1.0.0")

# CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Startup event - test the database connection
@app.on_event("startup")
async def startup_event():
    print("🚀 AI Uygulaması başlatılıyor...")
    if test_connection():
        print("✅ Veritabanı bağlantısı doğrulandı!")
    else:
        print("❌ Veritabanı bağlantısı başarısız!")

@app.get("/")
async def root():
    return {"message": "Bookflix AI API'ye hoş geldiniz!", "version": "1.0.0"}

# 🤖 AI Recommendation Endpoints
@app.post("/ai/train")
def train_ai_model(db: Session = Depends(get_db)):
    """
    Yapay zeka modelini eğitir
    """
    success = crud.AIRecommendationCRUD.train_ai_model(db)
    if not success:
        raise HTTPException(status_code=500, detail="Model eğitimi başarısız")
    
    return {"message": "Yapay zeka modeli başarıyla eğitildi", "status": "success"}

@app.get("/ai/similar-users-recommendations/{user_id}")
def get_similar_users_recommendations(user_id: int, limit: int = 10, db: Session = Depends(get_db)):
    """
    Get recommendations for similar users
    """
    # Check if the user exists
    user = crud.UserCRUD.get_user(db, user_id=user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı")
    
    # Get recommendations for similar users
    recommendations = crud.AIRecommendationCRUD.get_user_based_recommendations(db, user_id, limit)
    
    return {
        "user_id": user_id,
        "recommendations": recommendations,
        "total_recommendations": len(recommendations),
        "method": "similar_users_based",
        "description": "Benzer kullanıcıların yüksek puanladığı kitaplar"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 