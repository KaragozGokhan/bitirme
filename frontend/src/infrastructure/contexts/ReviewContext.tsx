import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface Review {
  id: string;
  bookId: number;
  userId: number;
  username: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ReviewContextType {
  reviews: Review[];
  addReview: (bookId: number, rating: number, comment: string) => void;
  getBookReviews: (bookId: number) => Review[];
  getUserReview: (bookId: number, userId: number) => Review | null;
  hasUserReviewed: (bookId: number, userId: number) => boolean;
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

export const useReview = () => {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error('useReview must be used within a ReviewProvider');
  }
  return context;
};

interface ReviewProviderProps {
  children: ReactNode;
}

export const ReviewProvider: React.FC<ReviewProviderProps> = ({ children }) => {
  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const items = localStorage.getItem('bookReviews');
      return items ? JSON.parse(items) : [];
    } catch (error) {
      console.error("Yorum verisi okunurken hata oluştu:", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('bookReviews', JSON.stringify(reviews));
    } catch (error) {
      console.error("Yorum verisi kaydedilirken hata oluştu:", error);
    }
  }, [reviews]);

  const addReview = (bookId: number, rating: number, comment: string) => {
    const userId = parseInt(localStorage.getItem('userId') || '1');
    const username = localStorage.getItem('username') || localStorage.getItem('user') || 'Kullanıcı';
    
    const newReview: Review = {
      id: Date.now().toString(),
      bookId,
      userId,
      username,
      rating,
      comment,
      createdAt: new Date().toISOString(),
    };

    setReviews(prev => {
      // Eğer kullanıcı bu kitap için zaten yorum yapmışsa, eski yorumu güncelle
      const existingReviewIndex = prev.findIndex(
        review => review.bookId === bookId && review.userId === userId
      );
      
      if (existingReviewIndex !== -1) {
        const updatedReviews = [...prev];
        updatedReviews[existingReviewIndex] = newReview;
        return updatedReviews;
      }
      
      return [...prev, newReview];
    });
  };

  const getBookReviews = (bookId: number) => {
    return reviews.filter(review => review.bookId === bookId);
  };

  const getUserReview = (bookId: number, userId: number) => {
    return reviews.find(review => review.bookId === bookId && review.userId === userId) || null;
  };

  const hasUserReviewed = (bookId: number, userId: number) => {
    return reviews.some(review => review.bookId === bookId && review.userId === userId);
  };

  return (
    <ReviewContext.Provider value={{ 
      reviews, 
      addReview, 
      getBookReviews, 
      getUserReview, 
      hasUserReviewed 
    }}>
      {children}
    </ReviewContext.Provider>
  );
}; 