import React, { useEffect } from "react";
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
import { useCart } from "../infrastructure/contexts/CartContext";
import { useMyBooks } from "../infrastructure/contexts/MyBooksContext";
import { toast } from "react-toastify";
import { AddShoppingCart } from "@mui/icons-material";

interface BookCardProps {
  book: Book;
}

export const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();
  const { myBooks, isPremiumUser, addBooksToLibrary, user, loading } =
    useMyBooks();

  const isBookInLibrary = myBooks.some((b) => b.id === book.id);
  const isBookInCart = cartItems.some((item) => item.id === book.id);

  // When the premium status changes, re-render the component
  useEffect(() => {
    // This effect will run when isPremiumUser changes
  }, [isPremiumUser, user?.subscription_type]);

  // Check the loading state when the user changes
  const shouldShowLoading = loading || !user;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Premium users cannot use the cart
    if (isPremiumUser) {
      toast.info(
        "Premium üyeler tüm kitaplara ücretsiz erişime sahiptir. Direkt kütüphaneye ekleme özelliğini kullanın!"
      );
      return;
    }

    addToCart(book);
    toast.success("Kitap sepete eklendi!");
  };

  const handleAddToLibrary = async (e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      const bookWithAcquisition = {
        ...book,
        acquisition_method: "premium" as const,
      };
      await addBooksToLibrary([bookWithAcquisition]);
      toast.success(
        `"${book.title}" kitabı kütüphanenize eklendi! (Premium Üyelik)`
      );
    } catch (error) {
      console.error("Kitap ekleme hatası:", error);
      toast.error("Kitap eklenirken bir hata oluştu.");
    }
  };

  const handleGoToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate("/cart");
  };

  const handleCardClick = () => {
    navigate(`/book/${book.id}`);
  };

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: (theme) => theme.shadows[8],
        },
      }}
    >
      <CardActionArea
        onClick={handleCardClick}
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          transition: "all 0.2s ease-in-out",
        }}
      >
        <CardMedia
          component="img"
          sx={{
            height: 280,
            objectFit: "cover",
          }}
          image={
            book.cover_image_url
              ? book.cover_image_url.startsWith("kitaplar/")
                ? `/${book.cover_image_url}`
                : book.cover_image_url
              : "https://via.placeholder.com/300x400"
          }
          alt={book.title}
        />
        <CardContent sx={{ flexGrow: 1, width: "100%", p: 2 }}>
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
          {!isPremiumUser && (
            <Typography
              variant="h6"
              color="primary"
              sx={{ fontWeight: "bold" }}
            >
              {Number(book.price).toFixed(2)}₺
            </Typography>
          )}
          {shouldShowLoading ? (
            <Button variant="outlined" disabled fullWidth>
              Yükleniyor...
            </Button>
          ) : isBookInLibrary ? (
            <Button variant="contained" disabled fullWidth>
              Kütüphanenizde
            </Button>
          ) : isPremiumUser ? (
            <Button
              variant="contained"
              startIcon={<LocalLibraryIcon />}
              onClick={handleAddToLibrary}
              fullWidth
            >
              Kitaplığına Ekle
            </Button>
          ) : isBookInCart ? (
            <Button variant="outlined" onClick={handleGoToCart} fullWidth>
              Sepete Git
            </Button>
          ) : (
            <Button
              variant="contained"
              startIcon={<AddShoppingCart />}
              onClick={handleAddToCart}
              fullWidth
            >
              Sepete Ekle
            </Button>
          )}
        </Stack>
      </Box>
    </Card>
  );
};
