import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Stack,
  Divider,
} from '@mui/material';
import {
  CreditCard,
  Lock,
  Security,
  Star,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { userService } from '../infrastructure/services/api';

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
  price: number;
  planName: string;
}

interface PaymentForm {
  cardNumber: string;
  cardHolder: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
}

// Kart numarasını maskeleme fonksiyonu
const maskCardNumber = (cardNumber: string): string => {
  const cleaned = cardNumber.replace(/\s/g, '');
  const masked = cleaned.replace(/\d(?=\d{4})/g, '*');
  return masked.replace(/(.{4})/g, '$1 ').trim();
};

export const PaymentModal: React.FC<PaymentModalProps> = ({
  open,
  onClose,
  onPaymentSuccess,
  price,
  planName,
}) => {
  const [formData, setFormData] = useState<PaymentForm>({
    cardNumber: '',
    cardHolder: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<PaymentForm>>({});

  // Kart tipini belirle
  const cardType = formData.cardNumber.startsWith('4') ? 'visa' : 
                   formData.cardNumber.startsWith('5') ? 'mastercard' : 'default';

  const maskedCardNumber = maskCardNumber(formData.cardNumber);
  const displayCardNumber = formData.cardNumber ? maskedCardNumber : '**** **** **** ****';
  const displayCardHolder = formData.cardHolder || 'KART SAHİBİ';
  const displayExpiry = formData.expiryMonth && formData.expiryYear 
    ? `${formData.expiryMonth}/${formData.expiryYear}` 
    : 'MM/YY';

  const validateForm = (): boolean => {
    const newErrors: Partial<PaymentForm> = {};

    // Kart numarası kontrolü (16 haneli)
    if (!formData.cardNumber || formData.cardNumber.length !== 16) {
      newErrors.cardNumber = 'Geçerli bir kart numarası giriniz (16 haneli)';
    }

    // Kart sahibi kontrolü
    if (!formData.cardHolder || formData.cardHolder.length < 3) {
      newErrors.cardHolder = 'Kart sahibi adını giriniz';
    }

    // Son kullanma tarihi kontrolü
    if (!formData.expiryMonth || !formData.expiryYear) {
      newErrors.expiryMonth = 'Son kullanma tarihini giriniz';
    } else {
      const month = parseInt(formData.expiryMonth);
      const year = parseInt(formData.expiryYear);
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100;
      const currentMonth = currentDate.getMonth() + 1;

      if (month < 1 || month > 12) {
        newErrors.expiryMonth = 'Geçerli bir ay giriniz (01-12)';
      } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
        newErrors.expiryMonth = 'Kartın son kullanma tarihi geçmiş';
      }
    }

    // CVV kontrolü (3-4 haneli)
    if (!formData.cvv || formData.cvv.length < 3 || formData.cvv.length > 4) {
      newErrors.cvv = 'Geçerli bir CVV giriniz (3-4 haneli)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof PaymentForm, value: string) => {
    let formattedValue = value;

    // Kart numarası için sadece rakam
    if (field === 'cardNumber') {
      formattedValue = value.replace(/\D/g, '').slice(0, 16);
    }

    // CVV için sadece rakam
    if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }

    // Ay için sadece rakam ve 01-12 arası
    if (field === 'expiryMonth') {
      formattedValue = value.replace(/\D/g, '').slice(0, 2);
      if (formattedValue && parseInt(formattedValue) > 12) {
        formattedValue = '12';
      }
    }

    // Yıl için sadece rakam
    if (field === 'expiryYear') {
      formattedValue = value.replace(/\D/g, '').slice(0, 2);
    }

    setFormData(prev => ({
      ...prev,
      [field]: formattedValue,
    }));

    // Hata mesajını temizle
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handlePayment = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Kullanıcı ID'sini localStorage'dan al
      const userId = localStorage.getItem('userId');
      if (!userId) {
        toast.error('Kullanıcı bilgisi bulunamadı. Lütfen tekrar giriş yapın.');
        return;
      }

      // API'ye ödeme isteği gönder
      const paymentData = {
        cardNumber: formData.cardNumber,
        cardHolder: formData.cardHolder,
        expiryMonth: formData.expiryMonth,
        expiryYear: formData.expiryYear,
        cvv: formData.cvv,
        amount: price,
      };

      const result = await userService.processPayment(parseInt(userId, 10), paymentData);
      
      if (result.success) {
        toast.success('Ödeme başarılı!');
        onPaymentSuccess();
        onClose();
      } else {
        toast.error('Ödeme işlemi başarısız oldu.');
      }
    } catch (error: any) {
      console.error('Ödeme hatası:', error);
      const errorMessage = error.response?.data?.error || 'Ödeme işlemi başarısız oldu. Lütfen tekrar deneyiniz.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (value: string): string => {
    return value.replace(/(\d{4})/g, '$1 ').trim();
  };

  // Kart görüntüsü component'i
  const CreditCardDisplay = () => (
    <Card
      sx={{
        width: 320,
        height: 180,
        maxWidth: '100%',
        background: cardType === 'visa' 
          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          : cardType === 'mastercard'
          ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
          : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        borderRadius: 3,
        position: 'relative',
        overflow: 'hidden',
        mb: 3,
        boxShadow: 3,
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 6,
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: -50,
          right: -50,
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: -30,
          left: -30,
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)',
        },
      }}
    >
      {/* Kart chip */}
      <Box
        sx={{
          position: 'absolute',
          top: 20,
          left: 20,
          width: 45,
          height: 35,
          bgcolor: 'rgba(255,255,255,0.15)',
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid rgba(255,255,255,0.3)',
        }}
      >
        <Box
          sx={{
            width: 35,
            height: 25,
            bgcolor: 'rgba(255,255,255,0.2)',
            borderRadius: 0.5,
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 2,
              left: 2,
              width: 8,
              height: 8,
              bgcolor: 'rgba(255,255,255,0.4)',
              borderRadius: '50%',
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 2,
              right: 2,
              width: 6,
              height: 6,
              bgcolor: 'rgba(255,255,255,0.3)',
              borderRadius: '50%',
            },
          }}
        />
      </Box>

      {/* Kart tipi logosu */}
      <Box
        sx={{
          position: 'absolute',
          top: 20,
          right: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        {cardType === 'visa' && (
          <Box
            sx={{
              width: 60,
              height: 20,
              bgcolor: 'white',
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: '#1a1f71',
                fontWeight: 'bold',
                fontFamily: 'monospace',
                fontSize: '0.7rem',
              }}
            >
              VISA
            </Typography>
          </Box>
        )}
        {cardType === 'mastercard' && (
          <Box
            sx={{
              width: 60,
              height: 20,
              bgcolor: 'white',
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: '#eb001b',
                fontWeight: 'bold',
                fontFamily: 'monospace',
                fontSize: '0.6rem',
              }}
            >
              MASTERCARD
            </Typography>
          </Box>
        )}
        {cardType === 'default' && (
          <Box
            sx={{
              width: 60,
              height: 20,
              bgcolor: 'rgba(255,255,255,0.2)',
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: 'white',
                fontWeight: 'bold',
                fontFamily: 'monospace',
                fontSize: '0.7rem',
              }}
            >
              CARD
            </Typography>
          </Box>
        )}
      </Box>

      {/* Kart numarası */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 80,
          left: 20,
          right: 20,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            color: 'white',
            fontFamily: 'monospace',
            letterSpacing: 2,
            textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
            fontWeight: 'bold',
          }}
        >
          {displayCardNumber}
        </Typography>
      </Box>

      {/* Kart sahibi */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 45,
          left: 20,
        }}
      >
        {formData.cardHolder && (
          <Typography
            variant="body1"
            sx={{
              color: 'white',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: 1,
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
            }}
          >
            {formData.cardHolder}
          </Typography>
        )}
      </Box>

      {/* Son kullanma tarihi */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 45,
          right: 20,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: 'white',
            opacity: 0.8,
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: 1,
          }}
        >
          Son Kullanma
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: 'white',
            fontWeight: 'bold',
            letterSpacing: 1,
            textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
          }}
        >
          {displayExpiry}
        </Typography>
      </Box>

      {/* Dekoratif çizgiler */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: 'rgba(255,255,255,0.3)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: 4,
          left: 0,
          right: 0,
          height: 1,
          background: 'rgba(255,255,255,0.2)',
        }}
      />
    </Card>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Star sx={{ color: 'primary.main' }} />
          <Typography variant="h6" fontWeight={600}>
            Premium Üyelik Satın Al
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3}>
          {/* Plan Bilgileri */}
          <Card sx={{ bgcolor: 'primary.lighter' }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                {planName}
              </Typography>
              <Typography variant="h4" color="primary" fontWeight={700}>
                ₺{price.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Aylık ücret
              </Typography>
            </CardContent>
          </Card>

          {/* Premium Özellikleri */}
          <Box>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Premium Özellikleri:
            </Typography>
            <Stack spacing={1}>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                ✓ Kitap dinleme özelliği
              </Typography>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                ✓ Sınırsız kitap kiralama
              </Typography>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                ✓ Özel içerikler
              </Typography>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                ✓ Reklamsız deneyim
              </Typography>
            </Stack>
          </Box>

          <Divider />

          {/* Kredi Kartı Formu */}
          <Box>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Kredi Kartı Bilgileri
            </Typography>

            {/* Kart Görüntüsü */}
            <CreditCardDisplay />

            {/* Kart Tipi Bilgisi */}
            {cardType !== 'default' && (
              <Box sx={{ mb: 2 }}>
                <Alert 
                  severity="info" 
                  sx={{ 
                    py: 0.5,
                    '& .MuiAlert-icon': { alignItems: 'center' },
                  }}
                >
                  <Typography variant="body2">
                    {cardType === 'visa' ? 'Visa kartı tespit edildi' : 'Mastercard tespit edildi'}
                  </Typography>
                </Alert>
              </Box>
            )}

            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Kart Numarası"
                value={formatCardNumber(formData.cardNumber)}
                onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                error={!!errors.cardNumber}
                helperText={errors.cardNumber}
                placeholder="1234 5678 9012 3456"
                InputProps={{
                  startAdornment: <CreditCard sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused': {
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: cardType === 'visa' ? '#1a1f71' : 
                                    cardType === 'mastercard' ? '#eb001b' : 'primary.main',
                      },
                    },
                  },
                }}
              />

              <TextField
                fullWidth
                label="Kart Sahibi"
                value={formData.cardHolder}
                onChange={(e) => handleInputChange('cardHolder', e.target.value)}
                error={!!errors.cardHolder}
                helperText={errors.cardHolder}
                placeholder="Ad Soyad"
              />

              <Stack direction="row" spacing={2}>
                <TextField
                  fullWidth
                  label="Ay"
                  value={formData.expiryMonth}
                  onChange={(e) => handleInputChange('expiryMonth', e.target.value)}
                  error={!!errors.expiryMonth}
                  helperText={errors.expiryMonth}
                  placeholder="MM"
                />

                <TextField
                  fullWidth
                  label="Yıl"
                  value={formData.expiryYear}
                  onChange={(e) => handleInputChange('expiryYear', e.target.value)}
                  error={!!errors.expiryYear}
                  helperText={errors.expiryYear}
                  placeholder="YY"
                />
              </Stack>

              <TextField
                fullWidth
                label="CVV"
                value={formData.cvv}
                onChange={(e) => handleInputChange('cvv', e.target.value)}
                error={!!errors.cvv}
                helperText={errors.cvv}
                placeholder="123"
                InputProps={{
                  startAdornment: <Security sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Stack>
          </Box>

          {/* Güvenlik Uyarısı */}
          <Alert severity="info" icon={<Lock />}>
            <Typography variant="body2">
              Kredi kartı bilgileriniz güvenli bir şekilde şifrelenerek işlenmektedir.
            </Typography>
          </Alert>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          disabled={loading}
          sx={{ minWidth: 100 }}
        >
          Vazgeç
        </Button>
        <Button
          onClick={handlePayment}
          variant="contained"
          disabled={loading}
          sx={{ minWidth: 120 }}
          startIcon={loading ? <CircularProgress size={20} /> : undefined}
        >
          {loading ? 'İşleniyor...' : 'Ödeme Yap'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 