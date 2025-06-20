import React from "react";
import { Book } from "../infrastructure/types";
import { bookService } from "../infrastructure/services/api";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  Stack,
  IconButton,
  Tooltip,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import { useNavigate } from "react-router-dom";

interface BookCardProps {
  book: Book;
  onRent?: (bookId: number) => void;
  isRented?: boolean;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  onRent,
  isRented,
}) => {
  const navigate = useNavigate();

  const handleRent = async () => {
    try {
      await bookService.rentBook(book.id);
      onRent?.(book.id);
    } catch (error) {
      console.error("Kitap kiralama hatası:", error);
    }
  };

  const handleBookClick = () => {
    navigate(`/book/${book.id}`);
  };

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        position: "relative",
        transition: "transform 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
        },
        cursor: "pointer",
      }}
      onClick={handleBookClick}
    >
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          height="200"
          image={book.cover_image_url || "https://via.placeholder.com/200x300"}
          alt={book.title}
          sx={{
            objectFit: "cover",
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        />
        {isRented && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              m: 1,
            }}
          >
            <Chip
              label="Kiralandı"
              color="primary"
              size="small"
              icon={<LocalLibraryIcon />}
              sx={{ fontWeight: 600 }}
            />
          </Box>
        )}
      </Box>
      <CardContent
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        <Box sx={{ mb: 2 }}>
          <Typography
            gutterBottom
            variant="h6"
            component="div"
            sx={{
              fontWeight: 600,
              fontSize: "1rem",
              lineHeight: 1.2,
              mb: 1,
              display: "-webkit-box",
              overflow: "hidden",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 2,
            }}
          >
            {book.title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 1,
              display: "-webkit-box",
              overflow: "hidden",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 2,
            }}
          >
            {book.author}
          </Typography>
        </Box>
        {book.categories && book.categories.length > 0 && (
          <Stack
            direction="row"
            spacing={1}
            sx={{ mb: 2, flexWrap: "wrap", gap: 0.5 }}
          >
            {book.categories.slice(0, 3).map((category) => (
              <Chip
                key={category.id}
                label={category.name}
                size="small"
                variant="outlined"
                sx={{ borderRadius: 1 }}
              />
            ))}
            {book.categories.length > 3 && (
              <Tooltip
                title={book.categories
                  .slice(3)
                  .map((c) => c.name)
                  .join(", ")}
              >
                <Chip
                  label={`+${book.categories.length - 3}`}
                  size="small"
                  variant="outlined"
                  sx={{ borderRadius: 1 }}
                />
              </Tooltip>
            )}
          </Stack>
        )}
        <Box sx={{ mt: "auto", display: "flex", alignItems: "center", gap: 1 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={(e) => {
              e.stopPropagation();
              handleRent();
            }}
            disabled={isRented}
            sx={{
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            {isRented ? "Kiralandı" : "Kirala"}
          </Button>
          <Tooltip title="Detaylar">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleBookClick();
              }}
              sx={{
                bgcolor: "action.selected",
                "&:hover": {
                  bgcolor: "action.focus",
                },
              }}
            >
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
};
