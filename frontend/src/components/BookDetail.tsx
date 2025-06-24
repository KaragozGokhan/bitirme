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
  MenuBook,
} from "@mui/icons-material";
import { Book, User } from "../infrastructure/types";
import { bookService, userService } from "../infrastructure/services/api";
import { useCart } from "../infrastructure/contexts/CartContext";
import { useMyBooks } from "../infrastructure/contexts/MyBooksContext";
import { toast } from "react-toastify";
import { useAudioPlayer } from "../infrastructure/contexts/AudioPlayerContext";
import { ReviewSection } from "./shared/ReviewSection";
import { CommentSection } from "./shared/CommentSection";

export const BookDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart, cartItems } = useCart();
  const {
    myBooks,
    isPremiumUser,
    addBooksToLibrary,
    user: booksUser,
    loading: booksLoading,
  } = useMyBooks();
  const { playTrack } = useAudioPlayer();

  const isBookInLibrary = book && myBooks.some((b) => b.id === book.id);
  const isBookInCart = book && cartItems.some((item) => item.id === book.id);

  // Kullanıcı değişikliği durumunda loading state'ini kontrol et
  const shouldShowLoading = booksLoading || !user;

  // Premium durumu değiştiğinde component'ı yeniden render et
  useEffect(() => {
    // Bu effect, isPremiumUser değiştiğinde çalışacak
  }, [isPremiumUser, user?.subscription_type]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) {
          setError("Kitap ID bulunamadı");
          return;
        }

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
          const userData = await userService.getProfile();

          // Eğer backend'den gelen user free ise, şimdilik premium yap
          if (userData.subscription_type === "free") {
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

        // Kitap detayını yükle
        try {
          const bookData = await bookService.getBookById(parseInt(id));
          setBook(bookData);
        } catch (bookError) {
          console.error("Kitap detayı yüklenirken hata:", bookError);

          // Temel mock kitap verisi oluştur (audio_url olmadan)
          const mockBook = {
            id: parseInt(id),
            title: `Kitap #${id}`,
            author: "Test Yazar",
            description:
              "Bu kitabın gerçek detayları backend'den yüklenemedi. Backend bağlantısını kontrol edin.",
            cover_image_url: "https://picsum.photos/300/400?random=" + id,
            pdf_url: "",
            audio_url: null, // Audio URL'si olmayan kitap
            price: 29.99,
            created_at: "2024-01-01",
            categories: [
              { id: 1, name: "Roman" },
              { id: 2, name: "Test" },
            ],
          };

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

    // Premium kullanıcılar sepet kullanamaz
    if (isPremiumUser) {
      toast.info(
        "Premium üyeler tüm kitaplara ücretsiz erişime sahiptir. Direkt kütüphaneye ekleme özelliğini kullanın!"
      );
      return;
    }

    addToCart(book);
    toast.success("Kitap sepete eklendi!");
  };

  const handleAddToLibrary = async () => {
    if (!book) return;

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

  const handlePlayAudio = () => {
    if (!book?.audio_url) {
      toast.error("Bu kitap için ses versiyonu mevcut değil");
      return;
    }

    if (!hasBookAccess()) {
      if (!isPremiumUser) {
        toast.error(
          "Bu kitabı dinlemek için premium üye olmanız veya kitabı satın almanız gerekiyor"
        );
      } else {
        toast.error("Bu kitabı dinlemek için önce kütüphanenize ekleyin");
      }
      return;
    }

    // Erişim izni varsa kitabı çal
    playTrack(book);
  };

  const handleReadPdf = () => {
    if (!book?.pdf_url) {
      toast.error("Bu kitap için PDF versiyonu mevcut değil");
      return;
    }

    if (!hasBookAccess()) {
      if (!isPremiumUser) {
        toast.error(
          "Bu kitabı okumak için premium üye olmanız veya kitabı satın almanız gerekiyor"
        );
      } else {
        toast.error("Bu kitabı okumak için önce kütüphanenize ekleyin");
      }
      return;
    }

    // PDF URL'i işle - pdfurl/ ile başlıyorsa lokal dosya
    const pdfUrl = book.pdf_url.startsWith("pdfurl/")
      ? `/${book.pdf_url}`
      : book.pdf_url;

    // Yeni sekmede PDF'i aç
    window.open(pdfUrl, "_blank");
    toast.success("PDF yeni sekmede açılıyor...");
  };

  // Kullanıcının kitaba erişim yetkisi kontrolü (hem okuma hem dinleme için)
  const hasBookAccess = () => {
    // Premium üye ise tüm kitaplara erişimi var
    if (isPremiumUser) {
      return true;
    }

    // Free üye ise sadece satın aldığı kitaplara erişimi var
    if (isBookInLibrary) {
      return true;
    }

    return false;
  };

  const hasActiveSubscription = () => {
    if (!user) {
      return false;
    }

    if (user.subscription_type === "premium") {
      if (user.subscription_end_date) {
        const endDate = new Date(user.subscription_end_date);
        const isActive = endDate > new Date();
        return isActive;
      }
      return true;
    }

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
                {book.categories
                  .filter(
                    (category) =>
                      category && category.name && category.name.trim()
                  )
                  .map((category) => (
                    <Chip
                      key={category.id}
                      label={category.name.trim()}
                      variant="outlined"
                      size="small"
                    />
                  ))}
              </Stack>
            )}

            {book.description && (
              <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                  Kitap Bilgisi:
                </Typography>
                <Typography variant="body1" paragraph>
                  {book.description}
                </Typography>
              </Paper>
            )}

            {!isPremiumUser && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Fiyat: {book.price}₺
                </Typography>
              </Box>
            )}

            <Stack spacing={2}>
              {shouldShowLoading ? (
                <Button variant="outlined" disabled size="large" fullWidth>
                  Yükleniyor...
                </Button>
              ) : isBookInLibrary ? (
                <Button variant="contained" disabled size="large" fullWidth>
                  Kütüphanenizde
                </Button>
              ) : isPremiumUser ? (
                <Button
                  variant="contained"
                  startIcon={<LibraryBooks />}
                  onClick={handleAddToLibrary}
                  size="large"
                  fullWidth
                >
                  Kitaplığına Ekle
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

              {/* Dinle ve Oku butonları yan yana */}
              <Grid container spacing={2}>
                {book.audio_url && (
                  <Grid item xs={6}>
                    <Button
                      variant="outlined"
                      startIcon={<PlayArrow />}
                      onClick={handlePlayAudio}
                      disabled={!hasBookAccess()}
                      size="large"
                      fullWidth
                      sx={{
                        borderColor: "primary.main",
                        color: "primary.main",
                        "&:hover": {
                          backgroundColor: "primary.light",
                          borderColor: "primary.main",
                        },
                        "&:disabled": {
                          borderColor: "grey.300",
                          color: "grey.500",
                        },
                      }}
                    >
                      <VolumeUp sx={{ mr: 1 }} />
                      Dinle
                      {!hasBookAccess() && (
                        <Chip
                          label="Kilitli"
                          size="small"
                          color="error"
                          sx={{ ml: 1 }}
                        />
                      )}
                    </Button>
                  </Grid>
                )}

                <Grid item xs={book.audio_url ? 6 : 12}>
                  <Button
                    variant="outlined"
                    startIcon={<MenuBook />}
                    onClick={handleReadPdf}
                    disabled={!hasBookAccess()}
                    size="large"
                    fullWidth
                    sx={{
                      borderColor: "secondary.main",
                      color: "secondary.main",
                      "&:hover": {
                        backgroundColor: "secondary.light",
                        borderColor: "secondary.main",
                      },
                      "&:disabled": {
                        borderColor: "grey.300",
                        color: "grey.500",
                      },
                    }}
                  >
                    Oku
                    {!hasBookAccess() && (
                      <Chip
                        label="Kilitli"
                        size="small"
                        color="error"
                        sx={{ ml: 1 }}
                      />
                    )}
                  </Button>
                </Grid>
              </Grid>

              {/* Uyarı mesajı */}
              {!hasBookAccess() && (
                <Alert severity="warning">
                  {!isPremiumUser
                    ? "Bu kitabı okumak/dinlemek için premium üye olmanız veya kitabı satın almanız gerekiyor."
                    : "Bu kitabı okumak/dinlemek için önce kütüphanenize eklemeniz gerekiyor."}
                  <Button
                    size="small"
                    onClick={() => navigate("/profile")}
                    sx={{ ml: 1 }}
                  >
                    {!isPremiumUser ? "Premium Ol" : "Kütüphaneye Git"}
                  </Button>
                </Alert>
              )}
            </Stack>
          </Box>
        </Box>
      </Box>

      {/* Yorum Bölümü */}
      <CommentSection
        bookId={book.id}
        currentUserId={user?.id}
        currentUsername={user?.username}
        isAdmin={user?.subscription_type === "admin"}
      />
    </Container>
  );
};
