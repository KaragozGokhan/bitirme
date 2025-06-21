import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, TextField, Button, Stack, Alert, Avatar, CircularProgress, IconButton } from "@mui/material";
import { Comment } from "../../infrastructure/types";
import { commentService } from "../../infrastructure/services/api";
import DeleteIcon from '@mui/icons-material/Delete';

interface CommentSectionProps {
  bookId: number;
  currentUserId?: number;
  currentUsername?: string;
  isAdmin?: boolean;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ bookId, currentUserId, currentUsername, isAdmin }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const fetchComments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await commentService.getCommentsByBook(bookId);
      setComments(data);
    } catch (err: any) {
      setError("Yorumlar yüklenemedi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line
  }, [bookId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    try {
      await commentService.addComment(bookId, comment);
      setComment("");
      fetchComments();
    } catch (err: any) {
      setSubmitError("Yorum eklenemedi.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Yorumu silmek istediğinize emin misiniz?")) return;
    try {
      await commentService.deleteComment(id);
      fetchComments();
    } catch (err) {
      alert("Yorum silinemedi.");
    }
  };

  return (
    <Box sx={{ mt: 6 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Yorumlar
      </Typography>
      <Paper sx={{ p: 2, mb: 3 }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Yorumunuz"
              multiline
              minRows={2}
              value={comment}
              onChange={e => setComment(e.target.value)}
              fullWidth
              required
              disabled={submitting}
            />
            <Button type="submit" variant="contained" disabled={submitting || comment.trim().length < 2}>
              {submitting ? "Yorum Ekleniyor..." : "Yorum Ekle"}
            </Button>
            {submitError && <Alert severity="error">{submitError}</Alert>}
          </Stack>
        </form>
      </Paper>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={100}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : comments.length === 0 ? (
        <Alert severity="info">Henüz yorum yok. İlk yorumu siz ekleyin!</Alert>
      ) : (
        <Stack spacing={2}>
          {comments.map((c) => (
            <Paper key={c.id} sx={{ p: 2, display: 'flex', alignItems: 'flex-start' }}>
              <Avatar sx={{ mr: 2 }}>{c.username ? c.username.charAt(0).toUpperCase() : '?'}</Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" fontWeight="bold">
                  {c.username || "Kullanıcı"}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {c.comment}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(c.created_at).toLocaleString('tr-TR')}
                </Typography>
              </Box>
              {(currentUserId === c.user_id || isAdmin) && (
                <IconButton onClick={() => handleDelete(c.id)} size="small" sx={{ ml: 1 }}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              )}
            </Paper>
          ))}
        </Stack>
      )}
    </Box>
  );
}; 