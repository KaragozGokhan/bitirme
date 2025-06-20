import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useTheme,
  Collapse,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Book as BookIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Category as CategoryIcon,
  ExpandLess,
  ExpandMore,
  LocalLibrary as MyBooksIcon,
} from "@mui/icons-material";
import { authService } from "../../infrastructure/services/api";

const drawerWidth = 280;

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    authService.logout();
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const handleCategoriesClick = () => {
    setCategoriesOpen(!categoriesOpen);
  };

  const categories = [
    { id: 1, name: "Roman" },
    { id: 2, name: "Bilim Kurgu" },
    { id: 3, name: "Klasik" },
    { id: 4, name: "Çocuk" },
    { id: 5, name: "Felsefe" },
    { id: 6, name: "Tarih" },
    { id: 7, name: "Biyografi" },
    { id: 8, name: "Kişisel Gelişim" },
    { id: 9, name: "Polisiye" },
    { id: 10, name: "Fantastik" },
    { id: 11, name: "Psikoloji" },
    { id: 12, name: "Edebiyat" },
    { id: 13, name: "Macera" },
    { id: 14, name: "Dram" },
    { id: 15, name: "Şiir" },
  ];

  const menuItems = [
    { text: "Profil", icon: <PersonIcon />, path: "/profile" },
    { text: "Kitaplarım", icon: <MyBooksIcon />, path: "/my-books" },
    { text: "Kitaplar", icon: <BookIcon />, path: "/" },
  ];

  const drawer = (
    <div>
      <Toolbar sx={{ px: 3, py: 2 }}>
        <Typography
          variant="h6"
          noWrap
          component="div"
          fontWeight={700}
          color="primary"
        >
          Kütüphane
        </Typography>
      </Toolbar>
      <Divider sx={{ mx: 2 }} />
      <List sx={{ px: 2, py: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => {
                navigate(item.path);
              }}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                "&.Mui-selected": {
                  backgroundColor: "primary.main",
                  color: "primary.contrastText",
                  "&:hover": {
                    backgroundColor: "primary.dark",
                  },
                  "& .MuiListItemIcon-root": {
                    color: "primary.contrastText",
                  },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: "0.875rem",
                  fontWeight: 600,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleCategoriesClick}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              "&:hover": {
                backgroundColor: "action.hover",
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <CategoryIcon />
            </ListItemIcon>
            <ListItemText
              primary="Kategoriler"
              primaryTypographyProps={{
                fontSize: "0.875rem",
                fontWeight: 600,
              }}
            />
            {categoriesOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        <Collapse in={categoriesOpen} timeout="auto" unmountOnExit>
          <List component="div" sx={{ pl: 2 }}>
            {categories.map((category) => (
              <ListItemButton
                key={category.id}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  pl: 4,
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
                onClick={() => {
                  navigate(`/category/${category.id}`);
                }}
              >
                <ListItemText
                  primary={category.name}
                  primaryTypographyProps={{
                    fontSize: "0.875rem",
                    fontWeight: 500,
                  }}
                />
              </ListItemButton>
            ))}
          </List>
        </Collapse>
      </List>
      <Divider sx={{ mx: 2 }} />
      <List sx={{ px: 2, py: 1 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 2,
              color: "error.main",
              "&:hover": {
                backgroundColor: "error.lighter",
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: "error.main" }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText
              primary="Çıkış Yap"
              primaryTypographyProps={{
                fontSize: "0.875rem",
                fontWeight: 600,
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <CssBaseline />
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" fontWeight={600}>
            {menuItems.find((item) => item.path === location.pathname)?.text ||
              "Kütüphane"}
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              borderRight: "none",
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              borderRight: "none",
              bgcolor: "background.paper",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: "100vh",
          bgcolor: "background.default",
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};
