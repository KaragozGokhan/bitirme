import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Alert,
  Chip,
  Avatar,
  TablePagination,
  CircularProgress,
  Snackbar,
  InputAdornment,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import { adminService } from "../../infrastructure/services/api";
import { Book } from "../../infrastructure/types";

const BookManagement: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  // Arama state'i
  const [searchText, setSearchText] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    price: 0,
    cover_image_url: "",
    pdf_url: "",
    audio_url: "",
  });

  useEffect(() => {
    loadBooks();
  }, []);

  // Arama effect'i
  useEffect(() => {
    let filtered = books;

    // Metin araması
    if (searchText.trim()) {
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(searchText.toLowerCase()) ||
          book.author.toLowerCase().includes(searchText.toLowerCase()) ||
          book.description?.toLowerCase().includes(searchText.toLowerCase()) ||
          book.id.toString().includes(searchText)
      );
    }

    setFilteredBooks(filtered);
    setPage(0);
  }, [books, searchText]);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const booksData = await adminService.getBooks();
      setBooks(booksData);
    } catch (err: any) {
      setError(err.response?.data?.error || "Kitaplar yüklenirken hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (book?: Book) => {
    if (book) {
      setEditingBook(book);
      setFormData({
        title: book.title,
        author: book.author,
        description: book.description || "",
        price: book.price,
        cover_image_url: book.cover_image_url || "",
        pdf_url: book.pdf_url || "",
        audio_url: book.audio_url || "",
      });
    } else {
      setEditingBook(null);
      setFormData({
        title: "",
        author: "",
        description: "",
        price: 0,
        cover_image_url: "",
        pdf_url: "",
        audio_url: "",
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingBook(null);
  };

  const handleSubmit = async () => {
    try {
      if (editingBook) {
        await adminService.updateBook(editingBook.id, formData);
        setSnackbar({
          open: true,
          message: "Kitap başarıyla güncellendi",
          severity: "success",
        });
      } else {
        await adminService.addBook(formData);
        setSnackbar({
          open: true,
          message: "Kitap başarıyla eklendi",
          severity: "success",
        });
      }
      handleCloseDialog();
      loadBooks();
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.response?.data?.error || "Işlem başarısız",
        severity: "error",
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Bu kitabı silmek istediğinizden emin misiniz?")) {
      try {
        await adminService.deleteBook(id);
        setSnackbar({
          open: true,
          message: "Kitap başarıyla silindi",
          severity: "success",
        });
        loadBooks();
      } catch (err: any) {
        setSnackbar({
          open: true,
          message: err.response?.data?.error || "Silme işlemi başarısız",
          severity: "error",
        });
      }
    }
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClearSearch = () => {
    setSearchText("");
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
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5" fontWeight="bold">
          Kitap Yönetimi
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ borderRadius: 2 }}
        >
          Yeni Kitap Ekle
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Arama */}
      <Box display="flex" gap={2} mb={3} flexWrap="wrap">
        <TextField
          placeholder="Kitap adı, yazar veya açıklama ara..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ flex: 1, minWidth: 250 }}
        />

        {searchText && (
          <Button
            variant="outlined"
            onClick={handleClearSearch}
            startIcon={<ClearIcon />}
          >
            Temizle
          </Button>
        )}
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell>Kitap</TableCell>
              <TableCell>Yazar</TableCell>
              <TableCell>Fiyat</TableCell>
              <TableCell>Açıklama</TableCell>
              <TableCell align="center">İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBooks
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((book) => (
                <TableRow key={book.id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar
                        src={
                          book.cover_image_url?.startsWith("kitaplar/")
                            ? `/${book.cover_image_url}`
                            : book.cover_image_url
                        }
                        variant="rounded"
                        sx={{ width: 48, height: 64 }}
                      />
                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {book.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: {book.id}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{book.author}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={`₺${book.price}`}
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                  <TableCell sx={{ maxWidth: 300 }}>
                    <Typography variant="body2" noWrap>
                      {book.description}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenDialog(book)}
                      title="Düzenle"
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(book.id)}
                      title="Sil"
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredBooks.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Sayfa başına satır:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} / ${count}`
          }
        />
      </TableContainer>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle>
          {editingBook ? "Kitap Düzenle" : "Yeni Kitap Ekle"}
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} pt={1}>
            <TextField
              label="Kitap Başlığı"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              fullWidth
              required
            />
            <TextField
              label="Yazar"
              value={formData.author}
              onChange={(e) =>
                setFormData({ ...formData, author: e.target.value })
              }
              fullWidth
              required
            />
            <TextField
              label="Açıklama"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              fullWidth
              multiline
              rows={3}
            />
            <TextField
              label="Fiyat (₺)"
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  price: parseFloat(e.target.value) || 0,
                })
              }
              fullWidth
              required
            />
            <TextField
              label="Kapak Resmi URL"
              value={formData.cover_image_url}
              onChange={(e) =>
                setFormData({ ...formData, cover_image_url: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="PDF URL"
              value={formData.pdf_url}
              onChange={(e) =>
                setFormData({ ...formData, pdf_url: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="Audio URL"
              value={formData.audio_url}
              onChange={(e) =>
                setFormData({ ...formData, audio_url: e.target.value })
              }
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog} color="inherit">
            İptal
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!formData.title || !formData.author}
          >
            {editingBook ? "Güncelle" : "Ekle"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BookManagement;
