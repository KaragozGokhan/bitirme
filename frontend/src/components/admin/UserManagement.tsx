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
  InputAdornment,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import { adminService } from "../../infrastructure/services/api";
import { User } from "../../infrastructure/types";

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  // Arama ve filtreleme state'leri
  const [searchText, setSearchText] = useState("");
  const [subscriptionFilter, setSubscriptionFilter] = useState<string>("");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    subscription_type: "basic",
    subscription_end_date: "",
  });

  useEffect(() => {
    loadUsers();
  }, []);

  // Arama ve filtreleme effect'i
  useEffect(() => {
    let filtered = users;

    // Metin araması
    if (searchText.trim()) {
      filtered = filtered.filter(
        (user) =>
          user.username.toLowerCase().includes(searchText.toLowerCase()) ||
          user.email.toLowerCase().includes(searchText.toLowerCase()) ||
          user.id.toString().includes(searchText)
      );
    }

    // Abonelik filtresi
    if (subscriptionFilter) {
      if (subscriptionFilter === "active_premium") {
        filtered = filtered.filter((user) => {
          if (
            user.subscription_type === "premium" &&
            user.subscription_end_date
          ) {
            return new Date(user.subscription_end_date) > new Date();
          }
          return false;
        });
      } else if (subscriptionFilter === "expired_premium") {
        filtered = filtered.filter((user) => {
          if (
            user.subscription_type === "premium" &&
            user.subscription_end_date
          ) {
            return new Date(user.subscription_end_date) <= new Date();
          }
          return false;
        });
      } else {
        filtered = filtered.filter(
          (user) => user.subscription_type === subscriptionFilter
        );
      }
    }

    setFilteredUsers(filtered);
    setPage(0);
  }, [users, searchText, subscriptionFilter]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const usersData = await adminService.getUsers();
      setUsers(usersData);
    } catch (err: any) {
      setError(
        err.response?.data?.error || "Kullanıcılar yüklenirken hata oluştu"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (user: User) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      subscription_type: user.subscription_type,
      subscription_end_date: user.subscription_end_date
        ? new Date(user.subscription_end_date).toISOString().split("T")[0]
        : "",
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingUser(null);
  };

  const handleSubmit = async () => {
    if (!editingUser) return;

    try {
      const updateData = {
        ...formData,
        subscription_end_date: formData.subscription_end_date
          ? new Date(formData.subscription_end_date).toISOString()
          : null,
      };

      await adminService.updateUser(editingUser.id, updateData);
      setSnackbar({
        open: true,
        message: "Kullanıcı başarıyla güncellendi",
        severity: "success",
      });
      handleCloseDialog();
      loadUsers();
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.response?.data?.error || "Güncelleme başarısız",
        severity: "error",
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Bu kullanıcıyı silmek istediğinizden emin misiniz?")) {
      try {
        await adminService.deleteUser(id);
        setSnackbar({
          open: true,
          message: "Kullanıcı başarıyla silindi",
          severity: "success",
        });
        loadUsers();
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

  const handleClearFilters = () => {
    setSearchText("");
    setSubscriptionFilter("");
  };

  const getSubscriptionStatus = (user: User) => {
    if (user.subscription_type === "basic") {
      return { label: "Temel", color: "default" as const };
    }

    if (user.subscription_end_date) {
      const endDate = new Date(user.subscription_end_date);
      const now = new Date();

      if (endDate > now) {
        return { label: "Premium Aktif", color: "success" as const };
      } else {
        return { label: "Premium Süresi Dolmuş", color: "error" as const };
      }
    }

    return { label: "Premium", color: "primary" as const };
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("tr-TR");
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
          Kullanıcı Yönetimi
        </Typography>
      </Box>

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

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Abonelik</InputLabel>
          <Select
            value={subscriptionFilter}
            onChange={(e) => setSubscriptionFilter(e.target.value)}
            label="Abonelik"
          >
            <MenuItem value="">Tümü</MenuItem>
            <MenuItem value="basic">Temel</MenuItem>
            <MenuItem value="premium">Premium</MenuItem>
            <MenuItem value="active_premium">Aktif Premium</MenuItem>
            <MenuItem value="expired_premium">Süresi Dolmuş Premium</MenuItem>
          </Select>
        </FormControl>

        {(searchText || subscriptionFilter) && (
          <Button
            variant="outlined"
            onClick={handleClearFilters}
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
              <TableCell>Avatar</TableCell>
              <TableCell>Kullanıcı Adı</TableCell>
              <TableCell>E-posta</TableCell>
              <TableCell>Kayıt Tarihi</TableCell>
              <TableCell>Abonelik Durumu</TableCell>
              <TableCell>Abonelik Bitiş</TableCell>
              <TableCell align="center">İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user) => {
                const subscriptionStatus = getSubscriptionStatus(user);
                return (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Avatar sx={{ bgcolor: "primary.main" }}>
                        <PersonIcon />
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {user.username}
                      </Typography>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{formatDate(user.created_at)}</TableCell>
                    <TableCell>
                      <Chip
                        label={subscriptionStatus.label}
                        color={subscriptionStatus.color}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {formatDate(user.subscription_end_date)}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenDialog(user)}
                        title="Düzenle"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(user.id)}
                        title="Sil"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredUsers.length}
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
        <DialogTitle>Kullanıcı Düzenle</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} pt={1}>
            <TextField
              label="Kullanıcı Adı"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              fullWidth
              required
            />
            <TextField
              label="E-posta"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              fullWidth
              required
            />
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
              <TextField
                label="Abonelik Bitiş Tarihi"
                type="date"
                value={formData.subscription_end_date}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    subscription_end_date: e.target.value,
                  })
                }
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog} color="inherit">
            İptal
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!formData.username || !formData.email}
          >
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

export default UserManagement;
