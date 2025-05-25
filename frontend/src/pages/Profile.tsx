import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Divider,
  Button,
  Grid,
  Chip,
  CircularProgress,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from "@mui/material";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import BookIcon from "@mui/icons-material/Book";
import HistoryIcon from "@mui/icons-material/History";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [rentals, setRentals] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Kiralama verilerini çekiyoruz
        const rentalsResponse = await axios.get(
          `${API_URL}/api/users/rentals`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Okuma geçmişini çekiyoruz
        const historyResponse = await axios.get(
          `${API_URL}/api/users/reading-history`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setRentals(rentalsResponse.data);
        setHistory(historyResponse.data);
      } catch (error) {
        console.error("Kullanıcı verileri alınamadı:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [API_URL]);

  if (!user) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            Profil
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1">Kullanıcı Adı:</Typography>
              <Typography variant="h6" gutterBottom>
                {user.username}
              </Typography>

              <Typography variant="subtitle1">E-posta:</Typography>
              <Typography variant="h6" gutterBottom>
                {user.email}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1">Üyelik Tipi:</Typography>
              <Chip
                label={
                  user.subscription_type === "free" ? "Ücretsiz" : "Premium"
                }
                color={
                  user.subscription_type === "free" ? "default" : "primary"
                }
                sx={{ mb: 2 }}
              />

              {user.subscription_end_date && (
                <>
                  <Typography variant="subtitle1">Bitiş Tarihi:</Typography>
                  <Typography variant="h6" gutterBottom>
                    {formatDate(user.subscription_end_date)}
                  </Typography>
                </>
              )}
            </Grid>
          </Grid>

          <Box sx={{ mt: 3 }}>
            <Button variant="contained" color="secondary" onClick={logout}>
              Çıkış Yap
            </Button>
          </Box>
        </Paper>

        <Paper elevation={3} sx={{ mt: 4 }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="profile tabs"
            >
              <Tab label="Kiraladığım Kitaplar" />
              <Tab label="Okuma Geçmişim" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                <CircularProgress />
              </Box>
            ) : rentals.length > 0 ? (
              <List>
                {rentals.map((rental: any) => (
                  <ListItem key={rental.rental_id} divider>
                    <ListItemAvatar>
                      <Avatar>
                        <BookIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={rental.title}
                      secondary={`Yazar: ${
                        rental.author
                      } | Kiralama Tarihi: ${formatDate(rental.rental_date)}`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body1" sx={{ p: 2 }}>
                Henüz kitap kiralamadınız.
              </Typography>
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                <CircularProgress />
              </Box>
            ) : history.length > 0 ? (
              <List>
                {history.map((item: any) => (
                  <ListItem key={item.history_id} divider>
                    <ListItemAvatar>
                      <Avatar>
                        <HistoryIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={item.title}
                      secondary={`Son Sayfa: ${
                        item.last_page
                      } | Son Okuma: ${formatDate(item.last_read)}`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body1" sx={{ p: 2 }}>
                Henüz kitap okumadınız.
              </Typography>
            )}
          </TabPanel>
        </Paper>
      </Box>
    </Container>
  );
};

export default Profile;
