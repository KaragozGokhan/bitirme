import React from "react";
import { Container, Typography, Box, Button, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4, textAlign: "center" }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Kitap Dünyasına Hoş Geldiniz
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Binlerce kitabı keşfedin, okuyun ve kiralayın
        </Typography>
        <Grid container spacing={2} justifyContent="center" sx={{ mt: 4 }}>
          <Grid item>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/books")}
            >
              Kitapları Keşfet
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate("/register")}
            >
              Hemen Üye Ol
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Home;
