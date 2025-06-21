import React from "react";
import { Book } from "../infrastructure/types";
import { bookService } from "../infrastructure/services/api";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  Stack,
  IconButton,
  Tooltip,
  CardActionArea,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import { useNavigate } from "react-router-dom";
import { useCart } from '../infrastructure/contexts/CartContext';
import { useMyBooks } from '../infrastructure/contexts/MyBooksContext';
import { toast } from 'react-toastify';
import { AddShoppingCart } from '@mui/icons-material';

interface BookCardProps {
  book: Book;
}

export const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();
  const { myBooks } = useMyBooks();

  const isBookInLibrary = myBooks.some((b) => b.id === book.id);
  const isBookInCart = cartItems.some((item) => item.id === book.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(book);
    toast.success('Kitap sepete eklendi!');
  };

  const handleGoToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/cart');
  };

  const handleCardClick = () => {
    navigate(`/book/${book.id}`);
  };

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <CardActionArea onClick={handleCardClick} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <CardMedia
          component="img"
          sx={{
            height: 280,
            objectFit: 'cover',
          }}
          image={
            book.cover_image_url
              ? book.cover_image_url.startsWith('kitaplar/')
                ? `/${book.cover_image_url}`
                : book.cover_image_url
              : 'https://via.placeholder.com/300x400'
          }
          alt={book.title}
        />
        <CardContent sx={{ flexGrow: 1, width: '100%', p: 2 }}>
          <Typography gutterBottom variant="h6" component="div" noWrap>
            {book.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {book.author}
          </Typography>
        </CardContent>
      </CardActionArea>
      <Box sx={{ p: 2, pt: 0 }}>
        <Stack spacing={1}>
          <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
            ₺{Number(book.price).toFixed(2)}
          </Typography>
          {isBookInLibrary ? (
            <Button variant="contained" disabled fullWidth>
              Kütüphanenizde
            </Button>
          ) : isBookInCart ? (
            <Button variant="outlined" onClick={handleGoToCart} fullWidth>
              Sepete Git
            </Button>
          ) : (
            <Button variant="contained" startIcon={<AddShoppingCart />} onClick={handleAddToCart} fullWidth>
              Sepete Ekle
            </Button>
          )}
        </Stack>
      </Box>
    </Card>
  );
};
