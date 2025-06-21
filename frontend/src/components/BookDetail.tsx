import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Stack,
  Grid,
  IconButton,
  Paper,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  ArrowBack,
  PlayArrow,
  VolumeUp,
  LibraryBooks,
  AddShoppingCart,
} from "@mui/icons-material";
import { Book, User } from "../infrastructure/types";
import { bookService, userService } from "../infrastructure/services/api";
import { useCart } from "../infrastructure/contexts/CartContext";
import { useMyBooks } from "../infrastructure/contexts/MyBooksContext";
import { toast } from "react-toastify";
import { useAudioPlayer } from "../infrastructure/contexts/AudioPlayerContext";
import { ReviewSection } from "./shared/ReviewSection";

export const BookDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart, cartItems } = useCart();
  const { myBooks } = useMyBooks();
  const { playTrack } = useAudioPlayer();

  const isBookInLibrary = book && myBooks.some((b) => b.id === book.id);
  const isBookInCart = book && cartItems.some((item) => item.id === book.id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) {
          setError("Kitap ID bulunamadı");
          return;
        }

        console.log("Kitap detayı yükleniyor, ID:", id);

        // Mock user data - API çalışmazsa kullanılacak
        const mockUser = {
          id: 1,
          username: "TestUser",
          email: "test@example.com",
          password_hash: "",
          created_at: "2024-01-01",
          subscription_type: "premium", // Test için premium veriyoruz
          subscription_end_date: undefined,
        };

        // User profilini yükle
        try {
          console.log("User profili yükleniyor...");
          const userData = await userService.getProfile();
          console.log("User profili yüklendi:", userData);

          // Eğer backend'den gelen user free ise, şimdilik premium yap
          if (userData.subscription_type === "free") {
            console.log(
              "⚠️ Backend'den free user geldi, premium'a çeviriliyor..."
            );
            userData.subscription_type = "premium";
          }

          setUser(userData);
        } catch (userError) {
          console.error(
            "User profili yüklenirken hata, mock premium user kullanılıyor:",
            userError
          );
          setUser(mockUser);
        }

        // Kitap detayını yükle, hata olursa mock data kullan
        try {
          console.log("Kitap detayı yükleniyor...");
          const bookData = await bookService.getBookById(parseInt(id));
          console.log("Kitap detayı yüklendi:", bookData);

          // Eğer audio URL yoksa test URL'si ekle
          if (!bookData.audio_url) {
            console.log("⚠️ Kitapta audio URL yok, test URL'si ekleniyor...");
            bookData.audio_url = "https://www.youtube.com/watch?v=5Fuplg6MhPQ";
          }

          setBook(bookData);
        } catch (bookError) {
          console.error(
            "Kitap detayı yüklenirken hata, mock data kullanılıyor:",
            bookError
          );

          // Mock kitap verisi oluştur
          const mockBook = {
            id: parseInt(id),
            title: `Sesli Kitap #${id}`,
            author: "Test Yazar",
            description:
              "Bu kitabın gerçek detayları backend'den yüklenemedi. Test amaçlı sesli kitap özelliği ile mock data gösteriliyor. Backend bağlantısını kontrol edin.",
            cover_image_url: "https://picsum.photos/300/400?random=" + id,
            pdf_url: "",
            audio_url: "https://www.youtube.com/watch?v=jfKfPfyJRdk", // Lofi müzik - test video
            price: 29.99,
            created_at: "2024-01-01",
            categories: [
              { id: 1, name: "Sesli Kitap" },
              { id: 2, name: "Test" },
            ],
          };

          console.log("Mock kitap verisi kullanılıyor:", mockBook);
          setBook(mockBook);
        }
      } catch (err) {
        setError("Kitap bilgileri yüklenirken hata oluştu");
        console.error("Genel hata:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleAddToCart = () => {
    if (!book) return;
    addToCart(book);
    toast.success("Kitap sepete eklendi!");
  };

  const handlePlayAudio = () => {
    if (book) {
      playTrack(book);
    }
  };

  const hasActiveSubscription = () => {
    console.log("🔍 Üyelik kontrolü:", {
      user: user,
      subscription_type: user?.subscription_type,
      subscription_end_date: user?.subscription_end_date,
    });

    if (!user) {
      console.log("❌ User bulunamadı");
      return false;
    }

    if (user.subscription_type === "premium") {
      if (user.subscription_end_date) {
        const endDate = new Date(user.subscription_end_date);
        const isActive = endDate > new Date();
        console.log("📅 Premium üyelik süresi:", {
          endDate: endDate,
          now: new Date(),
          isActive: isActive,
        });
        return isActive;
      }
      console.log("✅ Premium üyelik aktif (süresiz)");
      return true;
    }

    console.log("❌ Üyelik tipi premium değil:", user.subscription_type);
    return false;
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !book) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || "Kitap bulunamadı"}
        </Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          variant="outlined"
        >
          Geri Dön
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
        variant="outlined"
      >
        Geri Dön
      </Button>

      <Box
        sx={{
          display: "flex",
          gap: 4,
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <Box sx={{ flex: { xs: "1", md: "0 0 300px" } }}>
          <Card>
            <CardMedia
              component="img"
              height="400"
              image={
                book.cover_image_url
                  ? book.cover_image_url.startsWith("kitaplar/")
                    ? `/${book.cover_image_url}`
                    : book.cover_image_url
                  : "https://via.placeholder.com/300x400"
              }
              alt={book.title}
              sx={{ objectFit: "cover" }}
            />
          </Card>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Box>
            <Typography variant="h4" gutterBottom fontWeight="bold">
              {book.title}
            </Typography>

            <Typography variant="h6" color="text.secondary" gutterBottom>
              {book.author}
            </Typography>

            {book.categories && book.categories.length > 0 && (
              <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
                {book.categories.map((category) => (
                  <Chip
                    key={category.id}
                    label={category.name}
                    variant="outlined"
                    size="small"
                  />
                ))}
              </Stack>
            )}

            {book.description && (
              <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
                <Typography variant="body1" paragraph>
                  {book.description}
                </Typography>
              </Paper>
            )}

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Fiyat: ₺{book.price}
              </Typography>
            </Box>

            <Stack spacing={2}>
              {isBookInLibrary ? (
                <Button variant="contained" disabled size="large" fullWidth>
                  Kütüphanenizde
                </Button>
              ) : isBookInCart ? (
                <Button
                  variant="outlined"
                  onClick={() => navigate("/cart")}
                  size="large"
                  fullWidth
                >
                  Sepete Git
                </Button>
              ) : (
                <Button
                  variant="contained"
                  startIcon={<AddShoppingCart />}
                  onClick={handleAddToCart}
                  size="large"
                  fullWidth
                >
                  Sepete Ekle
                </Button>
              )}

              {/* Debug bilgileri */}
              <Box sx={{ p: 2, bgcolor: "info.lighter", borderRadius: 1 }}>
                <Typography variant="caption" display="block">
                  🔍 Debug: Üyelik = {user?.subscription_type || "null"} | Audio
                  = {book.audio_url ? "✅" : "❌"} | Premium ={" "}
                  {hasActiveSubscription() ? "✅" : "❌"}
                </Typography>
              </Box>

              {/* Audio book butonu - şimdilik her zaman göster */}
              {book.audio_url && (
                <Button
                  variant="outlined"
                  startIcon={<PlayArrow />}
                  onClick={handlePlayAudio}
                  size="large"
                  fullWidth
                  sx={{
                    borderColor: "primary.main",
                    color: "primary.main",
                    "&:hover": {
                      backgroundColor: "primary.light",
                      borderColor: "primary.main",
                    },
                  }}
                >
                  <VolumeUp sx={{ mr: 1 }} />
                  Kitabı Dinle
                  {!hasActiveSubscription() && (
                    <Chip
                      label="Test"
                      size="small"
                      color="secondary"
                      sx={{ ml: 1 }}
                    />
                  )}
                </Button>
              )}

              {/* Uyarı mesajı */}
              {!hasActiveSubscription() && (
                <Alert severity="info">
                  Kitap dinleme özelliği için premium üyelik gereklidir.
                  <Button
                    size="small"
                    onClick={() => navigate("/profile")}
                    sx={{ ml: 1 }}
                  >
                    Üyelik Al
                  </Button>
                </Alert>
              )}
            </Stack>
          </Box>
        </Box>
      </Box>

      {/* Yorum Bölümü */}
      <ReviewSection bookId={book.id} />
    </Container>
  );
};
