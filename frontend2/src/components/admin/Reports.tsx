import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Book as BookIcon,
  LocalShipping as RentalIcon,
  Warning as WarningIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { adminService } from '../../infrastructure/services/api';
import { AdminStats, AdminRental, AdminBook, AdminUser } from '../../infrastructure/types';

interface ReportsProps {}

export const Reports: React.FC<ReportsProps> = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [overdueRentals, setOverdueRentals] = useState<AdminRental[]>([]);
  const [popularBooks, setPopularBooks] = useState<AdminBook[]>([]);
  const [activeUsers, setActiveUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReportsData();
  }, []);

  const fetchReportsData = async () => {
    try {
      setLoading(true);
      const [statsData, overdueData, popularData, activeData] = await Promise.all([
        adminService.getStats(),
        adminService.getOverdueRentals(),
        adminService.getPopularBooks(),
        adminService.getActiveUsers(),
      ]);
      
      setStats(statsData);
      setOverdueRentals(overdueData);
      setPopularBooks(popularData);
      setActiveUsers(activeData);
    } catch (err) {
      setError('Rapor verileri yüklenirken hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <AssessmentIcon sx={{ fontSize: 32, color: 'primary.main' }} />
        <Typography variant="h4" component="h1">
          Raporlar ve İstatistikler
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
        <Card sx={{ 
          flex: '1 1 200px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h4" component="div">
                  {stats?.totalUsers || 0}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Toplam Kullanıcı
                </Typography>
              </Box>
              <PeopleIcon sx={{ fontSize: 40, opacity: 0.8 }} />
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ 
          flex: '1 1 200px',
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          color: 'white'
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h4" component="div">
                  {stats?.totalBooks || 0}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Toplam Kitap
                </Typography>
              </Box>
              <BookIcon sx={{ fontSize: 40, opacity: 0.8 }} />
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ 
          flex: '1 1 200px',
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          color: 'white'
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h4" component="div">
                  {stats?.activeRentals || 0}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Aktif Kiralama
                </Typography>
              </Box>
              <RentalIcon sx={{ fontSize: 40, opacity: 0.8 }} />
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ 
          flex: '1 1 200px',
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          color: 'white'
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h4" component="div">
                  {stats?.totalRevenue || 0}₺
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Toplam Gelir
                </Typography>
              </Box>
              <TrendingUpIcon sx={{ fontSize: 40, opacity: 0.8 }} />
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Reports Grid */}
      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        {/* Overdue Rentals */}
        <Card sx={{ flex: '1 1 400px' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <WarningIcon color="error" />
              <Typography variant="h6">
                Gecikmiş Kiralamalar ({overdueRentals.length})
              </Typography>
            </Box>
            <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Kitap</TableCell>
                    <TableCell>Kullanıcı</TableCell>
                    <TableCell>Gecikme</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {overdueRentals.slice(0, 10).map((rental) => (
                    <TableRow key={rental.id}>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          {rental.book.title}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {rental.user.firstName} {rental.user.lastName}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={`${rental.overdueDays || 0} gün`}
                          color="error"
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Popular Books */}
        <Card sx={{ flex: '1 1 400px' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <BookIcon color="primary" />
              <Typography variant="h6">
                Popüler Kitaplar
              </Typography>
            </Box>
            <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Kitap</TableCell>
                    <TableCell>Yazar</TableCell>
                    <TableCell>Kiralama</TableCell>
                    <TableCell>Puan</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {popularBooks.slice(0, 10).map((book) => (
                    <TableRow key={book.id}>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          {book.title}
                        </Typography>
                      </TableCell>
                      <TableCell>{book.author}</TableCell>
                      <TableCell>
                        <Chip
                          label={book.totalRentals || 0}
                          color="primary"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {book.averageRating ? `${book.averageRating.toFixed(1)}/5` : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>

      {/* Active Users */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <PeopleIcon color="success" />
            <Typography variant="h6">
              En Aktif Kullanıcılar
            </Typography>
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Kullanıcı</TableCell>
                  <TableCell>E-posta</TableCell>
                  <TableCell>Toplam Kiralama</TableCell>
                  <TableCell>Okunan Kitap</TableCell>
                  <TableCell>Üyelik</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {activeUsers.slice(0, 10).map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {user.firstName} {user.lastName}
                      </Typography>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.totalRentals || 0}
                        color="primary"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.totalBooksRead || 0}
                        color="success"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.subscription_type === 'premium' ? 'Premium' : 'Ücretsiz'}
                        color={user.subscription_type === 'premium' ? 'warning' : 'default'}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}; 