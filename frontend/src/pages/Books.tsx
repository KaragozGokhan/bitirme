import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Box,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  cover_image_url: string;
  price: number;
}

const Books: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rentStatus, setRentStatus] = useState<{ [key: number]: boolean }>({});

  const { isAuthenticated } = useAuth();
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  // Kitapları getir
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/books`);
        setBooks(response.data);
        setFilteredBooks(response.data);
      } catch (error) {
        console.error("Kitaplar getirilemedi:", error);
        setError("Kitaplar yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [API_URL]);

  // Arama terimini işle
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredBooks(books);
      return;
    }

    const filtered = books.filter(
      (book) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredBooks(filtered);
  }, [searchTerm, books]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleRentBook = async (bookId: number) => {
    if (!isAuthenticated) {
      alert("Kitap kiralamak için giriş yapmalısınız.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_URL}/api/books/${bookId}/rent`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRentStatus((prev) => ({ ...prev, [bookId]: true }));
    } catch (error: any) {
      console.error("Kitap kiralama hatası:", error);
      alert(error.response?.data?.error || "Kitap kiralarken bir hata oluştu.");
    }
  };

  const handleReadBook = (bookId: number) => {
    // Bu fonksiyonda kitap okuma sayfasına yönlendirme yapılabilir
    alert(`Kitap ${bookId} okuma sayfasına yönlendiriliyorsunuz...`);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Kitaplar
        </Typography>

        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Kitap veya yazar adını arayın..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : filteredBooks.length === 0 ? (
          <Alert severity="info">Sonuç bulunamadı.</Alert>
        ) : (
          <Grid container spacing={3}>
            {filteredBooks.map((book) => (
              <Grid item xs={12} sm={6} md={4} key={book.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={
                      book.cover_image_url ||
                      "https://via.placeholder.com/200x300?text=Kitap+Kapağı"
                    }
                    alt={book.title}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="div">
                      {book.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {book.author}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      {book.description?.substring(0, 100)}
                      {book.description?.length > 100 ? "..." : ""}
                    </Typography>
                    <Typography variant="body1" color="primary" sx={{ mt: 2 }}>
                      {book.price.toFixed(2)} ₺
                    </Typography>
                  </CardContent>
                  <CardActions>
                    {rentStatus[book.id] ? (
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => handleReadBook(book.id)}
                      >
                        Oku
                      </Button>
                    ) : (
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleRentBook(book.id)}
                      >
                        Kirala
                      </Button>
                    )}
                    <Button size="small" color="primary">
                      Detaylar
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default Books;
