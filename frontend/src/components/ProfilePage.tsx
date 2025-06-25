import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  TextField,
  Button,
  Stack,
  Divider,
  Alert,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Chip,
  Switch,
  FormControlLabel,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import StarIcon from "@mui/icons-material/Star";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { userService } from "../infrastructure/services/api";
import { User } from "../infrastructure/types";
import { useTheme } from "../theme/ThemeContext";
import { useMyBooks } from "../infrastructure/contexts/MyBooksContext";
import PremiumPaymentForm from "./shared/PremiumPaymentForm";

export const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<Partial<User>>({});
  const { isDarkMode, toggleTheme } = useTheme();
  const { updateUser, refreshUserData, cancelPremiumSubscription } =
    useMyBooks();
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [isCancellingPremium, setIsCancellingPremium] = useState(false);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const userData = await userService.getProfile();
      setUser(userData);
      setEditedUser(userData);
    } catch (error) {
      setError("Profil bilgileri yüklenirken bir hata oluştu.");
      console.error("Profil yükleme hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await userService.updateProfile(editedUser);
      setUser(editedUser as User);
      setIsEditing(false);
      setError(null);
    } catch (error) {
      setError("Profil güncellenirken bir hata oluştu.");
      console.error("Profil güncelleme hatası:", error);
    }
  };

  const handleCancel = () => {
    setEditedUser(user || {});
    setIsEditing(false);
    setError(null);
  };

  const getSubscriptionStatus = () => {
    if (user?.subscription_type === "premium") {
      if (user.subscription_end_date) {
        const endDate = new Date(user.subscription_end_date);
        return endDate > new Date() ? "Aktif Premium" : "Süresi Dolmuş";
      }
      return "Aktif Premium";
    }
    return "Ücretsiz";
  };

  const isSubscriptionActive = () => {
    if (user?.subscription_type === "premium") {
      if (user.subscription_end_date) {
        const endDate = new Date(user.subscription_end_date);
        return endDate > new Date();
      }
      return true;
    }
    return false;
  };

  const handleCancelPremium = async () => {
    if (
      !user ||
      !window.confirm(
        "Premium üyeliğinizi iptal etmek istediğinizden emin misiniz? Premium ile kütüphaneye eklenen kitaplar otomatik olarak kaldırılacaktır."
      )
    ) {
      return;
    }

    try {
      setIsCancellingPremium(true);
      setError(null);

      // Use the cancelPremiumSubscription function from MyBooksContext
      // This function will both update the user information and remove premium books from the library
      await cancelPremiumSubscription();

      // ProfilePage'in kendi state'ini de güncelle
      await fetchUserProfile();

      alert(
        "Premium üyeliğiniz başarıyla iptal edildi ve premium kitaplar kütüphanenizden kaldırıldı."
      );
    } catch (error) {
      setError("Premium üyelik iptal edilirken bir hata oluştu.");
      console.error("Premium iptal hatası:", error);
    } finally {
      setIsCancellingPremium(false);
    }
  };

  const handlePremiumUpgradeSuccess = async () => {
    // Update the ProfilePage's own state
    await fetchUserProfile();

    // Update MyBooksContext
    await refreshUserData();

    // Refresh the page so all components are updated
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  if (!user) {
    return null;
  }

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 2,
          bgcolor: "background.paper",
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h5" component="h1" fontWeight={700}>
            Profil Bilgileri
          </Typography>
          {!isEditing ? (
            <Tooltip title="Düzenle">
              <IconButton
                onClick={() => setIsEditing(true)}
                sx={{
                  bgcolor: "action.selected",
                  "&:hover": { bgcolor: "action.focus" },
                }}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <Stack direction="row" spacing={1}>
              <Tooltip title="İptal">
                <IconButton
                  onClick={handleCancel}
                  sx={{
                    bgcolor: "error.lighter",
                    color: "error.main",
                    "&:hover": { bgcolor: "error.light" },
                  }}
                >
                  <CancelIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Kaydet">
                <IconButton
                  onClick={handleSave}
                  sx={{
                    bgcolor: "success.lighter",
                    color: "success.main",
                    "&:hover": { bgcolor: "success.light" },
                  }}
                >
                  <SaveIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          )}
        </Stack>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          bgcolor: "background.paper",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            p: 3,
            bgcolor: "primary.main",
            color: "primary.contrastText",
          }}
        >
          <Stack direction="row" spacing={3} alignItems="center">
            <Avatar
              src="/avatar-placeholder.png"
              alt={user.username}
              sx={{
                width: 100,
                height: 100,
                border: "4px solid",
                borderColor: "primary.contrastText",
              }}
            />
            <Box>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                {user.username}
              </Typography>
              <Typography variant="subtitle1">{user.email}</Typography>
              <Chip
                icon={<StarIcon />}
                label={getSubscriptionStatus()}
                color={isSubscriptionActive() ? "primary" : "default"}
                variant={isSubscriptionActive() ? "filled" : "outlined"}
                sx={{ mt: 1 }}
              />
            </Box>
          </Stack>
        </Box>

        <Divider />

        <Box sx={{ p: 3 }}>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
              width: "70%",
            }}
          >
            <Box sx={{ flex: "1 1 0", minWidth: 0 }}>
              <TextField
                fullWidth
                label="Kullanıcı Adı"
                name="username"
                value={isEditing ? editedUser.username : user.username}
                onChange={handleInputChange}
                disabled={!isEditing}
                variant="outlined"
              />
            </Box>
            <Box sx={{ flex: "1 1 0", minWidth: 0 }}>
              <TextField
                fullWidth
                label="E-posta"
                name="email"
                value={isEditing ? editedUser.email : user.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                variant="outlined"
              />
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Subscription Information */}
      <Paper
        elevation={0}
        sx={{
          mt: 3,
          borderRadius: 2,
          bgcolor: "background.paper",
          overflow: "hidden",
        }}
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Üyelik Bilgileri
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
              width: "70%",
            }}
          >
            <Box sx={{ flex: "1 1 0", minWidth: 0 }}>
              <Card
                sx={{
                  p: 2,
                  height: "100%",
                  bgcolor: isSubscriptionActive()
                    ? "primary.main"
                    : "background.default",
                  border: 1,
                  borderColor: isSubscriptionActive()
                    ? "primary.main"
                    : "divider",
                  color: isSubscriptionActive()
                    ? "primary.contrastText"
                    : "text.primary",
                }}
              >
                <CardContent
                  sx={{
                    p: 0,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <StarIcon
                      sx={{
                        color: isSubscriptionActive()
                          ? "primary.contrastText"
                          : "text.secondary",
                        fontSize: 32,
                      }}
                    />
                    <Box>
                      <Typography
                        variant="h6"
                        fontWeight={600}
                        color={
                          isSubscriptionActive()
                            ? "primary.contrastText"
                            : "text.primary"
                        }
                      >
                        Mevcut Plan: {getSubscriptionStatus()}
                      </Typography>
                      {user.subscription_end_date && (
                        <Typography
                          variant="body2"
                          color={
                            isSubscriptionActive()
                              ? "primary.contrastText"
                              : "text.secondary"
                          }
                          sx={{ opacity: 0.8 }}
                        >
                          Bitiş Tarihi:{" "}
                          {new Date(
                            user.subscription_end_date
                          ).toLocaleDateString("tr-TR")}
                        </Typography>
                      )}
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Box>

            <Box sx={{ flex: "1 1 0", minWidth: 0 }}>
              {!isSubscriptionActive() && (
                <Card
                  sx={{
                    p: 2,
                    height: "100%",
                    bgcolor: "warning.main",
                    border: 1,
                    borderColor: "warning.main",
                    color: "warning.contrastText",
                  }}
                >
                  <CardContent
                    sx={{
                      p: 0,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box>
                      <Typography
                        variant="h6"
                        color="warning.contrastText"
                        gutterBottom
                      >
                        Premium'a Geç
                      </Typography>
                      <Typography
                        variant="body2"
                        color="warning.contrastText"
                        gutterBottom
                        sx={{ opacity: 0.8 }}
                      >
                        Sınırsız kitap erişimi için Premium'a yükselt.
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => setShowPaymentForm(true)}
                      sx={{
                        mt: 1,
                        bgcolor: "background.paper",
                        color: "text.primary",
                        "&:hover": {
                          bgcolor: "action.hover",
                        },
                      }}
                    >
                      Premium Al (199.99₺/ay)
                    </Button>
                  </CardContent>
                </Card>
              )}

              {isSubscriptionActive() && (
                <Card
                  sx={{
                    p: 2,
                    height: "100%",
                    bgcolor: "success.main",
                    border: 1,
                    borderColor: "success.main",
                    color: "success.contrastText",
                  }}
                >
                  <CardContent
                    sx={{
                      p: 0,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box>
                      <Typography
                        variant="h6"
                        color="success.contrastText"
                        gutterBottom
                      >
                        Premium Aktif
                      </Typography>
                      <Typography
                        variant="body2"
                        color="success.contrastText"
                        sx={{ mb: 2, opacity: 0.9 }}
                      >
                        ✓ Kitap dinleme özelliği <br />
                        ✓ Sınırsız kitap kiralama <br />✓ Özel içerikler
                      </Typography>
                    </Box>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      fullWidth
                      onClick={handleCancelPremium}
                      disabled={isCancellingPremium}
                      sx={{
                        borderColor: "error.main",
                        color: "error.main",
                        bgcolor: "background.paper",
                        "&:hover": {
                          bgcolor: "error.main",
                          color: "error.contrastText",
                        },
                      }}
                    >
                      {isCancellingPremium
                        ? "İptal Ediliyor..."
                        : "Premium'ı İptal Et"}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Theme Settings */}
      <Paper
        elevation={0}
        sx={{
          mt: 3,
          borderRadius: 2,
          bgcolor: "background.paper",
          overflow: "hidden",
        }}
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Tema Ayarları
          </Typography>

          <Button
            variant="outlined"
            onClick={toggleTheme}
            sx={{
              p: 1.4,
              border: 2,
              borderColor: isDarkMode ? "primary.main" : "warning.main",
              color: isDarkMode ? "primary.main" : "warning.main",
              "&:hover": {
                borderColor: isDarkMode ? "primary.dark" : "warning.dark",
                bgcolor: isDarkMode ? "primary.lighter" : "warning.lighter",
              },
              fontSize: "0.77rem",
              fontWeight: 600,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <span style={{ fontSize: "1.05rem" }}>
                {isDarkMode ? "☀️" : "🌙"}
              </span>
              <span>{isDarkMode ? "Aydınlık Mod" : "Karanlık Mod"}</span>
            </Box>
          </Button>
        </Box>
      </Paper>

      {/* Premium payment form modal */}
      {showPaymentForm && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            bgcolor: "rgba(0,0,0,0.4)",
            zIndex: 1300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <PremiumPaymentForm
            userId={user!.id}
            onClose={() => setShowPaymentForm(false)}
            onSuccess={handlePremiumUpgradeSuccess}
          />
        </Box>
      )}
    </Box>
  );
};
