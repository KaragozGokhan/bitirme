import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  AdminPanelSettings as AdminIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Book as BookIcon,
  LocalShipping as RentalIcon,
  Assessment as ReportsIcon,
  Security as SecurityIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { AdminDashboard } from './admin/AdminDashboard';

interface AdminButtonProps {
  userRole?: string;
  userEmail?: string;
}

export const AdminButton: React.FC<AdminButtonProps> = ({ userRole, userEmail }) => {
  const [open, setOpen] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  const isAdmin = userRole === 'admin' || userEmail === 'admin@example.com';

  if (!isAdmin) {
    return null;
  }

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleOpenAdminPanel = () => {
    setOpen(false);
    setShowAdminPanel(true);
  };

  const handleCloseAdminPanel = () => {
    setShowAdminPanel(false);
  };

  if (showAdminPanel) {
    return (
      <AdminDashboard onClose={handleCloseAdminPanel} />
    );
  }

  return (
    <>
      <Button
        variant="contained"
        color="secondary"
        startIcon={<AdminIcon />}
        onClick={handleOpen}
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
          },
        }}
      >
        Yönetici Paneli
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <SecurityIcon />
          Yönetici Paneli
        </DialogTitle>
        
        <DialogContent sx={{ pt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Hoş geldiniz, Yönetici!
          </Typography>
          
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Sistem yönetimi için aşağıdaki seçeneklerden birini kullanabilirsiniz.
          </Typography>

          <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                transition: 'transform 0.2s',
                flex: 1,
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                }
              }}
              onClick={handleOpenAdminPanel}
            >
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <DashboardIcon color="primary" sx={{ fontSize: 40 }} />
                  <Box>
                    <Typography variant="h6">Tam Yönetici Paneli</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Tüm yönetim özelliklerine erişim
                    </Typography>
                  </Box>
                </Box>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <PeopleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Kullanıcı Yönetimi" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <BookIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Kitap Yönetimi" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <RentalIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Kiralama Yönetimi" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <ReportsIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Raporlar ve İstatistikler" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>

            <Card sx={{ flex: 1 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Hızlı Erişim
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Chip 
                    label="Yönetici Yetkileri" 
                    color="primary" 
                    variant="outlined"
                    sx={{ mb: 1 }}
                  />
                  <Chip 
                    label="Sistem Yönetimi" 
                    color="secondary" 
                    variant="outlined"
                    sx={{ mb: 1 }}
                  />
                  <Chip 
                    label="Tam Erişim" 
                    color="success" 
                    variant="outlined"
                  />
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="body2" color="textSecondary">
                  <strong>Yönetici Özellikleri:</strong>
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText 
                      primary="• Kullanıcı ekleme, düzenleme, silme"
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="• Kitap yönetimi ve katalog düzenleme"
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="• Kiralama işlemlerini takip etme"
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="• Detaylı raporlar ve analizler"
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} startIcon={<CloseIcon />}>
            Kapat
          </Button>
          <Button 
            onClick={handleOpenAdminPanel} 
            variant="contained"
            startIcon={<AdminIcon />}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
          >
            Yönetici Paneli Aç
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}; 