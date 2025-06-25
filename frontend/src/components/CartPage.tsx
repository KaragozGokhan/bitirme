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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { Delete, CreditCard, DeleteSweep } from "@mui/icons-material";
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
  const [removeConfirmOpen, setRemoveConfirmOpen] = useState(false);
  const [bookToRemove, setBookToRemove] = useState<{
    id: number;
    title: string;
  } | null>(null);
  const [clearCartConfirmOpen, setClearCartConfirmOpen] = useState(false);

  const handleRemoveClick = (bookId: number, bookTitle: string) => {
    setBookToRemove({ id: bookId, title: bookTitle });
    setRemoveConfirmOpen(true);
  };

  const handleRemoveConfirm = () => {
    if (bookToRemove) {
      removeFromCart(bookToRemove.id);
      toast.info("Kitap sepetten çıkarıldı");
    }
    setRemoveConfirmOpen(false);
    setBookToRemove(null);
  };

  const handleRemoveCancel = () => {
    setRemoveConfirmOpen(false);
    setBookToRemove(null);
  };

  const handleClearCartClick = () => {
    setClearCartConfirmOpen(true);
  };

  const handleClearCartConfirm = () => {
    clearCart();
    toast.info("Sepet temizlendi");
    setClearCartConfirmOpen(false);
  };

  const handleClearCartCancel = () => {
    setClearCartConfirmOpen(false);
  };

  const handlePurchaseSuccess = async (items: any[]) => {
    try {
      // Add books to the backend
      const booksWithAcquisition = items.map((book) => ({
        ...book,
        acquisition_method: "purchase" as const,
      }));

      await addBooksToLibrary(booksWithAcquisition);

      // Show success message
      toast.success(
        `${items.length} kitap başarıyla satın alındı ve kütüphanenize eklendi!`,
        {
          position: "top-center",
          autoClose: 3000,
        }
      );

      // Clear the cart
      clearCart();

      // Redirect to my-books page after 2 seconds
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Sepetim
        </Typography>
        {cartItems.length > 0 && (
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteSweep />}
            onClick={handleClearCartClick}
            size="small"
          >
            Sepeti Temizle
          </Button>
        )}
      </Box>
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
                      onClick={() => handleRemoveClick(item.id, item.title)}
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
                        Fiyat: {Number(item.price).toFixed(2)}₺
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
              Toplam Tutar: {totalPrice.toFixed(2)}₺
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

      {/* Premium payment form modal */}
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

      {/* Remove from cart confirmation modal */}
      <Dialog
        open={removeConfirmOpen}
        onClose={handleRemoveCancel}
        aria-labelledby="remove-confirm-dialog-title"
        aria-describedby="remove-confirm-dialog-description"
      >
        <DialogTitle id="remove-confirm-dialog-title">
          Kitabı Sepetten Çıkar
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="remove-confirm-dialog-description">
            "{bookToRemove?.title}" kitabını sepetinizden çıkarmak istediğinize
            emin misiniz?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRemoveCancel} color="primary">
            İptal
          </Button>
          <Button
            onClick={handleRemoveConfirm}
            color="error"
            variant="contained"
          >
            Çıkar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Clear cart confirmation modal */}
      <Dialog
        open={clearCartConfirmOpen}
        onClose={handleClearCartCancel}
        aria-labelledby="clear-cart-confirm-dialog-title"
        aria-describedby="clear-cart-confirm-dialog-description"
      >
        <DialogTitle id="clear-cart-confirm-dialog-title">
          Sepeti Temizle
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="clear-cart-confirm-dialog-description">
            Sepetinizdeki tüm ürünleri ({cartItems.length} adet) çıkarmak
            istediğinize emin misiniz? Bu işlem geri alınamaz.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClearCartCancel} color="primary">
            İptal
          </Button>
          <Button
            onClick={handleClearCartConfirm}
            color="error"
            variant="contained"
          >
            Sepeti Temizle
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
