import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Stack,
  Alert,
  TablePagination,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";
import InfoIcon from "@mui/icons-material/Info";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { bookService } from "../infrastructure/services/api";
import { Book } from "../infrastructure/types";
import { useNavigate } from "react-router-dom";

interface MyBookData {
  book_id: number;
  title: string;
  author: string;
  cover_image_url?: string;
  audio_url?: string;
  rental_date: string;
  return_date?: string;
  status: string;
  has_audio_access?: boolean;
}

export const MyBooks: React.FC = () => {
  const navigate = useNavigate();
  const [myBooks, setMyBooks] = useState<MyBookData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchMyBooks = async () => {
    try {
      setLoading(true);
      console.log("🔄 Kitaplarım yükleniyor...");

      // Kullanıcının kiraladığı kitapları al
      const myBooksResponse = await bookService.getMyBooks();
      console.log("✅ Kitaplarım yüklendi:", myBooksResponse);

      // Her kitap için ses kitabı erişimini kontrol et
      const booksWithAudioAccess = await Promise.all(
        myBooksResponse.map(async (book: any) => {
          let hasAudioAccess = false;

          if (book.audio_url) {
            try {
              const audioResponse = await bookService.checkAudioAccess(
                book.book_id,
                1
              ); // user_id=1 şimdilik
              hasAudioAccess = audioResponse.has_access;
              console.log(
                `🎵 Kitap ${book.book_id} ses erişimi:`,
                hasAudioAccess
              );
            } catch (error) {
              console.error(
                `❌ Ses erişim kontrolü hatası (kitap ${book.book_id}):`,
                error
              );
              hasAudioAccess = true; // Hata durumunda erişim ver
            }
          }

          return {
            book_id: book.book_id,
            title: book.title,
            author: book.author,
            cover_image_url:
              book.cover_image_url || "https://via.placeholder.com/200x300",
            audio_url: book.audio_url,
            rental_date: book.rental_date || new Date().toISOString(),
            return_date: book.return_date,
            status: book.status || "active",
            has_audio_access: hasAudioAccess,
          };
        })
      );

      setMyBooks(booksWithAudioAccess);
      setError(null);
    } catch (error) {
      console.error("❌ Kitaplarım yükleme hatası:", error);

      // Hata durumunda mock data kullan
      const mockMyBooks = [
        {
          book_id: 1,
          title: "Test Sesli Kitap 1",
          author: "Test Yazar 1",
          cover_image_url: "https://picsum.photos/200/300?random=1",
          audio_url: "https://www.youtube.com/watch?v=5Fuplg6MhPQ",
          rental_date: new Date().toISOString(),
          return_date: null,
          status: "active",
          has_audio_access: true,
        },
        {
          book_id: 2,
          title: "Test Kitap 2 (Sadece PDF)",
          author: "Test Yazar 2",
          cover_image_url: "https://picsum.photos/200/300?random=2",
          audio_url: null,
          rental_date: new Date(
            Date.now() - 7 * 24 * 60 * 60 * 1000
          ).toISOString(),
          return_date: null,
          status: "active",
          has_audio_access: false,
        },
      ];

      console.log("⚠️ Mock kitaplarım verisi kullanılıyor:", mockMyBooks);
      setMyBooks(mockMyBooks);
      setError("Backend'den veri alınamadı, test verisi gösteriliyor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBooks();
  }, []);

  const handleReturnBook = async (bookId: number) => {
    try {
      console.log("📤 Kitap iade ediliyor:", bookId);
      await bookService.returnBook(bookId);
      await fetchMyBooks(); // Listeyi yenile
      console.log("✅ Kitap başarıyla iade edildi");
    } catch (error) {
      console.error("❌ Kitap iade hatası:", error);
      setError("Kitap iade işlemi başarısız oldu.");
    }
  };

  const handleViewBook = (bookId: number) => {
    navigate(`/book/${bookId}`);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMMM yyyy", { locale: tr });
    } catch {
      return "Geçersiz tarih";
    }
  };

  const calculateDueDate = (rentalDate: string) => {
    try {
      const rental = new Date(rentalDate);
      const due = new Date(rental.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 gün sonra
      return format(due, "dd MMMM yyyy", { locale: tr });
    } catch {
      return "Hesaplanamadı";
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 2,
          bgcolor: "background.paper",
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h5" component="h1" fontWeight={700}>
            Kitaplarım
          </Typography>
          <Chip
            label={`Toplam ${myBooks.length} kitap`}
            color="primary"
            size="small"
          />
        </Stack>
      </Paper>

      {error && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Kitap</TableCell>
                <TableCell>Yazar</TableCell>
                <TableCell>Kiralanma Tarihi</TableCell>
                <TableCell>İade Tarihi</TableCell>
                <TableCell>Durum</TableCell>
                <TableCell align="right">İşlemler</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {myBooks
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((book) => (
                  <TableRow
                    key={book.book_id}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      "&:hover": { bgcolor: "action.hover" },
                    }}
                  >
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar
                          variant="rounded"
                          src={book.cover_image_url}
                          alt={book.title}
                          sx={{ width: 40, height: 40 }}
                        />
                        <Typography variant="subtitle2">
                          {book.title}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {book.author}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(book.rental_date)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {book.return_date
                          ? formatDate(book.return_date)
                          : calculateDueDate(book.rental_date)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={
                          book.status === "active" ? "Aktif" : "İade Edildi"
                        }
                        color={book.status === "active" ? "primary" : "default"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="flex-end"
                      >
                        <Tooltip title="Detaylar">
                          <IconButton
                            size="small"
                            onClick={() => handleViewBook(book.book_id)}
                          >
                            <InfoIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {book.audio_url && book.has_audio_access && (
                          <Tooltip title="Kitabı Dinle">
                            <IconButton
                              size="small"
                              color="secondary"
                              onClick={() => handleViewBook(book.book_id)}
                            >
                              <PlayArrowIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        {book.status === "active" && (
                          <Tooltip title="İade Et">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleReturnBook(book.book_id)}
                            >
                              <AssignmentReturnIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              {myBooks.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                    <Typography
                      variant="h6"
                      color="text.secondary"
                      gutterBottom
                    >
                      Henüz Kitap Kiralamadınız
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Kitaplar sayfasından kitap kiralayabilirsiniz.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={myBooks.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Sayfa başına kitap:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} / ${count}`
          }
        />
      </Paper>
    </Box>
  );
};
