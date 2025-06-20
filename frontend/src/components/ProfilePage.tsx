import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Grid,
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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import StarIcon from "@mui/icons-material/Star";
import { userService } from "../infrastructure/services/api";
import { User } from "../infrastructure/types";

export const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<Partial<User>>({});

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

  const handleUpgradeSubscription = async () => {
    try {
      await userService.updateSubscription(user!.id, {
        subscription_type: "premium",
        months: 1,
      });
      await fetchUserProfile(); // Profili yenile
    } catch (error) {
      setError("Üyelik güncellenirken bir hata oluştu.");
      console.error("Üyelik güncelleme hatası:", error);
    }
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
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Kullanıcı Adı"
                name="username"
                value={isEditing ? editedUser.username : user.username}
                onChange={handleInputChange}
                disabled={!isEditing}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="E-posta"
                name="email"
                value={isEditing ? editedUser.email : user.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Üyelik Bilgileri */}
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

          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card
                sx={{
                  p: 2,
                  bgcolor: isSubscriptionActive()
                    ? "primary.lighter"
                    : "grey.50",
                  border: 1,
                  borderColor: isSubscriptionActive()
                    ? "primary.main"
                    : "grey.300",
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <StarIcon
                      sx={{
                        color: isSubscriptionActive()
                          ? "primary.main"
                          : "grey.500",
                        fontSize: 32,
                      }}
                    />
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        Mevcut Plan: {getSubscriptionStatus()}
                      </Typography>
                      {user.subscription_end_date && (
                        <Typography variant="body2" color="text.secondary">
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
            </Grid>

            <Grid item xs={12} md={4}>
              {!isSubscriptionActive() && (
                <Card
                  sx={{
                    p: 2,
                    bgcolor: "warning.lighter",
                    border: 1,
                    borderColor: "warning.main",
                  }}
                >
                  <CardContent sx={{ p: 0 }}>
                    <Typography variant="h6" color="warning.dark" gutterBottom>
                      Premium'a Geç
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Kitap dinleme özelliği için Premium üyelik gerekli
                    </Typography>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handleUpgradeSubscription}
                      sx={{ mt: 1 }}
                    >
                      Premium Al (₺29.99/ay)
                    </Button>
                  </CardContent>
                </Card>
              )}

              {isSubscriptionActive() && (
                <Card
                  sx={{
                    p: 2,
                    bgcolor: "success.lighter",
                    border: 1,
                    borderColor: "success.main",
                  }}
                >
                  <CardContent sx={{ p: 0 }}>
                    <Typography variant="h6" color="success.dark" gutterBottom>
                      Premium Aktif
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ✓ Kitap dinleme özelliği <br />
                      ✓ Sınırsız kitap kiralama <br />✓ Özel içerikler
                    </Typography>
                  </CardContent>
                </Card>
              )}
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};
