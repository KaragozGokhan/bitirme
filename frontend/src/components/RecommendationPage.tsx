import React, { useEffect, useState } from "react";
import { aiService, bookService } from "../infrastructure/services/api";
import {
  Recommendation,
  RecommendationResponse,
  Book,
} from "../infrastructure/types";
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
    const loadRecommendations = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const userId = user.id;

        // AI modeli eğit
        const trainResponse = await fetch("/api/ai/train", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        // Benzer kullanıcı önerilerini al
        const recResponse = await fetch(
          `/api/ai/similar-users-recommendations?user_id=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (recResponse.ok) {
          const recommendations = await recResponse.json();
          const bookIds = recommendations.map((rec: any) => rec.book_id);

          // Kitap detaylarını al
          const bookDetails = await Promise.all(
            bookIds.map((id: number) => bookService.getBookById(id))
          );

          setRecommendations(bookDetails);
        }
      } catch (error) {
        console.error("Öneri yükleme hatası:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, [user]);

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
