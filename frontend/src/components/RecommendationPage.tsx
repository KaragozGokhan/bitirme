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
import { useMyBooks } from "../infrastructure/contexts/MyBooksContext";

export const RecommendationPage: React.FC = () => {
  const { user } = useMyBooks();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    const loadRecommendations = async () => {
      if (!user?.id) {
        setLoading(false);
        setError("Önerileri görmek için giriş yapmalısınız.");
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const userId = user.id;

        // AI modeli eğit
        const trainResponse = await fetch("http://localhost:8000/ai/train", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        // Benzer kullanıcı önerilerini al
        const recResponse = await fetch(
          `http://localhost:8000/ai/similar-users-recommendations/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (recResponse.ok) {
          const data = await recResponse.json();
          const bookIds = data.recommendations.map((rec: any) => rec.book_id);

          // Kitap detaylarını al
          const bookDetails = await Promise.all(
            bookIds.map((id: number) => bookService.getBookById(id))
          );

          setBooks(bookDetails);
        } else {
          setError("Öneriler yüklenirken bir hata oluştu.");
        }
      } catch (error) {
        console.error("Öneri yükleme hatası:", error);
        setError("Öneriler yüklenirken bir hata oluştu.");
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
