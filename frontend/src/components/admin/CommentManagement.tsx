import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Alert,
  Chip,
  Avatar,
  TablePagination,
  CircularProgress,
  Snackbar,
  Rating,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Person as PersonIcon,
  Book as BookIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import { adminService } from "../../infrastructure/services/api";
import { Comment } from "../../infrastructure/types";

interface ExtendedComment extends Comment {
  book_title?: string;
  book_author?: string;
  username?: string;
}

const CommentManagement: React.FC = () => {
  const [comments, setComments] = useState<ExtendedComment[]>([]);
  const [filteredComments, setFilteredComments] = useState<ExtendedComment[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const [viewDialog, setViewDialog] = useState(false);
  const [selectedComment, setSelectedComment] =
    useState<ExtendedComment | null>(null);

  // Arama ve filtreleme state'leri
  const [searchText, setSearchText] = useState("");
  const [ratingFilter, setRatingFilter] = useState<number | "">("");

  useEffect(() => {
    loadComments();
  }, []);

  // Arama ve filtreleme effect'i
  useEffect(() => {
    let filtered = comments;

    // Metin araması
    if (searchText.trim()) {
      filtered = filtered.filter(
        (comment) =>
          comment.comment.toLowerCase().includes(searchText.toLowerCase()) ||
          comment.username?.toLowerCase().includes(searchText.toLowerCase()) ||
          comment.book_title
            ?.toLowerCase()
            .includes(searchText.toLowerCase()) ||
          comment.user_id.toString().includes(searchText)
      );
    }

    // Puan filtresi
    if (ratingFilter !== "") {
      filtered = filtered.filter((comment) => comment.rate === ratingFilter);
    }

    setFilteredComments(filtered);
    setPage(0); // Filtreleme sonrası ilk sayfaya dön
  }, [comments, searchText, ratingFilter]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const commentsData = await adminService.getComments();
      setComments(commentsData);
    } catch (err: any) {
      setError(err.response?.data?.error || "Yorumlar yüklenirken hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Bu yorumu silmek istediğinizden emin misiniz?")) {
      try {
        await adminService.deleteComment(id);
        setSnackbar({
          open: true,
          message: "Yorum başarıyla silindi",
          severity: "success",
        });
        loadComments();
      } catch (err: any) {
        setSnackbar({
          open: true,
          message: err.response?.data?.error || "Silme işlemi başarısız",
          severity: "error",
        });
      }
    }
  };

  const handleViewComment = (comment: ExtendedComment) => {
    setSelectedComment(comment);
    setViewDialog(true);
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
    setRatingFilter("");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const getRatingColor = (rate: number) => {
    if (rate >= 4) return "success";
    if (rate >= 3) return "warning";
    return "error";
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
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Yorum Yönetimi
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Arama ve Filtreleme */}
      <Box display="flex" gap={2} mb={3} flexWrap="wrap">
        <TextField
          placeholder="Yorum, kullanıcı adı veya kitap ara..."
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

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Puan</InputLabel>
          <Select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value as number | "")}
            label="Puan"
          >
            <MenuItem value="">Tümü</MenuItem>
            <MenuItem value={1}>1 Yıldız</MenuItem>
            <MenuItem value={2}>2 Yıldız</MenuItem>
            <MenuItem value={3}>3 Yıldız</MenuItem>
            <MenuItem value={4}>4 Yıldız</MenuItem>
            <MenuItem value={5}>5 Yıldız</MenuItem>
          </Select>
        </FormControl>

        {(searchText || ratingFilter !== "") && (
          <Button
            variant="outlined"
            onClick={handleClearFilters}
            startIcon={<ClearIcon />}
          >
            Temizle
          </Button>
        )}
      </Box>

      {/* İstatistik Kartları */}
      <Box display="flex" gap={2} mb={3}>
        <Card
          sx={{
            flex: 1,
            background: "linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)",
            color: "white",
          }}
        >
          <CardContent>
            <Typography variant="h6">Toplam Yorum</Typography>
            <Typography variant="h4" fontWeight="bold">
              {filteredComments.length}
            </Typography>
          </CardContent>
        </Card>
        <Card
          sx={{
            flex: 1,
            background: "linear-gradient(135deg, #4caf50 0%, #8bc34a 100%)",
            color: "white",
          }}
        >
          <CardContent>
            <Typography variant="h6">Ortalama Puan</Typography>
            <Typography variant="h4" fontWeight="bold">
              {filteredComments.length > 0
                ? (
                    filteredComments.reduce((sum, c) => sum + c.rate, 0) /
                    filteredComments.length
                  ).toFixed(1)
                : "0.0"}
            </Typography>
          </CardContent>
        </Card>
        <Card
          sx={{
            flex: 1,
            background: "linear-gradient(135deg, #ff9800 0%, #f57c00 100%)",
            color: "white",
          }}
        >
          <CardContent>
            <Typography variant="h6">Yüksek Puanlı</Typography>
            <Typography variant="h4" fontWeight="bold">
              {filteredComments.filter((c) => c.rate >= 4).length}
            </Typography>
          </CardContent>
        </Card>
        <Card
          sx={{
            flex: 1,
            background: "linear-gradient(135deg, #f44336 0%, #d32f2f 100%)",
            color: "white",
          }}
        >
          <CardContent>
            <Typography variant="h6">Düşük Puanlı</Typography>
            <Typography variant="h4" fontWeight="bold">
              {filteredComments.filter((c) => c.rate <= 2).length}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell>Kullanıcı</TableCell>
              <TableCell>Kitap ID</TableCell>
              <TableCell>Yorum</TableCell>
              <TableCell>Puan</TableCell>
              <TableCell>Tarih</TableCell>
              <TableCell align="center">İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredComments
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((comment) => (
                <TableRow key={comment.id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar
                        sx={{ bgcolor: "primary.main", width: 32, height: 32 }}
                      >
                        <PersonIcon sx={{ fontSize: 18 }} />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {comment.username || `User ${comment.user_id}`}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: {comment.user_id}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <BookIcon color="action" sx={{ fontSize: 18 }} />
                      <Typography variant="body2">{comment.book_id}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ maxWidth: 300 }}>
                    <Typography variant="body2">
                      {truncateText(comment.comment)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Rating value={comment.rate} readOnly size="small" />
                      <Chip
                        label={comment.rate}
                        color={getRatingColor(comment.rate)}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(comment.created_at)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => handleViewComment(comment)}
                      title="Görüntüle"
                      size="small"
                    >
                      <ViewIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(comment.id)}
                      title="Sil"
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredComments.length}
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

      {/* Yorum Görüntüleme Dialog'u */}
      <Dialog
        open={viewDialog}
        onClose={() => setViewDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={2}>
            <PersonIcon />
            Yorum Detayı
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedComment && (
            <Box display="flex" flexDirection="column" gap={3}>
              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Kullanıcı Bilgileri
                </Typography>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar sx={{ bgcolor: "primary.main" }}>
                    <PersonIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="body1" fontWeight="bold">
                      {selectedComment.username ||
                        `User ${selectedComment.user_id}`}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Kullanıcı ID: {selectedComment.user_id}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Kitap Bilgileri
                </Typography>
                <Box display="flex" alignItems="center" gap={2}>
                  <BookIcon color="action" />
                  <Box>
                    <Typography variant="body1">
                      Kitap ID: {selectedComment.book_id}
                    </Typography>
                    {selectedComment.book_title && (
                      <Typography variant="body2" color="text.secondary">
                        {selectedComment.book_title}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Box>

              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Değerlendirme
                </Typography>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Rating value={selectedComment.rate} readOnly />
                  <Chip
                    label={`${selectedComment.rate}/5`}
                    color={getRatingColor(selectedComment.rate)}
                    variant="outlined"
                  />
                </Box>
              </Box>

              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Yorum
                </Typography>
                <Paper
                  sx={{ p: 2, backgroundColor: "#f8f9fa", borderRadius: 2 }}
                >
                  <Typography variant="body1">
                    {selectedComment.comment}
                  </Typography>
                </Paper>
              </Box>

              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Tarih
                </Typography>
                <Typography variant="body2">
                  {formatDate(selectedComment.created_at)}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setViewDialog(false)} color="inherit">
            Kapat
          </Button>
          {selectedComment && (
            <Button
              onClick={() => {
                setViewDialog(false);
                handleDelete(selectedComment.id);
              }}
              color="error"
              variant="outlined"
            >
              Yorumu Sil
            </Button>
          )}
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

export default CommentManagement;
