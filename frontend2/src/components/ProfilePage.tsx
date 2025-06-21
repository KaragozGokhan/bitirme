import React, { useEffect, useState } from 'react';
import { userService } from '../infrastructure/services/api';
import { User, Rental, ReadingHistory } from '../infrastructure/types';
import {
  Container,
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import { AdminPanelSettings as AdminIcon } from '@mui/icons-material';
import { AdminPanel } from './AdminPanel';

export const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [readingHistory, setReadingHistory] = useState<ReadingHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          throw new Error('Kullanıcı ID bulunamadı');
        }

        const [userData, rentalsData, historyData] = await Promise.all([
          userService.getProfile(),
          userService.getRentals(),
          userService.getReadingHistory(),
        ]);

        setUser(userData);
        setRentals(rentalsData);
        setReadingHistory(historyData);
      } catch (err) {
        setError('Kullanıcı bilgileri yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  // Check if user is admin (you can modify this logic based on your user role system)
  const isAdmin = user?.role === 'admin' || user?.email === 'admin@example.com';

  if (adminPanelOpen) {
    return (
      <AdminPanel
        open={adminPanelOpen}
        onClose={() => setAdminPanelOpen(false)}
      />
    );
  }

  return (
    <Container>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {/* Kullanıcı Bilgileri */}
        <Box sx={{ width: '100%', maxWidth: 400 }}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h5">
                Profil Bilgileri
              </Typography>
              {isAdmin && (
                <Button
                  variant="contained"
                  startIcon={<AdminIcon />}
                  onClick={() => setAdminPanelOpen(true)}
                  color="secondary"
                >
                  Admin Panel
                </Button>
              )}
            </Box>
            <List>
              <ListItem>
                <ListItemText
                  primary="Ad Soyad"
                  secondary={`${user?.firstName} ${user?.lastName}`}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="E-posta"
                  secondary={user?.email}
                />
              </ListItem>
            </List>
          </Paper>
        </Box>

        {/* Aktif Kiralamalar */}
        <Box sx={{ width: '100%' }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Aktif Kiralamalar
            </Typography>
            {rentals.length > 0 ? (
              <List>
                {rentals.map((rental) => (
                  <Card key={rental.id} sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="h6">
                        {rental.book?.title || 'Bilinmeyen Kitap'}
                      </Typography>
                      <Typography color="text.secondary">
                        Kiralama Tarihi: {new Date(rental.rentalDate).toLocaleDateString()}
                      </Typography>
                      <Typography color="text.secondary">
                        İade Tarihi: {new Date(rental.returnDate).toLocaleDateString()}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </List>
            ) : (
              <Typography color="text.secondary">
                Aktif kiralama bulunmuyor.
              </Typography>
            )}
          </Paper>
        </Box>

        {/* Okuma Geçmişi */}
        <Box sx={{ width: '100%' }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Okuma Geçmişi
            </Typography>
            {readingHistory.length > 0 ? (
              <List>
                {readingHistory.map((history) => (
                  <Card key={history.id} sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="h6">
                        {history.book?.title || 'Bilinmeyen Kitap'}
                      </Typography>
                      <Typography color="text.secondary">
                        Okuma Tarihi: {new Date(history.readDate).toLocaleDateString()}
                      </Typography>
                      <Typography color="text.secondary">
                        Okuma Süresi: {history.readingTime} dakika
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </List>
            ) : (
              <Typography color="text.secondary">
                Okuma geçmişi bulunmuyor.
              </Typography>
            )}
          </Paper>
        </Box>
      </Box>
    </Container>
  );
}; 