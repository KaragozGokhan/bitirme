import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Stack,
  Alert,
  TablePagination,
  Avatar,
  CircularProgress,
  Modal,
} from "@mui/material";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";
import InfoIcon from "@mui/icons-material/Info";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from "react-router-dom";
import { useMyBooks } from "../infrastructure/contexts/MyBooksContext";
import { Book } from "../infrastructure/types";
import { useAudioPlayer } from "../infrastructure/contexts/AudioPlayerContext";

export const MyBooks: React.FC = () => {
  const navigate = useNavigate();
  const { myBooks, removeBookFromLibrary } = useMyBooks();
  const { playTrack } = useAudioPlayer();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleViewBook = (bookId: number) => {
    navigate(`/book/${bookId}`);
  };

  const handleReturnBook = (bookId: number) => {
    if (window.confirm("Bu kitabı iade etmek istediğinizden emin misiniz?")) {
      removeBookFromLibrary(bookId);
    }
  };

  const handlePlayAudio = (book: Book) => {
    playTrack(book);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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
            textAlign: "center"
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
    )
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
            Kitaplarım
          </Typography>
          <Chip
            label={`Toplam ${myBooks.length} kitap`}
            color="primary"
            size="small"
          />
        </Stack>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Kitap</TableCell>
                <TableCell>Yazar</TableCell>
                <TableCell>İşlemler</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? myBooks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : myBooks
              ).map((book) => (
                <TableRow key={book.id}>
                  <TableCell 
                    component="th" 
                    scope="row" 
                    onClick={() => handleViewBook(book.id)}
                    sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}
                  >
                     <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar
                          src={book.cover_image_url && book.cover_image_url.startsWith('kitaplar/') ? `/${book.cover_image_url}` : book.cover_image_url || 'https://via.placeholder.com/40x60'}
                          alt={book.title}
                          variant="rounded"
                          sx={{ width: 40, height: 60 }}
                        />
                        <Typography variant="body2" fontWeight="600">
                           {book.title}
                        </Typography>
                      </Stack>
                  </TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>
                    <Tooltip title="Detayları Gör">
                      <IconButton
                        color="primary"
                        onClick={() => handleViewBook(book.id)}
                      >
                        <InfoIcon />
                      </IconButton>
                    </Tooltip>
                    {book.youtube_url && (
                       <Tooltip title="Kitabı Dinle">
                        <IconButton
                          color="secondary"
                          onClick={() => handlePlayAudio(book)}
                        >
                          <PlayArrowIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Kitabı İade Et">
                      <IconButton
                        onClick={() => handleReturnBook(book.id)}
                        sx={{ ml: 1 }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={myBooks.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Sayfa başına kitap:"
        />
      </Paper>
    </Box>
  );
};
