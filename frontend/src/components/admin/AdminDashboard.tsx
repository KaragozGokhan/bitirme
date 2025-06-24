import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  IconButton,
  AppBar,
  Toolbar,
  Button,
  Avatar,
  Menu,
  MenuItem,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Book as BookIcon,
  People as PeopleIcon,
  Comment as CommentIcon,
  Subscriptions as SubscriptionIcon,
  Logout as LogoutIcon,
  AccountCircle,
  TrendingUp,
  GroupAdd,
  WorkspacePremium as WorkspacePremiumIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { adminService } from "../../infrastructure/services/api";
import BookManagement from "./BookManagement";
import UserManagement from "./UserManagement";
import SubscriptionManagement from "./SubscriptionManagement";
import CommentManagement from "./CommentManagement";

interface DashboardStats {
  totalUsers: number;
  totalBooks: number;
  totalComments: number;
  premiumUsers: number;
  activePremiumUsers: number;
  recentUsers: number;
}

const AdminDashboard: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      const statsData = await adminService.getDashboardStats();
      setStats(statsData);
    } catch (err: any) {
      setError(
        err.response?.data?.error || "İstatistikler yüklenirken hata oluştu"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    adminService.logout();
    navigate("/admin/login");
  };

  const handleStatClick = (type: string) => {
    switch (type) {
      case "users":
        setCurrentTab(2); // Kullanıcı Yönetimi sekmesi
        break;
      case "books":
        setCurrentTab(1); // Kitap Yönetimi sekmesi
        break;
      case "comments":
        setCurrentTab(4); // Yorum Yönetimi sekmesi
        break;
      case "premium":
      case "recent":
        setCurrentTab(3); // Abonelik Yönetimi sekmesi
        break;
      default:
        break;
    }
  };

  const StatCard: React.FC<{
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
    onClick?: () => void;
  }> = ({ title, value, icon, color, onClick }) => (
    <Card
      sx={{
        background: `linear-gradient(135deg, ${color} 0%, ${color}80 100%)`,
        color: "white",
        cursor: onClick ? "pointer" : "default",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": onClick
          ? {
              transform: "translateY(-4px)",
              boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
            }
          : {},
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography
              variant="h6"
              component="div"
              sx={{ fontWeight: "bold" }}
            >
              {title}
            </Typography>
            <Typography
              variant="h4"
              component="div"
              sx={{ fontWeight: "bold", mt: 1 }}
            >
              {value}
            </Typography>
          </Box>
          <Box sx={{ fontSize: 48, opacity: 0.8 }}>{icon}</Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
        <Toolbar>
          <DashboardIcon sx={{ mr: 2 }} />
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontWeight: "bold" }}
          >
            Bookflix Admin Paneli
          </Typography>
          <IconButton color="inherit" onClick={handleMenuOpen}>
            <AccountCircle />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          >
            <MenuItem onClick={handleLogout}>
              <LogoutIcon sx={{ mr: 1 }} />
              Çıkış Yap
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ borderBottom: 1, borderColor: "divider" }}
          >
            <Tab icon={<DashboardIcon />} label="Dashboard" />
            <Tab icon={<BookIcon />} label="Kitap Yönetimi" />
            <Tab icon={<PeopleIcon />} label="Kullanıcı Yönetimi" />
            <Tab icon={<SubscriptionIcon />} label="Abonelik Yönetimi" />
            <Tab icon={<CommentIcon />} label="Yorum Yönetimi" />
          </Tabs>
        </Paper>

        {currentTab === 0 && stats && (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={2.4}>
              <StatCard
                title="Toplam Kullanıcı"
                value={stats.totalUsers}
                icon={<PeopleIcon />}
                color="#2196f3"
                onClick={() => handleStatClick("users")}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <StatCard
                title="Toplam Kitap"
                value={stats.totalBooks}
                icon={<BookIcon />}
                color="#4caf50"
                onClick={() => handleStatClick("books")}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <StatCard
                title="Toplam Yorum"
                value={stats.totalComments}
                icon={<CommentIcon />}
                color="#ff9800"
                onClick={() => handleStatClick("comments")}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  background:
                    "linear-gradient(135deg, #FF9800 0%, #F57C00 100%)",
                  cursor: "pointer",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                  },
                }}
                onClick={() => handleStatClick("premium")}
              >
                <CardContent>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Box>
                      <Typography color="white" variant="h6" gutterBottom>
                        Premium Kullanıcılar
                      </Typography>
                      <Typography variant="h4" color="white" fontWeight="bold">
                        {stats.premiumUsers}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="white"
                        sx={{ opacity: 0.8 }}
                      >
                        Aktif: {stats.activePremiumUsers}
                      </Typography>
                    </Box>
                    <WorkspacePremiumIcon
                      sx={{ fontSize: 50, color: "white", opacity: 0.7 }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <StatCard
                title="Yeni Kullanıcı (30 gün)"
                value={stats.recentUsers}
                icon={<GroupAdd />}
                color="#f44336"
                onClick={() => handleStatClick("recent")}
              />
            </Grid>
          </Grid>
        )}

        {currentTab === 1 && <BookManagement />}
        {currentTab === 2 && <UserManagement />}
        {currentTab === 3 && <SubscriptionManagement />}
        {currentTab === 4 && <CommentManagement />}
      </Container>
    </Box>
  );
};

export default AdminDashboard;
