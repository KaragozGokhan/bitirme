import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Paper,
  IconButton,
  Modal,
} from "@mui/material";
import { Delete, CreditCard } from "@mui/icons-material";
import { useCart } from "../infrastructure/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { useMyBooks } from "../infrastructure/contexts/MyBooksContext";
import { toast } from "react-toastify";
import PremiumPaymentForm from "./shared/PremiumPaymentForm";

export const CartPage: React.FC = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const { addBooksToLibrary } = useMyBooks();
  const navigate = useNavigate();
  const [showPayment, setShowPayment] = useState(false);

  const handleRemoveFromCart = (bookId: number) => {
    removeFromCart(bookId);
    toast.info("Kitap sepetten çıkarıldı");
  };

  const handlePurchaseSuccess = async (items: any[]) => {
    try {
      // Kitapları backend'e ekle
      const booksWithAcquisition = items.map((book) => ({
        ...book,
        acquisition_method: "purchase" as const,
      }));

      await addBooksToLibrary(booksWithAcquisition);

      // Başarı mesajı göster
      toast.success(
        `${items.length} kitap başarıyla satın alındı ve kütüphanenize eklendi!`,
        {
          position: "top-center",
          autoClose: 3000,
        }
      );

      // Sepeti temizle
      clearCart();

      // 2 saniye sonra kitaplarım sayfasına yönlendir
      setTimeout(() => {
        navigate("/my-books");
      }, 2000);
    } catch (error) {
      console.error("Satın alma işlemi sırasında hata:", error);
      toast.error("Kitaplar kütüphanenize eklenirken bir hata oluştu.");
    }
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0
  );

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Sepetim
      </Typography>
      {cartItems.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6">Sepetinizde ürün bulunmuyor.</Typography>
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => navigate("/")}
          >
            Alışverişe Başla
          </Button>
        </Paper>
      ) : (
        <Paper sx={{ p: 2 }}>
          <List>
            {cartItems.map((item) => (
              <React.Fragment key={item.id}>
                <ListItem
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleRemoveFromCart(item.id)}
                    >
                      <Delete />
                    </IconButton>
                  }
                >
                  <ListItemAvatar>
                    <Avatar
                      src={
                        item.cover_image_url &&
                        item.cover_image_url.startsWith("kitaplar/")
                          ? `/${item.cover_image_url}`
                          : item.cover_image_url ||
                            "https://via.placeholder.com/60x90"
                      }
                      alt={item.title}
                      variant="square"
                      sx={{ width: 60, height: 90, mr: 2 }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={item.title}
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {item.author}
                        </Typography>
                        <br />
                        Fiyat: ₺{Number(item.price).toFixed(2)}
                      </>
                    }
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}
          </List>
          <Box
            sx={{
              mt: 3,
              p: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h5" fontWeight="bold">
              Toplam Tutar: ₺{totalPrice.toFixed(2)}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<CreditCard />}
              onClick={() => setShowPayment(true)}
              disabled={cartItems.length === 0}
            >
              Satın Al
            </Button>
          </Box>
        </Paper>
      )}

      {/* Premium ödeme formu modalı */}
      {showPayment && (
        <Modal
          open={showPayment}
          onClose={() => setShowPayment(false)}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <Box>
            <PremiumPaymentForm
              type="purchase"
              cartItems={cartItems}
              onClose={() => setShowPayment(false)}
              onPurchaseSuccess={handlePurchaseSuccess}
            />
          </Box>
        </Modal>
      )}
    </Container>
  );
};
