import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Container,
  Paper,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Book as BookIcon,
  LocalShipping as RentalIcon,
  Assessment as ReportsIcon,
  Settings as SettingsIcon,
  Menu as MenuIcon,
  AdminPanelSettings as AdminIcon,
} from '@mui/icons-material';
import { AdminDashboard } from './admin/AdminDashboard';
import { UserManagement } from './admin/UserManagement';
import { BookManagement } from './admin/BookManagement';
import { RentalManagement } from './admin/RentalManagement';
import { Reports } from './admin/Reports';

const drawerWidth = 240;

interface AdminPanelProps {
  open: boolean;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ open, onClose }) => {
  const [selectedSection, setSelectedSection] = useState('dashboard');

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, value: 'dashboard' },
    { text: 'Kullanıcı Yönetimi', icon: <PeopleIcon />, value: 'users' },
    { text: 'Kitap Yönetimi', icon: <BookIcon />, value: 'books' },
    { text: 'Kiralama Yönetimi', icon: <RentalIcon />, value: 'rentals' },
    { text: 'Raporlar', icon: <ReportsIcon />, value: 'reports' },
  ];

  const renderContent = () => {
    switch (selectedSection) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'users':
        return <UserManagement />;
      case 'books':
        return <BookManagement />;
      case 'rentals':
        return <RentalManagement />;
      case 'reports':
        return <Reports />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={onClose}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <AdminIcon sx={{ mr: 2 }} />
          <Typography variant="h6" noWrap component="div">
            Admin Panel
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={open}
          onClose={onClose}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          <DrawerContent
            selectedSection={selectedSection}
            onSectionChange={setSelectedSection}
            onClose={onClose}
          />
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          <DrawerContent
            selectedSection={selectedSection}
            onSectionChange={setSelectedSection}
            onClose={onClose}
          />
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Container maxWidth="xl">
          <Paper sx={{ p: 3, minHeight: 'calc(100vh - 120px)' }}>
            {renderContent()}
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

interface DrawerContentProps {
  selectedSection: string;
  onSectionChange: (section: string) => void;
  onClose: () => void;
}

const DrawerContent: React.FC<DrawerContentProps> = ({
  selectedSection,
  onSectionChange,
  onClose,
}) => {
  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, value: 'dashboard' },
    { text: 'Kullanıcı Yönetimi', icon: <PeopleIcon />, value: 'users' },
    { text: 'Kitap Yönetimi', icon: <BookIcon />, value: 'books' },
    { text: 'Kiralama Yönetimi', icon: <RentalIcon />, value: 'rentals' },
    { text: 'Raporlar', icon: <ReportsIcon />, value: 'reports' },
  ];

  return (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Admin Panel
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.value} disablePadding>
            <ListItemButton
              selected={selectedSection === item.value}
              onClick={() => {
                onSectionChange(item.value);
                onClose();
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );
}; 