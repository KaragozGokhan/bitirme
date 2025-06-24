import React, { useEffect, useState } from "react";
import { aiService, bookService } from "../infrastructure/services/api";
import { Recommendation, RecommendationResponse, Book } from "../infrastructure/types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { BookCard } from "./BookCard";

export const RecommendationPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      console.log("[ÖNERİ] useEffect başladı");
      setLoading(true);
      setError(null);
      try {
        const userId = Number(localStorage.getItem("userId"));
        console.log("[ÖNERİ] userId:", userId);
        if (!userId) {
          setError("Kullanıcı bulunamadı.");
          setLoading(false);
          return;
        }
        // Önce eğitim isteği at
        console.log("[ÖNERİ] /ai/train isteği atılıyor...");
        await aiService.train();
        console.log("[ÖNERİ] /ai/train cevabı alındı");
        // Eğitim bittikten sonra öneri isteği at
        console.log("[ÖNERİ] /ai/similar-users-recommendations isteği atılıyor...");
        const recResponse: RecommendationResponse = await aiService.getSimilarUsersRecommendations(userId, 5);
        console.log("[ÖNERİ] /ai/similar-users-recommendations cevabı:", recResponse);
        setRecommendations(recResponse.recommendations);
        // Kitap detaylarını çek
        const bookDetails = await Promise.all(
          recResponse.recommendations.map((rec) => bookService.getBookById(rec.book_id))
        );
        setBooks(bookDetails);
        console.log("[ÖNERİ] Kitap detayları yüklendi", bookDetails);
      } catch (err: any) {
        setError("Öneriler alınırken bir hata oluştu.");
        console.error("[ÖNERİ] Hata:", err);
      } finally {
        setLoading(false);
        console.log("[ÖNERİ] Yükleme bitti");
      }
    };
    fetchRecommendations();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Kitap Önerileri
      </Typography>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : books.length === 0 ? (
        <Alert severity="info">Öneri bulunamadı.</Alert>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(1, 1fr)",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(4, 1fr)",
            },
            gap: 3,
          }}
        >
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </Box>
      )}
    </Box>
  );
}; 