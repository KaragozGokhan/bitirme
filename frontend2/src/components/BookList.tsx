import React, { useEffect, useState } from 'react';
import { bookService } from '../infrastructure/services/api';
import { Book } from '../infrastructure/types';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';

export const BookList: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await bookService.getAllBooks();
        setBooks(response);
      } catch (err) {
        setError('Kitaplar yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleRent = async (bookId: number) => {
    try {
      await bookService.rentBook(bookId);
      // Kitap listesini güncelle
      const updatedBooks = books.map(book =>
        book.id === bookId ? { ...book, isAvailable: false } : book
      );
      setBooks(updatedBooks);
    } catch (err) {
      setError('Kitap kiralanırken bir hata oluştu.');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4, mb: 4 }}>
        Kitaplar
      </Typography>
      <Grid container spacing={4}>
        {books.map((book) => (
          <Grid item key={book.id} xs={12} sm={6} md={4} lg={3}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  boxShadow: 6,
                },
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={book.coverImage || 'https://via.placeholder.com/200x300'}
                alt={book.title}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="h2">
                  {book.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {book.author}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {book.description?.substring(0, 100)}...
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    disabled={!book.isAvailable}
                    onClick={() => handleRent(book.id)}
                  >
                    {book.isAvailable ? 'Kirala' : 'Kiralanmış'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}; 