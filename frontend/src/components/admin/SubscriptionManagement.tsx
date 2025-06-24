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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardContent,
  InputAdornment,
} from "@mui/material";
import {
  Edit as EditIcon,
  Person as PersonIcon,
  TrendingUp,
  Timer,
  CheckCircle,
  Cancel,
  Search as SearchIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import { adminService } from "../../infrastructure/services/api";

interface SubscriptionUser {
  id: number;
  username: string;
  email: string;
  subscription_type: string;
  subscription_end_date?: string;
  created_at: string;
  status: string;
}

const SubscriptionManagement: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<SubscriptionUser[]>([]);
  const [filteredSubscriptions, setFilteredSubscriptions] = useState<
    SubscriptionUser[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSubscription, setEditingSubscription] =
    useState<SubscriptionUser | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  // Arama ve filtreleme state'leri
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");

  const [formData, setFormData] = useState({
    subscription_type: "basic",
    months: 1,
  });

  useEffect(() => {
    loadSubscriptions();
  }, []);

  // Arama ve filtreleme effect'i
  useEffect(() => {
    let filtered = subscriptions;

    // Metin araması
    if (searchText.trim()) {
      filtered = filtered.filter(
        (sub) =>
          sub.username.toLowerCase().includes(searchText.toLowerCase()) ||
          sub.email.toLowerCase().includes(searchText.toLowerCase()) ||
          sub.id.toString().includes(searchText)
      );
    }

    // Durum filtresi
    if (statusFilter) {
      filtered = filtered.filter((sub) => sub.status === statusFilter);
    }

    // Tür filtresi
    if (typeFilter) {
      filtered = filtered.filter((sub) => sub.subscription_type === typeFilter);
    }

    setFilteredSubscriptions(filtered);
    setPage(0);
  }, [subscriptions, searchText, statusFilter, typeFilter]);

  const loadSubscriptions = async () => {
    try {
      setLoading(true);
      const subscriptionsData = await adminService.getUserSubscriptions();
      setSubscriptions(subscriptionsData);
    } catch (err: any) {
      setError(
        err.response?.data?.error || "Abonelikler yüklenirken hata oluştu"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (subscription: SubscriptionUser) => {
    setEditingSubscription(subscription);
    setFormData({
      subscription_type: subscription.subscription_type,
      months: 1,
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingSubscription(null);
  };

  const handleSubmit = async () => {
    if (!editingSubscription) return;

    try {
      await adminService.updateUserSubscription(
        editingSubscription.id,
        formData
      );
      setSnackbar({
        open: true,
        message: "Abonelik başarıyla güncellendi",
        severity: "success",
      });
      handleCloseDialog();
      loadSubscriptions();
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.response?.data?.error || "Güncelleme başarısız",
        severity: "error",
      });
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

  const handleClearFilters = () => {
    setSearchText("");
    setStatusFilter("");
    setTypeFilter("");
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case "Aktif":
        return (
          <Chip
            label="Aktif"
            color="success"
            size="small"
            icon={<CheckCircle />}
          />
        );
      case "Süresi Dolmuş":
        return (
          <Chip
            label="Süresi Dolmuş"
            color="error"
            size="small"
            icon={<Cancel />}
          />
        );
      case "Aktif Değil":
        return (
          <Chip
            label="Aktif Değil"
            color="default"
            size="small"
            icon={<Timer />}
          />
        );
      default:
        return <Chip label={status} color="default" size="small" />;
    }
  };

  const getSubscriptionTypeChip = (type: string) => {
    if (type === "premium") {
      return (
        <Chip
          label="Premium"
          color="primary"
          size="small"
          icon={<TrendingUp />}
        />
      );
    }
    return <Chip label="Temel" color="default" size="small" />;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("tr-TR");
  };

  // İstatistikler - filtrelenmiş verilerle
  const stats = {
    total: filteredSubscriptions.length,
    active: filteredSubscriptions.filter((s) => s.status === "Aktif").length,
    expired: filteredSubscriptions.filter((s) => s.status === "Süresi Dolmuş")
      .length,
    premium: filteredSubscriptions.filter(
      (s) => s.subscription_type === "premium"
    ).length,
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
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Abonelik Yönetimi
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Arama ve Filtreleme */}
      <Box display="flex" gap={2} mb={3} flexWrap="wrap">
        <TextField
          placeholder="Kullanıcı adı, email veya ID ara..."
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

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Durum</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            label="Durum"
          >
            <MenuItem value="">Tümü</MenuItem>
            <MenuItem value="Aktif">Aktif</MenuItem>
            <MenuItem value="Süresi Dolmuş">Süresi Dolmuş</MenuItem>
            <MenuItem value="Aktif Değil">Aktif Değil</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Tür</InputLabel>
          <Select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            label="Tür"
          >
            <MenuItem value="">Tümü</MenuItem>
            <MenuItem value="basic">Temel</MenuItem>
            <MenuItem value="premium">Premium</MenuItem>
          </Select>
        </FormControl>

        {(searchText || statusFilter || typeFilter) && (
          <Button
            variant="outlined"
            onClick={handleClearFilters}
            startIcon={<ClearIcon />}
          >
            Temizle
          </Button>
        )}
      </Box>

      {/* İstatistik Kartları - Güncellenmiş */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: "linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)",
              color: "white",
            }}
          >
            <CardContent>
              <Typography variant="h6">Toplam Abonelik</Typography>
              <Typography variant="h4" fontWeight="bold">
                {stats.total}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: "linear-gradient(135deg, #4caf50 0%, #8bc34a 100%)",
              color: "white",
            }}
          >
            <CardContent>
              <Typography variant="h6">Aktif</Typography>
              <Typography variant="h4" fontWeight="bold">
                {stats.active}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: "linear-gradient(135deg, #ff9800 0%, #f57c00 100%)",
              color: "white",
            }}
          >
            <CardContent>
              <Typography variant="h6">Premium</Typography>
              <Typography variant="h4" fontWeight="bold">
                {stats.premium}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: "linear-gradient(135deg, #f44336 0%, #d32f2f 100%)",
              color: "white",
            }}
          >
            <CardContent>
              <Typography variant="h6">Süresi Dolmuş</Typography>
              <Typography variant="h4" fontWeight="bold">
                {stats.expired}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell>Kullanıcı</TableCell>
              <TableCell>Abonelik Türü</TableCell>
              <TableCell>Durum</TableCell>
              <TableCell>Bitiş Tarihi</TableCell>
              <TableCell>Kayıt Tarihi</TableCell>
              <TableCell align="center">İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSubscriptions
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((subscription) => (
                <TableRow key={subscription.id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar sx={{ bgcolor: "primary.main" }}>
                        <PersonIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {subscription.username}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {subscription.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {getSubscriptionTypeChip(subscription.subscription_type)}
                  </TableCell>
                  <TableCell>{getStatusChip(subscription.status)}</TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(subscription.subscription_end_date)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(subscription.created_at)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenDialog(subscription)}
                      title="Düzenle"
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredSubscriptions.length}
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
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle>Abonelik Düzenle</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} pt={1}>
            <Typography variant="body2" color="text.secondary">
              Kullanıcı: <strong>{editingSubscription?.username}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              E-posta: <strong>{editingSubscription?.email}</strong>
            </Typography>

            <FormControl fullWidth>
              <InputLabel>Abonelik Türü</InputLabel>
              <Select
                value={formData.subscription_type}
                label="Abonelik Türü"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    subscription_type: e.target.value,
                  })
                }
              >
                <MenuItem value="basic">Temel</MenuItem>
                <MenuItem value="premium">Premium</MenuItem>
              </Select>
            </FormControl>

            {formData.subscription_type === "premium" && (
              <FormControl fullWidth>
                <InputLabel>Abonelik Süresi</InputLabel>
                <Select
                  value={formData.months}
                  label="Abonelik Süresi"
                  onChange={(e) =>
                    setFormData({ ...formData, months: Number(e.target.value) })
                  }
                >
                  <MenuItem value={1}>1 Ay</MenuItem>
                  <MenuItem value={3}>3 Ay</MenuItem>
                  <MenuItem value={6}>6 Ay</MenuItem>
                  <MenuItem value={12}>12 Ay</MenuItem>
                </Select>
              </FormControl>
            )}

            {formData.subscription_type === "basic" && (
              <Alert severity="info">
                Temel abonelik seçildiğinde premium abonelik iptal edilecek.
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog} color="inherit">
            İptal
          </Button>
          <Button onClick={handleSubmit} variant="contained">
            Güncelle
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

export default SubscriptionManagement;
