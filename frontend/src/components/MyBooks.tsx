import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Stack,
  Alert,
  Avatar,
  CircularProgress,
  Modal,
  Checkbox,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Pagination,
} from "@mui/material";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";
import InfoIcon from "@mui/icons-material/Info";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import DeleteIcon from "@mui/icons-material/Delete";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { useNavigate } from "react-router-dom";
import { useMyBooks } from "../infrastructure/contexts/MyBooksContext";
import { useSidebar } from "../infrastructure/contexts/SidebarContext";
import { Book } from "../infrastructure/types";
import { useAudioPlayer } from "../infrastructure/contexts/AudioPlayerContext";
import { toast } from "react-toastify";

export const MyBooks: React.FC = () => {
  const navigate = useNavigate();
  const { myBooks, loading, removeBookFromLibrary, user } = useMyBooks();
  const { sidebarOpen } = useSidebar();
  const { playTrack, currentTrack, isPlaying, togglePlayPause } =
    useAudioPlayer();
  const [page, setPage] = useState(1);
  const [selectedBooks, setSelectedBooks] = useState<number[]>([]);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [deletingBooks, setDeletingBooks] = useState<number[]>([]);

  const itemsPerPage = 15; // Her sayfada 15 kitap (3 satır x 5 kitap)

  const handleViewBook = (bookId: number) => {
    navigate(`/book/${bookId}`);
  };

  const handleReturnBook = async (bookId: number) => {
    if (window.confirm("Bu kitabı iade etmek istediğinizden emin misiniz?")) {
      try {
        // Start animation
        setDeletingBooks((prev) => [...prev, bookId]);

        // Wait for animation
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Remove book
        await removeBookFromLibrary(bookId);

        // Clear animation state
        setDeletingBooks((prev) => prev.filter((id) => id !== bookId));

        toast.success("Kitap kütüphanenizden kaldırıldı!");
      } catch (error) {
        // Clear animation state on error
        setDeletingBooks((prev) => prev.filter((id) => id !== bookId));
        console.error("Kitap silme hatası:", error);
        toast.error("Kitap kaldırılırken bir hata oluştu.");
      }
    }
  };

  const handlePlayAudio = (book: Book) => {
    // If this book is currently playing, pause/resume
    if (currentTrack?.id === book.id) {
      togglePlayPause();
    } else {
      // Start playing a different book
      playTrack(book);
    }
  };

  const handleReadPdf = (book: Book) => {
    if (!book?.pdf_url) {
      toast.error("Bu kitap için PDF versiyonu mevcut değil");
      return;
    }

    // Process PDF URL - if it starts with pdfurl/, it's a local file
    const pdfUrl = book.pdf_url.startsWith("pdfurl/")
      ? `/${book.pdf_url}`
      : book.pdf_url;

    // Open PDF in a new tab
    window.open(pdfUrl, "_blank");
    toast.success("PDF yeni sekmede açılıyor...");
  };

  const isCurrentlyPlaying = (book: Book) => {
    return currentTrack?.id === book.id && isPlaying;
  };

  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    newPage: number
  ) => {
    setPage(newPage);
  };

  // Bulk selection functions - only premium books can be selected
  const handleSelectBook = (bookId: number) => {
    const book = myBooks.find((b) => b.id === bookId);
    if (book && (book.acquisition_method || "purchase") === "premium") {
      setSelectedBooks((prev) =>
        prev.includes(bookId)
          ? prev.filter((id) => id !== bookId)
          : [...prev, bookId]
      );
    }
  };

  const handleSelectAll = () => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPageBooks = myBooks.slice(startIndex, endIndex);

    // Make only premium books selectable
    const selectableBooks = currentPageBooks.filter(
      (book) => (book.acquisition_method || "purchase") === "premium"
    );
    const selectableBookIds = selectableBooks.map((book) => book.id);
    const allSelected = selectableBookIds.every((id) =>
      selectedBooks.includes(id)
    );

    if (allSelected) {
      // Remove selection of premium books on the current page
      setSelectedBooks((prev) =>
        prev.filter((id) => !selectableBookIds.includes(id))
      );
    } else {
      // Select
      setSelectedBooks((prev) => [...new Set([...prev, ...selectableBookIds])]);
    }
  };

  const handleBulkDelete = async () => {
    try {
      // Start animation for all selected books
      setDeletingBooks((prev) => [...prev, ...selectedBooks]);

      // Wait for animation
      await new Promise((resolve) => setTimeout(resolve, 600));

      // Remove books
      for (const bookId of selectedBooks) {
        await removeBookFromLibrary(bookId);
      }

      // Clear animation and selection states
      setDeletingBooks((prev) =>
        prev.filter((id) => !selectedBooks.includes(id))
      );

      toast.success(
        `${selectedBooks.length} kitap kütüphanenizden kaldırıldı!`
      );
      setSelectedBooks([]);
      setBulkDeleteDialogOpen(false);
    } catch (error) {
      // Clear animation state on error
      setDeletingBooks((prev) =>
        prev.filter((id) => !selectedBooks.includes(id))
      );
      console.error("Toplu silme hatası:", error);
      toast.error("Kitaplar kaldırılırken bir hata oluştu.");
    }
  };

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageBooks = myBooks.slice(startIndex, endIndex);
  const totalPages = Math.ceil(myBooks.length / itemsPerPage);

  // Check selection status for only premium books
  const selectableCurrentPageBooks = currentPageBooks.filter(
    (book) => (book.acquisition_method || "purchase") === "premium"
  );
  const selectableCurrentPageBookIds = selectableCurrentPageBooks.map(
    (book) => book.id
  );
  const allCurrentPageSelected =
    selectableCurrentPageBookIds.length > 0 &&
    selectableCurrentPageBookIds.every((id) => selectedBooks.includes(id));
  const someCurrentPageSelected = selectableCurrentPageBookIds.some((id) =>
    selectedBooks.includes(id)
  );

  if (loading || !user) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (myBooks.length === 0) {
    return (
      <Box>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 2,
            bgcolor: "background.paper",
            textAlign: "center",
          }}
        >
          <Typography variant="h5" component="h1" fontWeight={700} gutterBottom>
            Kitaplığınızda hiç kitap yok.
          </Typography>
          <Typography color="text.secondary">
            Hemen yeni kitaplar keşfedip kiralamaya başlayın!
          </Typography>
        </Paper>
      </Box>
    );
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
          mb={2}
        >
          <Typography variant="h5" component="h1" fontWeight={700}>
            Kitaplarım
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            {selectedBooks.length > 0 && (
              <Button
                variant="contained"
                color="error"
                size="small"
                startIcon={<DeleteIcon />}
                onClick={() => setBulkDeleteDialogOpen(true)}
              >
                Seçilenleri Kaldır ({selectedBooks.length})
              </Button>
            )}
            <Chip
              label={`Toplam ${myBooks.length} kitap`}
              color="primary"
              size="small"
            />
          </Stack>
        </Stack>

        {/* Bulk selection controls */}
        {selectableCurrentPageBooks.length > 0 && (
          <Box mb={1.5} display="flex" alignItems="center">
            <Checkbox
              size="small"
              indeterminate={someCurrentPageSelected && !allCurrentPageSelected}
              checked={allCurrentPageSelected}
              onChange={handleSelectAll}
              sx={{ p: 0.5 }}
            />
            <Typography
              component="span"
              variant="caption"
              color="text.secondary"
              sx={{ ml: 0.5, fontSize: "0.75rem" }}
            >
              Sayfadaki tüm premium kitapları seç
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Book Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, 1fr)",
            sm: "repeat(3, 1fr)",
            md: sidebarOpen ? "repeat(3, 1fr)" : "repeat(4, 1fr)",
            lg: sidebarOpen ? "repeat(4, 1fr)" : "repeat(5, 1fr)",
            xl: sidebarOpen ? "repeat(5, 1fr)" : "repeat(6, 1fr)",
          },
          gap: 2,
          mb: 4,
        }}
      >
        {currentPageBooks.map((book) => (
          <Box
            key={book.id}
            sx={{
              transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
              // Box effect for delete animation
              ...(deletingBooks.includes(book.id) && {
                transform: "translateX(-100px)",
                opacity: 0,
                scale: 0,
              }),
            }}
          >
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                // Delete animation
                ...(deletingBooks.includes(book.id) && {
                  transform: "scale(0.8) rotateY(20deg)",
                  opacity: 0,
                  filter: "blur(2px)",
                  backgroundColor: "rgba(255, 0, 0, 0.1)",
                  borderColor: "error.main",
                  boxShadow: "0 0 20px rgba(255, 0, 0, 0.3)",
                }),
                // Normal hover effect (only if not deleting)
                ...(!deletingBooks.includes(book.id) && {
                  "&:hover": {
                    transform: "translateY(-4px) scale(1.02)",
                    boxShadow: (theme) =>
                      theme.palette.mode === "dark"
                        ? "0 12px 30px rgba(0,0,0,0.5)"
                        : "0 12px 30px rgba(0,0,0,0.2)",
                  },
                }),
              }}
            >
              {/* Checkbox - only for premium books */}
              {(book.acquisition_method || "purchase") === "premium" && (
                <Checkbox
                  checked={selectedBooks.includes(book.id)}
                  onChange={() => handleSelectBook(book.id)}
                  sx={{
                    position: "absolute",
                    top: 8,
                    left: 8,
                    zIndex: 1,
                    bgcolor: "rgba(255,255,255,0.8)",
                    borderRadius: 1,
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.9)",
                    },
                  }}
                />
              )}

              {/* Book Cover */}
              <Box
                sx={{
                  position: "relative",
                  cursor: "pointer",
                }}
                onClick={() => handleViewBook(book.id)}
              >
                <CardMedia
                  component="img"
                  height="280"
                  image={
                    book.cover_image_url &&
                    book.cover_image_url.startsWith("kitaplar/")
                      ? `/${book.cover_image_url}`
                      : book.cover_image_url ||
                        "https://via.placeholder.com/200x280"
                  }
                  alt={book.title}
                  sx={{
                    objectFit: "cover",
                    borderRadius: "12px 12px 0 0",
                  }}
                />

                {/* Status Chip */}
                <Chip
                  label={
                    (book.acquisition_method || "purchase") === "premium"
                      ? "Premium"
                      : "Satın Alındı"
                  }
                  color={
                    (book.acquisition_method || "purchase") === "premium"
                      ? "secondary"
                      : "success"
                  }
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    ...((book.acquisition_method || "purchase") === "premium"
                      ? {
                          bgcolor: "secondary.main",
                          color: "white",
                          fontWeight: "bold",
                          fontSize: "0.75rem",
                          boxShadow: "0 2px 8px rgba(156, 39, 176, 0.3)",
                          backdropFilter: "blur(4px)",
                        }
                      : {
                          bgcolor: "rgba(255,255,255,0.9)",
                          backdropFilter: "blur(4px)",
                        }),
                  }}
                />
              </Box>

              {/* Book Information */}
              <CardContent sx={{ flexGrow: 1, p: 2 }}>
                <Typography
                  variant="h6"
                  component="h3"
                  sx={{
                    fontWeight: 600,
                    fontSize: "1rem",
                    lineHeight: 1.3,
                    mb: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    cursor: "pointer",
                    "&:hover": {
                      color: "primary.main",
                    },
                  }}
                  onClick={() => handleViewBook(book.id)}
                >
                  {book.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {book.author}
                </Typography>
              </CardContent>

              {/* Action Buttons */}
              <CardActions
                sx={{
                  p: 2,
                  pt: 0,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {/* Left side - Info, PDF and Play buttons */}
                <Box sx={{ display: "flex", gap: 0.5 }}>
                  <Tooltip title="Detaylar">
                    <IconButton
                      onClick={() => handleViewBook(book.id)}
                      size="small"
                      sx={{
                        width: 40,
                        height: 40,
                        background:
                          "linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)",
                        color: "white",
                        borderRadius: "50%",
                        boxShadow: "0 4px 15px 0 rgba(116, 185, 255, 0.4)",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": {
                          background:
                            "linear-gradient(135deg, #0984e3 0%, #2d3436 100%)",
                          transform: "scale(1.1) translateY(-2px)",
                          boxShadow: "0 8px 25px 0 rgba(116, 185, 255, 0.6)",
                        },
                        "&:active": {
                          transform: "scale(0.95)",
                        },
                      }}
                    >
                      <InfoIcon sx={{ fontSize: "1.2rem" }} />
                    </IconButton>
                  </Tooltip>

                  {book.pdf_url && (
                    <Tooltip title="Oku">
                      <IconButton
                        onClick={() => handleReadPdf(book)}
                        size="small"
                        sx={{
                          width: 40,
                          height: 40,
                          background:
                            "linear-gradient(135deg, #9c27b0 0%, #673ab7 100%)",
                          color: "white",
                          borderRadius: "50%",
                          boxShadow: "0 4px 15px 0 rgba(156, 39, 176, 0.4)",
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          "&:hover": {
                            background:
                              "linear-gradient(135deg, #8e24aa 0%, #5e35b1 100%)",
                            transform: "scale(1.1) translateY(-2px)",
                            boxShadow: "0 8px 25px 0 rgba(156, 39, 176, 0.6)",
                          },
                          "&:active": {
                            transform: "scale(0.95)",
                          },
                        }}
                      >
                        <MenuBookIcon sx={{ fontSize: "1.2rem" }} />
                      </IconButton>
                    </Tooltip>
                  )}

                  {book.audio_url && (
                    <Tooltip
                      title={isCurrentlyPlaying(book) ? "Duraklat" : "Dinle"}
                    >
                      <IconButton
                        onClick={() => handlePlayAudio(book)}
                        size="small"
                        sx={{
                          width: 40,
                          height: 40,
                          background: isCurrentlyPlaying(book)
                            ? "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)"
                            : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          color: "white",
                          borderRadius: "50%",
                          boxShadow: "0 4px 15px 0 rgba(102, 126, 234, 0.4)",
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          "&:hover": {
                            background: isCurrentlyPlaying(book)
                              ? "linear-gradient(135deg, #ff5252 0%, #d84315 100%)"
                              : "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
                            transform: "scale(1.1) translateY(-2px)",
                            boxShadow: "0 8px 25px 0 rgba(102, 126, 234, 0.6)",
                          },
                          "&:active": {
                            transform: "scale(0.95)",
                          },
                        }}
                      >
                        {isCurrentlyPlaying(book) ? (
                          <PauseIcon sx={{ fontSize: "1.2rem" }} />
                        ) : (
                          <PlayArrowIcon sx={{ fontSize: "1.2rem", ml: 0.1 }} />
                        )}
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>

                  {/* Right side - Delete button */}  
                {(book.acquisition_method || "purchase") !== "purchase" && (
                  <Tooltip title="Kütüphaneden Kaldır">
                    <IconButton
                      onClick={() => handleReturnBook(book.id)}
                      size="small"
                      disabled={deletingBooks.includes(book.id)}
                      sx={{
                        width: 40,
                        height: 40,
                        background:
                          "linear-gradient(135deg, #ff7675 0%, #d63031 100%)",
                        color: "white",
                        borderRadius: "50%",
                        boxShadow: "0 4px 15px 0 rgba(255, 118, 117, 0.4)",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": {
                          background:
                            "linear-gradient(135deg, #e84393 0%, #a29bfe 100%)",
                          transform: "scale(1.1) translateY(-2px)",
                          boxShadow: "0 8px 25px 0 rgba(255, 118, 117, 0.6)",
                        },
                        "&:active": {
                          transform: "scale(0.95)",
                        },
                        "&:disabled": {
                          background: "rgba(255, 118, 117, 0.3)",
                          transform: "scale(1.2) rotate(360deg)",
                          boxShadow: "0 0 20px rgba(255, 0, 0, 0.5)",
                        },
                        ...(deletingBooks.includes(book.id) && {
                          transform: "scale(1.2) rotate(360deg)",
                          background:
                            "linear-gradient(135deg, #e84393 0%, #a29bfe 100%)",
                          boxShadow: "0 0 20px rgba(255, 0, 0, 0.8)",
                          animation: "pulse 0.5s infinite",
                          "@keyframes pulse": {
                            "0%": {
                              boxShadow: "0 0 20px rgba(255, 0, 0, 0.8)",
                            },
                            "50%": {
                              boxShadow: "0 0 30px rgba(255, 0, 0, 1)",
                            },
                            "100%": {
                              boxShadow: "0 0 20px rgba(255, 0, 0, 0.8)",
                            },
                          },
                        }),
                      }}
                    >
                      <DeleteIcon sx={{ fontSize: "1.2rem" }} />
                    </IconButton>
                  </Tooltip>
                )}
              </CardActions>
            </Card>
          </Box>
        ))}
      </Box>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handleChangePage}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
          />
        </Box>
      )}

      {/* Bulk delete confirmation dialog */}    
      <Dialog
        open={bulkDeleteDialogOpen}
        onClose={() => setBulkDeleteDialogOpen(false)}
        aria-labelledby="bulk-delete-dialog-title"
        aria-describedby="bulk-delete-dialog-description"
      >
        <DialogTitle id="bulk-delete-dialog-title">
          Kitapları Kaldır
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="bulk-delete-dialog-description">
            Seçilen {selectedBooks.length} kitabı kütüphanenizden kaldırmak
            istediğinizden emin misiniz? Bu işlem geri alınamaz.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkDeleteDialogOpen(false)}>İptal</Button>
          <Button onClick={handleBulkDelete} color="error" variant="contained">
            Kaldır
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
