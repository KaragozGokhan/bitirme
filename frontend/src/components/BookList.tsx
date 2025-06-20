import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import { BookCard } from "./BookCard";
import { Book } from "../infrastructure/types";
import { bookService } from "../infrastructure/services/api";

interface BookListProps {
  selectedCategory?: number | null;
}

export const BookList: React.FC<BookListProps> = ({ selectedCategory }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rentedBooks, setRentedBooks] = useState<number[]>([]);
  const booksPerPage = 20;

  const filterAndPaginateBooks = (
    allBooks: Book[],
    searchTerm: string,
    currentPage: number
  ) => {
    // Arama terimi varsa filtrele
    let filteredBooks = allBooks;
    if (searchTerm) {
      filteredBooks = allBooks.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Kategori seçili ise filtrele
    if (selectedCategory && selectedCategory !== null) {
      filteredBooks = filteredBooks.filter((book) =>
        book.categories?.some((category) => category.id === selectedCategory)
      );
    }

    // Toplam sayfa sayısını hesapla
    const totalPagesCount = Math.ceil(filteredBooks.length / booksPerPage);
    setTotalPages(totalPagesCount);

    // Sayfalama yap
    const startIndex = (currentPage - 1) * booksPerPage;
    const endIndex = startIndex + booksPerPage;
    const paginatedBooks = filteredBooks.slice(startIndex, endIndex);

    setBooks(paginatedBooks);
  };

  const fetchBooks = async () => {
    try {
      console.log("📚 Kitaplar yükleniyor...");
      setLoading(true);
      setError(null);
      const response = await bookService.getBooks();
      console.log("📚 API'den gelen kitap verisi:", response);
      if (response) {
        setAllBooks(response);
        filterAndPaginateBooks(response, searchTerm, page);
        console.log(`📚 Toplam ${response.length} kitap yüklendi`);
      } else {
        setAllBooks([]);
        setBooks([]);
        setTotalPages(1);
        console.log("📚 Hiç kitap bulunamadı");
      }
    } catch (error) {
      setError("Kitaplar yüklenirken bir hata oluştu.");
      console.error("❌ Kitap yükleme hatası:", error);
      setAllBooks([]);
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
  }, []);

  useEffect(() => {
    if (allBooks.length > 0) {
      filterAndPaginateBooks(allBooks, searchTerm, page);
    }
  }, [page, searchTerm, selectedCategory, allBooks]);

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
      // Kitap listesini yeniden yüklemek yerine sadece kiralanan kitapları güncelle
      await fetchRentedBooks();
    } catch (error) {
      setError("Kitap kiralama işlemi başarısız oldu.");
      console.error("Kitap kiralama hatası:", error);
    }
  };

  return (
    <Box>
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
          <Typography variant="h5" component="h1" fontWeight={700}>
            Kitaplar
          </Typography>
          <Box
            sx={{ display: "flex", gap: 1, width: { xs: "100%", sm: "auto" } }}
          >
            <TextField
              size="small"
              placeholder="Kitap veya yazar ara..."
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
          {books.length > 0 ? (
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
              {books.map((book) => (
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
                  ? "Arama kriterlerinize uygun kitap bulunamadı. Lütfen farklı bir arama yapmayı deneyin."
                  : "Henüz kitap eklenmemiş."}
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
