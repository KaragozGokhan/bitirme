import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../infrastructure/services/api';
import { Box, Button, TextField, Typography, Paper, Alert, CircularProgress, IconButton, InputAdornment, Snackbar, Fade } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import BookflixLogo from '../../assets/bookflix_logo.png';

const AdminLogin: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await adminService.login(email, password);
            setSnackbarOpen(true);
            setTimeout(() => {
                navigate('/admin/dashboard');
            }, 1200);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Giriş başarısız!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #ece9f7 0%, #f5f7fa 100%)', position: 'relative' }}>
            <Fade in timeout={800}>
                <Paper elevation={8} sx={{ p: 4, maxWidth: 400, width: '100%', borderRadius: 4, boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)', position: 'relative', overflow: 'visible', transition: 'box-shadow 0.3s', '&:hover': { boxShadow: '0 12px 40px 0 rgba(31,38,135,0.22)' } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                        <img src={BookflixLogo} alt="Bookflix Logo" style={{ width: 70, height: 70, borderRadius: 12, boxShadow: '0 2px 8px #bbb' }} />
                    </Box>
                    <Typography variant="h4" align="center" gutterBottom fontWeight={700} color="primary">
                        Admin Girişi
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                        <TextField
                            label="E-posta"
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            fullWidth
                            required
                            margin="normal"
                            autoFocus
                            variant="outlined"
                        />
                        <TextField
                            label="Şifre"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            fullWidth
                            required
                            margin="normal"
                            variant="outlined"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="şifreyi göster/gizle"
                                            onClick={() => setShowPassword((show) => !show)}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ mt: 3, py: 1.5, fontWeight: 600, fontSize: 16, boxShadow: '0 2px 8px #90caf9', transition: 'box-shadow 0.3s', '&:hover': { boxShadow: '0 4px 16px #42a5f5' } }}
                            disabled={loading}
                            startIcon={loading ? <CircularProgress size={22} color="inherit" /> : null}
                        >
                            {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
                        </Button>
                    </Box>
                    <Typography variant="caption" display="block" align="center" sx={{ mt: 4, color: '#aaa' }}>
                        Powered by Bookflix
                    </Typography>
                </Paper>
            </Fade>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={1200}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                message="Hoş geldin, giriş başarılı!"
            />
        </Box>
    );
};

export default AdminLogin; 