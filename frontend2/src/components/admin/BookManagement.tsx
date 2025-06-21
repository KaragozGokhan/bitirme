import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  Tooltip,
  Grid,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Block as BlockIcon,
  CheckCircle as ActivateIcon,
} from '@mui/icons-material';
import { adminService } from '../../infrastructure/services/api';
import { AdminBook, CreateBookRequest, UpdateBookRequest } from '../../infrastructure/types';

interface BookManagementProps {}

export const BookManagement: React.FC<BookManagementProps> = () => {
  const [books, setBooks] = useState<AdminBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingBook, setEditingBook] = useState<AdminBook | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    coverImage: '',
    pdfUrl: '',
    price: 0,
    category: '',
    isbn: '',
    publishDate: '',
    language: 'Türkçe',
    totalPages: 0,
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const booksData = await adminService.getAllBooks();
      setBooks(booksData);
    } catch (err) {
      setError('Kitaplar yüklenirken hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (book?: AdminBook) => {
    if (book) {
      setEditingBook(book);
      setFormData({
        title: book.title,
        author: book.author,
        description: book.description || '',
        coverImage: book.coverImage || '',
        pdfUrl: '',
        price: 0,
        category: book.category || '',
        isbn: book.isbn || '',
        publishDate: book.publishDate || '',
        language: book.language || 'Türkçe',
        totalPages: book.totalPages || 0,
      });
    } else {
      setEditingBook(null);
      setFormData({
        title: '',
        author: '',
        description: '',
        coverImage: '',
        pdfUrl: '',
        price: 0,
        category: '',
        isbn: '',
        publishDate: '',
        language: 'Türkçe',
        totalPages: 0,
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
        const updateData: UpdateBookRequest = {
          id: editingBook.id,
          title: formData.title,
          author: formData.author,
          description: formData.description,
          coverImage: formData.coverImage,
          category: formData.category,
          isbn: formData.isbn,
          publishDate: formData.publishDate,
          language: formData.language,
          totalPages: formData.totalPages,
        };
        await adminService.updateBook(updateData);
        setSnackbar({ open: true, message: 'Kitap başarıyla güncellendi', severity: 'success' });
      } else {
        const createData: CreateBookRequest = {
          title: formData.title,
          author: formData.author,
          description: formData.description,
          coverImage: formData.coverImage,
          pdfUrl: formData.pdfUrl,
          price: formData.price,
          category: formData.category,
          isbn: formData.isbn,
          publishDate: formData.publishDate,
          language: formData.language,
          totalPages: formData.totalPages,
        };
        await adminService.createBook(createData);
        setSnackbar({ open: true, message: 'Kitap başarıyla oluşturuldu', severity: 'success' });
      }
      handleCloseDialog();
      fetchBooks();
    } catch (err) {
      setSnackbar({ open: true, message: 'İşlem başarısız oldu', severity: 'error' });
    }
  };

  const handleDeleteBook = async (bookId: number) => {
    if (window.confirm('Bu kitabı silmek istediğinizden emin misiniz?')) {
      try {
        await adminService.deleteBook(bookId);
        setSnackbar({ open: true, message: 'Kitap başarıyla silindi', severity: 'success' });
        fetchBooks();
      } catch (err) {
        setSnackbar({ open: true, message: 'Kitap silinirken hata oluştu', severity: 'error' });
      }
    }
  };

  const handleToggleBookAvailability = async (bookId: number, isAvailable: boolean) => {
    try {
      await adminService.toggleBookAvailability(bookId);
      setSnackbar({ 
        open: true, 
        message: `Kitap ${isAvailable ? 'devre dışı bırakıldı' : 'aktif hale getirildi'}`, 
        severity: 'success' 
      });
      fetchBooks();
    } catch (err) {
      setSnackbar({ open: true, message: 'İşlem başarısız oldu', severity: 'error' });
    }
  };

  if (loading) {
    return <Typography>Yükleniyor...</Typography>;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Kitap Yönetimi
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Yeni Kitap Ekle
        </Button>
      </Box>

      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Kitap Adı</TableCell>
                  <TableCell>Yazar</TableCell>
                  <TableCell>Kategori</TableCell>
                  <TableCell>Durum</TableCell>
                  <TableCell>Toplam Kiralama</TableCell>
                  <TableCell>Ortalama Puan</TableCell>
                  <TableCell>Eklenme Tarihi</TableCell>
                  <TableCell>İşlemler</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {books.map((book) => (
                  <TableRow key={book.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {book.coverImage && (
                          <img 
                            src={book.coverImage} 
                            alt={book.title}
                            style={{ width: 40, height: 50, objectFit: 'cover' }}
                            onError={(e) => {
                              e.currentTarget.src = 'https://via.placeholder.com/40x50/4A90E2/FFFFFF?text=Kitap';
                            }}
                          />
                        )}
                        <Typography variant="body2">
                          {book.title}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell>
                      <Chip
                        label={book.category || 'Genel'}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={book.isAvailable ? 'Mevcut' : 'Kiralık'}
                        color={book.isAvailable ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {book.totalRentals || 0}
                    </TableCell>
                    <TableCell>
                      {typeof book.averageRating === 'number' && !isNaN(book.averageRating) && book.averageRating > 0
                        ? `${book.averageRating.toFixed(1)}/5`
                        : 'Henüz puan yok'}
                    </TableCell>
                    <TableCell>
                      {new Date(book.created_at).toLocaleDateString('tr-TR')}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Düzenle">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDialog(book)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={book.isAvailable ? 'Devre Dışı Bırak' : 'Aktif Et'}>
                          <IconButton
                            size="small"
                            onClick={() => handleToggleBookAvailability(book.id, book.isAvailable)}
                            color={book.isAvailable ? 'warning' : 'success'}
                          >
                            {book.isAvailable ? <BlockIcon /> : <ActivateIcon />}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Sil">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteBook(book.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingBook ? 'Kitap Düzenle' : 'Yeni Kitap Ekle'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Kitap Adı"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                fullWidth
                required
              />
              <TextField
                label="Yazar"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                fullWidth
                required
              />
            </Box>
            <TextField
              label="Açıklama"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              fullWidth
              multiline
              rows={3}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Kapak Resmi URL"
                value={formData.coverImage}
                onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                fullWidth
              />
              <TextField
                label="PDF URL"
                value={formData.pdfUrl}
                onChange={(e) => setFormData({ ...formData, pdfUrl: e.target.value })}
                fullWidth
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Fiyat"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                fullWidth
              />
              <TextField
                label="Kategori"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                fullWidth
              />
              <TextField
                label="ISBN"
                value={formData.isbn}
                onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                fullWidth
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Yayın Tarihi"
                type="date"
                value={formData.publishDate}
                onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <FormControl fullWidth>
                <InputLabel>Dil</InputLabel>
                <Select
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  label="Dil"
                >
                  <MenuItem value="Türkçe">Türkçe</MenuItem>
                  <MenuItem value="İngilizce">İngilizce</MenuItem>
                  <MenuItem value="Almanca">Almanca</MenuItem>
                  <MenuItem value="Fransızca">Fransızca</MenuItem>
                  <MenuItem value="İspanyolca">İspanyolca</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Sayfa Sayısı"
                type="number"
                value={formData.totalPages}
                onChange={(e) => setFormData({ ...formData, totalPages: Number(e.target.value) })}
                fullWidth
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>İptal</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingBook ? 'Güncelle' : 'Oluştur'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}; 