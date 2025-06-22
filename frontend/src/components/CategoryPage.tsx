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
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HomeIcon from "@mui/icons-material/Home";
import { BookCard } from "./BookCard";
import { Book } from "../infrastructure/types";
import { bookService } from "../infrastructure/services/api";
import {
  categories,
  getCategoryById,
} from "../infrastructure/constants/categories";
import { useSidebar } from "../infrastructure/contexts/SidebarContext";

export const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categoryInfo, setCategoryInfo] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const { sidebarOpen } = useSidebar();

  const currentCategory = getCategoryById(parseInt(categoryId || "0"));

  const fetchBooks = async () => {
    try {
      if (!categoryId) {
        setError("Kategori ID'si bulunamadı.");
        return;
      }

      console.log(
        `📚 ${currentCategory?.name} kategorisindeki kitaplar yükleniyor...`
      );
      setLoading(true);
      setError(null);

      const data = await bookService.getBooksByCategory(parseInt(categoryId));
      console.log("📚 API'den gelen kitap verisi:", data);

      if (data && data.category && data.books) {
        setCategoryInfo(data.category);

        // Arama terimi varsa filtreleme yap
        const filteredBooks = data.books.filter((book: Book) => {
          const matchesSearch = searchTerm
            ? book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              book.author.toLowerCase().includes(searchTerm.toLowerCase())
            : true;
          return matchesSearch;
        });

        setBooks(filteredBooks);
        setTotalPages(Math.ceil(filteredBooks.length / 12));
        console.log(
          `📚 ${data.category.name} kategorisinde ${filteredBooks.length} kitap bulundu`
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

  useEffect(() => {
    fetchBooks();
  }, [categoryId, page, searchTerm]);

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

  const booksToShow = books.slice((page - 1) * 12, page * 12);

  const displayCategoryName =
    categoryInfo?.name || currentCategory?.name || "Bilinmeyen Kategori";

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
            <Typography color="text.primary">{displayCategoryName}</Typography>
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
            {displayCategoryName}
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
              placeholder={`${displayCategoryName} kategorisinde ara...`}
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
                  lg: sidebarOpen ? "repeat(4, 1fr)" : "repeat(5, 1fr)",
                },
                gap: 3,
                transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                "& > *": {
                  transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                  transform: "scale(1)",
                  opacity: 1,
                  "&:hover": {
                    transform: "scale(1.02) translateY(-4px)",
                    transition: "all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                  },
                },
              }}
            >
              {booksToShow.map((book) => (
                <BookCard key={book.id} book={book} />
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
                  : `${displayCategoryName} kategorisinde henüz kitap bulunmuyor.`}
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
