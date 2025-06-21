import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  Avatar,
  Stack,
  Alert,
  Chip,
} from '@mui/material';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { useReview } from '../../infrastructure/contexts/ReviewContext';
import { useMyBooks } from '../../infrastructure/contexts/MyBooksContext';
import { StarRating } from './StarRating';

interface ReviewSectionProps {
  bookId: number;
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({ bookId }) => {
  const { reviews, addReview, getBookReviews, getUserReview, hasUserReviewed } = useReview();
  const { myBooks } = useMyBooks();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [showForm, setShowForm] = useState(false);

  const userId = parseInt(localStorage.getItem('userId') || '1');
  const isBookOwned = myBooks.some(book => book.id === bookId);
  const userReview = getUserReview(bookId, userId);
  const bookReviews = getBookReviews(bookId);
  const averageRating = bookReviews.length > 0 
    ? bookReviews.reduce((sum, review) => sum + review.rating, 0) / bookReviews.length 
    : 0;

  const handleSubmitReview = () => {
    if (rating === 0) {
      alert('Lütfen bir puan verin');
      return;
    }
    if (comment.trim().length < 10) {
      alert('Yorumunuz en az 10 karakter olmalıdır');
      return;
    }

    addReview(bookId, rating, comment);
    setRating(0);
    setComment('');
    setShowForm(false);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: tr });
    } catch {
      return 'Geçersiz tarih';
    }
  };

  if (!isBookOwned) {
    return null; // Kitabı satın almamış kullanıcılar için yorum bölümü görünmez
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Yorumlar ve Puanlar
      </Typography>
      
      {/* Ortalama Puan */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="h4" color="primary">
            {averageRating.toFixed(1)}
          </Typography>
          <Box>
            <StarRating 
              rating={Math.round(averageRating)} 
              onRatingChange={() => {}} 
              readonly 
              size="large"
            />
            <Typography variant="body2" color="text.secondary">
              {bookReviews.length} yorum
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* Yorum Yapma Formu */}
      {!userReview && !showForm && (
        <Button 
          variant="contained" 
          onClick={() => setShowForm(true)}
          sx={{ mb: 2 }}
        >
          Yorum Yap
        </Button>
      )}

      {(showForm || userReview) && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {userReview ? 'Yorumunuz' : 'Yorum Yapın'}
          </Typography>
          
          {!userReview && (
            <>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Puanınız:
                </Typography>
                <StarRating 
                  rating={rating} 
                  onRatingChange={setRating}
                  size="large"
                />
              </Box>
              
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Yorumunuz"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Bu kitap hakkında düşüncelerinizi paylaşın..."
                sx={{ mb: 2 }}
              />
              
              <Stack direction="row" spacing={1}>
                <Button 
                  variant="contained" 
                  onClick={handleSubmitReview}
                  disabled={rating === 0 || comment.trim().length < 10}
                >
                  Yayınla
                </Button>
                <Button 
                  variant="outlined" 
                  onClick={() => setShowForm(false)}
                >
                  İptal
                </Button>
              </Stack>
            </>
          )}

          {userReview && (
            <Box>
              <Stack direction="row" spacing={2} alignItems="flex-start">
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  {userReview.username.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {userReview.username}
                    </Typography>
                    <StarRating 
                      rating={userReview.rating} 
                      onRatingChange={() => {}} 
                      readonly 
                      size="small"
                    />
                  </Stack>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {userReview.comment}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(userReview.createdAt)}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          )}
        </Paper>
      )}

      {/* Diğer Yorumlar */}
      {bookReviews.length > 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Diğer Kullanıcı Yorumları
          </Typography>
          
          {bookReviews
            .filter(review => review.userId !== userId) // Kendi yorumunu gösterme
            .map((review) => (
              <Paper key={review.id} sx={{ p: 2, mb: 2 }}>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    {review.username.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {review.username}
                      </Typography>
                      <StarRating 
                        rating={review.rating} 
                        onRatingChange={() => {}} 
                        readonly 
                        size="small"
                      />
                    </Stack>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {review.comment}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(review.createdAt)}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            ))}
        </Box>
      )}

      {bookReviews.length === 0 && !userReview && (
        <Alert severity="info">
          Bu kitap için henüz yorum yapılmamış. İlk yorumu siz yapın!
        </Alert>
      )}
    </Box>
  );
}; 