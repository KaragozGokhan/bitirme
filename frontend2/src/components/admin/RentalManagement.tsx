import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Alert,
  Snackbar,
  Tooltip,
  Button,
  Tabs,
  Tab,
  Grid,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  CheckCircle as ReturnIcon,
  Warning as OverdueIcon,
  Schedule as ExtendIcon,
  Book as BookIcon,
  LocalShipping as RentalIcon,
} from '@mui/icons-material';
import { adminService } from '../../infrastructure/services/api';
import { AdminRental, AdminBook } from '../../infrastructure/types';

interface RentalManagementProps {}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`rental-tabpanel-${index}`}
      aria-labelledby={`rental-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export const RentalManagement: React.FC<RentalManagementProps> = () => {
  const [rentals, setRentals] = useState<AdminRental[]>([]);
  const [availableBooks, setAvailableBooks] = useState<AdminBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [rentalsData, availableBooksData] = await Promise.all([
        adminService.getAllRentals(),
        adminService.getAvailableBooks()
      ]);
      setRentals(rentalsData);
      setAvailableBooks(availableBooksData);
    } catch (err) {
      setError('Veriler yüklenirken hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleReturnBook = async (rentalId: number) => {
    try {
      await adminService.updateRentalStatus(rentalId, 'returned');
      setSnackbar({ open: true, message: 'Kitap başarıyla iade edildi', severity: 'success' });
      fetchData();
    } catch (err) {
      setSnackbar({ open: true, message: 'İşlem başarısız oldu', severity: 'error' });
    }
  };

  const handleExtendRental = async (rentalId: number) => {
    try {
      await adminService.extendRental(rentalId, 7); // Extend by 7 days
      setSnackbar({ open: true, message: 'Kiralama 7 gün uzatıldı', severity: 'success' });
      fetchData();
    } catch (err) {
      setSnackbar({ open: true, message: 'İşlem başarısız oldu', severity: 'error' });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'primary';
      case 'returned':
        return 'success';
      case 'overdue':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Aktif';
      case 'returned':
        return 'İade Edildi';
      case 'overdue':
        return 'Gecikmiş';
      default:
        return status;
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
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
          Kiralama Yönetimi
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="rental management tabs">
              <Tab 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <RentalIcon />
                    Kiralanan Kitaplar ({rentals.length})
                  </Box>
                } 
              />
              <Tab 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BookIcon />
                    Kiralanabilir Kitaplar ({availableBooks.length})
                  </Box>
                } 
              />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Kitap</TableCell>
                    <TableCell>Kullanıcı</TableCell>
                    <TableCell>Kiralama Tarihi</TableCell>
                    <TableCell>İade Tarihi</TableCell>
                    <TableCell>Durum</TableCell>
                    <TableCell>Gecikme</TableCell>
                    <TableCell>İşlemler</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rentals.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <Typography variant="body2" color="textSecondary">
                          Henüz kiralama işlemi bulunmuyor.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    rentals.map((rental) => (
                      <TableRow key={rental.id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {rental.book.coverImage && (
                              <img 
                                src={rental.book.coverImage} 
                                alt={rental.book.title}
                                style={{ width: 40, height: 50, objectFit: 'cover' }}
                                onError={(e) => {
                                  e.currentTarget.src = 'https://via.placeholder.com/40x50?text=Kitap';
                                }}
                              />
                            )}
                            <Box>
                              <Typography variant="body2" fontWeight="bold">
                                {rental.book.title}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                {rental.book.author}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {rental.user.firstName} {rental.user.lastName}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {rental.user.email}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {new Date(rental.rentalDate).toLocaleDateString('tr-TR')}
                        </TableCell>
                        <TableCell>
                          {rental.returnDate ? 
                            new Date(rental.returnDate).toLocaleDateString('tr-TR') : 
                            'Henüz iade edilmedi'
                          }
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={getStatusText(rental.status)}
                            color={getStatusColor(rental.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {rental.overdueDays && rental.overdueDays > 0 ? (
                            <Chip
                              label={`${rental.overdueDays} gün gecikmiş`}
                              color="error"
                              size="small"
                              icon={<OverdueIcon />}
                            />
                          ) : (
                            '-'
                          )}
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            {rental.status === 'active' && (
                              <>
                                <Tooltip title="İade Et">
                                  <IconButton
                                    size="small"
                                    color="success"
                                    onClick={() => handleReturnBook(rental.id)}
                                  >
                                    <ReturnIcon />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="7 Gün Uzat">
                                  <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={() => handleExtendRental(rental.id)}
                                  >
                                    <ExtendIcon />
                                  </IconButton>
                                </Tooltip>
                              </>
                            )}
                            <Tooltip title="Detayları Görüntüle">
                              <IconButton size="small">
                                <ViewIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Kitap</TableCell>
                    <TableCell>Yazar</TableCell>
                    <TableCell>Kategori</TableCell>
                    <TableCell>Fiyat</TableCell>
                    <TableCell>Toplam Kiralama</TableCell>
                    <TableCell>Eklenme Tarihi</TableCell>
                    <TableCell>Durum</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {availableBooks.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <Typography variant="body2" color="textSecondary">
                          Kiralanabilir kitap bulunmuyor.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    availableBooks.map((book) => (
                      <TableRow key={book.id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {book.coverImage && (
                              <img 
                                src={book.coverImage} 
                                alt={book.title}
                                style={{ width: 40, height: 50, objectFit: 'cover' }}
                                onError={(e) => {
                                  e.currentTarget.src = 'https://via.placeholder.com/40x50?text=Kitap';
                                }}
                              />
                            )}
                            <Box>
                              <Typography variant="body2" fontWeight="bold">
                                {book.title}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                {book.description && book.description.length > 50 
                                  ? `${book.description.substring(0, 50)}...` 
                                  : book.description}
                              </Typography>
                            </Box>
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
                        <TableCell>{book.price}₺</TableCell>
                        <TableCell>{book.totalRentals || 0}</TableCell>
                        <TableCell>
                          {new Date(book.created_at).toLocaleDateString('tr-TR')}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label="Kiralanabilir"
                            color="success"
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
        </CardContent>
      </Card>

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