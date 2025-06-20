import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Grid,
  Box,
  Typography,
  TextField,
  InputAdornment,
  Pagination,
  Stack,
  Alert,
  Paper,
  IconButton,
  Tooltip,
  Chip,
  CircularProgress,
  Breadcrumbs,
  Link,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HomeIcon from "@mui/icons-material/Home";
import { BookCard } from "./BookCard";
import { Book } from "../infrastructure/types";
import { bookService } from "../infrastructure/services/api";

export const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rentedBooks, setRentedBooks] = useState<number[]>([]);

  const categories = [
    { id: 1, name: "Roman" },
    { id: 2, name: "Bilim Kurgu" },
    { id: 3, name: "Klasik" },
    { id: 4, name: "Çocuk" },
    { id: 5, name: "Felsefe" },
    { id: 6, name: "Tarih" },
    { id: 7, name: "Biyografi" },
    { id: 8, name: "Kişisel Gelişim" },
    { id: 9, name: "Polisiye" },
    { id: 10, name: "Fantastik" },
    { id: 11, name: "Psikoloji" },
    { id: 12, name: "Edebiyat" },
    { id: 13, name: "Macera" },
    { id: 14, name: "Dram" },
    { id: 15, name: "Şiir" },
  ];

  const currentCategory = categories.find(
    (cat) => cat.id === parseInt(categoryId || "0")
  );

  const fetchBooks = async () => {
    try {
      console.log(
        `📚 ${currentCategory?.name} kategorisindeki kitaplar yükleniyor...`
      );
      setLoading(true);
      setError(null);
      const response = await bookService.getBooks();
      console.log("📚 API'den gelen kitap verisi:", response);

      if (response) {
        // Kategori ID'sine göre filtreleme yapacağız
        // Şu an için tüm kitapları gösteriyoruz çünkü backend'de kategori filtresi yok
        const filteredBooks = response.filter((book: Book) => {
          const matchesCategory = categoryId
            ? book.categories?.some((cat) => cat.id === parseInt(categoryId))
            : true;
          const matchesSearch = searchTerm
            ? book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              book.author.toLowerCase().includes(searchTerm.toLowerCase())
            : true;
          return matchesCategory && matchesSearch;
        });

        setBooks(filteredBooks);
        setTotalPages(Math.ceil(filteredBooks.length / 12));
        console.log(
          `📚 ${currentCategory?.name} kategorisinde ${filteredBooks.length} kitap bulundu`
        );
      } else {
        setBooks([]);
        setTotalPages(1);
        console.log("📚 Hiç kitap bulunamadı");
      }
    } catch (error) {
      setError("Kitaplar yüklenirken bir hata oluştu.");
      console.error("❌ Kitap yükleme hatası:", error);
      setBooks([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const fetchRentedBooks = async () => {
    try {
      const response = await bookService.getRentedBooks();
      if (response && response.length > 0) {
        setRentedBooks(response.map((book: Book) => book.id));
      } else {
        setRentedBooks([]);
      }
    } catch (error) {
      console.error("Kiralanan kitaplar yüklenirken hata:", error);
      setRentedBooks([]);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [categoryId, page, searchTerm]);

  useEffect(() => {
    fetchRentedBooks();
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const handleRent = async (bookId: number) => {
    try {
      await bookService.rentBook(bookId);
      setRentedBooks([...rentedBooks, bookId]);
      await fetchBooks();
    } catch (error) {
      setError("Kitap kiralama işlemi başarısız oldu.");
      console.error("Kitap kiralama hatası:", error);
    }
  };

  const booksToShow = books.slice((page - 1) * 12, page * 12);

  return (
    <Box>
      {/* Breadcrumb Navigation */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 2,
          borderRadius: 2,
          bgcolor: "background.paper",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <IconButton
            onClick={() => navigate("/")}
            sx={{
              bgcolor: "primary.main",
              color: "white",
              "&:hover": { bgcolor: "primary.dark" },
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Breadcrumbs>
            <Link
              component="button"
              onClick={() => navigate("/")}
              sx={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
              }}
            >
              <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
              Ana Sayfa
            </Link>
            <Typography color="text.primary">
              {currentCategory?.name}
            </Typography>
          </Breadcrumbs>
        </Stack>
      </Paper>

      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 2,
          bgcolor: "background.paper",
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 2 }}
        >
          <Typography variant="h4" component="h1" fontWeight={700}>
            {currentCategory?.name}
            <Chip
              label={`${books.length} Kitap`}
              size="small"
              color="primary"
              sx={{ ml: 2 }}
            />
          </Typography>
          <Box
            sx={{ display: "flex", gap: 1, width: { xs: "100%", sm: "auto" } }}
          >
            <TextField
              size="small"
              placeholder={`${currentCategory?.name} kategorisinde ara...`}
              value={searchTerm}
              onChange={handleSearch}
              sx={{ minWidth: 300 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <Tooltip title="Filtrele">
              <IconButton
                sx={{
                  bgcolor: "action.selected",
                  "&:hover": { bgcolor: "action.focus" },
                }}
              >
                <FilterListIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Stack>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {booksToShow.length > 0 ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(1, 1fr)",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                  lg: "repeat(4, 1fr)",
                },
                gap: 3,
              }}
            >
              {booksToShow.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onRent={handleRent}
                  isRented={rentedBooks.includes(book.id)}
                />
              ))}
            </Box>
          ) : (
            <Box
              sx={{
                textAlign: "center",
                py: 8,
              }}
            >
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Kitap Bulunamadı
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {searchTerm
                  ? `"${searchTerm}" aramanıza uygun kitap bulunamadı.`
                  : `${currentCategory?.name} kategorisinde henüz kitap bulunmuyor.`}
              </Typography>
            </Box>
          )}

          {totalPages > 1 && (
            <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
                shape="rounded"
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};
