import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
  Stack,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Fade,
  IconButton,
  Avatar,
  Tooltip,
} from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import CloseIcon from "@mui/icons-material/Close";
import PaymentIcon from "@mui/icons-material/Payment";

// Banka ve kart tiplerini tespit et
const bankData: { [key: string]: { name: string; logo: string } } = {
  "0001": {
    name: "İş Bankası",
    logo: "/bank-logos/isbankasi.svg",
  },
  "0002": {
    name: "Garanti BBVA",
    logo: "/bank-logos/garanti-bbva.svg",
  },
  "0003": {
    name: "Yapı Kredi",
    logo: "/bank-logos/yapi-kredi.svg",
  },
  "0004": {
    name: "Akbank",
    logo: "/bank-logos/akbank.svg",
  },
  "0005": {
    name: "Ziraat Bankası",
    logo: "/bank-logos/ziraat-bankasi.svg",
  },
};

const cardTypePatterns: {
  [key: string]: {
    name: string;
    regex: RegExp;
    icon: JSX.Element;
  };
} = {
  Visa: {
    name: "Visa",
    regex: /^4/,
    icon: (
      <img
        src="/bank-logos/visa.png"
        alt="Visa"
        style={{ height: 28, marginRight: 6, borderRadius: 3, background: "#fff", padding: 2 }}
        loading="lazy"
      />
    ),
  },
  MasterCard: {
    name: "MasterCard",
    regex: /^5[1-5]/,
    icon: (
      <img
        src="/bank-logos/mastercard.png"
        alt="MasterCard"
        style={{ height: 28, marginRight: 6, borderRadius: 3, background: "#fff", padding: 2 }}
        loading="lazy"
      />
    ),
  },
  Troy: {
    name: "Troy",
    regex: /^9792/,
    icon: (
      <img
        src="/bank-logos/troy.png"
        alt="Troy"
        style={{ height: 28, marginRight: 6, borderRadius: 3, background: "#fff", padding: 2 }}
        loading="lazy"
      />
    ),
  },
};

const getCardType = (number: string) => {
  const clean = number.replace(/\s/g, "");
  if (clean.length < 4) return "Bilinmiyor";
  const first4 = clean.slice(0, 4);
  for (const key in cardTypePatterns) {
    if (cardTypePatterns[key].regex.test(first4)) {
      return key;
    }
  }
  return "Bilinmiyor";
};

const cardTypeIcon = (type: string) => {
  if (cardTypePatterns[type]) {
    return cardTypePatterns[type].icon;
  }
  return <CreditCardIcon color="disabled" sx={{ fontSize: 28, mr: 1 }} />;
};

const getBankInfo = (number: string) => {
  const clean = number.replace(/\s/g, "");
  if (clean.length < 8) return undefined;
  const second4 = clean.slice(4, 8);
  return bankData[second4];
};

export const PremiumPaymentForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const cardType = getCardType(cardNumber);
  const bankInfo = getBankInfo(cardNumber);

  const formatCardNumber = (value: string) => {
    return value
      .replace(/[^\d]/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedCardNumber = cardNumber.replace(/\s/g, "");
    if (!/^\d{16}$/.test(cleanedCardNumber)) {
      setError("Geçerli bir kart numarası girin (16 hane)");
      return;
    }
    // Kart tipi ve banka kontrolü
    if (getCardType(cleanedCardNumber) === "Bilinmiyor" || !getBankInfo(cleanedCardNumber)) {
      setError("Geçerli bir kart girin");
      return;
    }
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      setError("SKT MM/YY formatında olmalı");
      return;
    }
    if (!/^\d{3,4}$/.test(cvc)) {
      setError("CVC 3 veya 4 haneli olmalı");
      return;
    }
    if (!name.trim()) {
      setError("Kart üzerindeki isim gerekli");
      return;
    }
    setError("");
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1800);
  };

  return (
    <Fade in>
      <Card
        sx={{
          maxWidth: 440,
          mx: "auto",
          mt: 6,
          boxShadow: 12,
          borderRadius: 5,
          background: "linear-gradient(135deg, #f8fafc 60%, #e0e7ff 100%)",
          position: "relative",
          overflow: "visible",
        }}
      >
        <CardHeader
          avatar={<PaymentIcon color="primary" sx={{ fontSize: 36 }} />}
          title={
            <Typography variant="h5" fontWeight={700} color="primary.main">
              Premium Üyelik Ödeme
            </Typography>
          }
          action={
            <IconButton onClick={onClose} aria-label="Kapat">
              <CloseIcon />
            </IconButton>
          }
          sx={{ pb: 0 }}
        />
        <Divider sx={{ mb: 2 }} />
        <CardContent>
          {/* Kart görseli */}
          <Box
            sx={{
              mb: 3,
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                width: 340,
                height: 200,
                borderRadius: 5,
                background: "linear-gradient(120deg, #6366f1 60%, #818cf8 100%)",
                boxShadow: 6,
                color: "#fff",
                p: 3,
                position: "relative",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "box-shadow 0.2s",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                {cardTypeIcon(cardType)}
                {bankInfo ? (
                  <Tooltip title={bankInfo.name}>
                    <img
                      src={bankInfo.logo}
                      alt={bankInfo.name}
                      style={{
                        height: 28,
                        marginLeft: 6,
                        background: "#fff",
                        borderRadius: 3,
                        padding: 2,
                        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                        objectFit: "contain",
                        maxWidth: 80,
                      }}
                      loading="lazy"
                    />
                  </Tooltip>
                ) : (
                  <CreditCardIcon color="action" sx={{ fontSize: 28, ml: 1 }} />
                )}
              </Box>
              <Typography
                variant="h6"
                sx={{
                  letterSpacing: 2,
                  fontWeight: 600,
                  fontSize: 22,
                  mb: 1,
                  mt: 2,
                  textShadow: "0 2px 8px #0002",
                  fontFamily: "monospace",
                  userSelect: "none",
                }}
              >
                {cardNumber
                  ? formatCardNumber(cardNumber).padEnd(19, "•")
                  : "•••• •••• •••• ••••"}
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography
                    variant="caption"
                    sx={{ opacity: 0.8, fontWeight: 500, fontSize: 13 }}
                  >
                    SKT
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      fontSize: 16,
                      letterSpacing: 1,
                      ml: 0.5,
                      color: "#fff",
                    }}
                  >
                    {expiry || "MM/YY"}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="caption"
                    sx={{ opacity: 0.8, fontWeight: 500, fontSize: 13 }}
                  >
                    Kart Sahibi
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      fontSize: 16,
                      letterSpacing: 1,
                      ml: 0.5,
                      color: "#fff",
                    }}
                  >
                    {name || "AD SOYAD"}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
          <form onSubmit={handleSubmit} autoComplete="off">
            <Stack spacing={2}>
              <TextField
                label="Kart Numarası"
                value={formatCardNumber(cardNumber)}
                onChange={e => setCardNumber(e.target.value.replace(/[^\d]/g, "").slice(0, 16))}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        {cardTypeIcon(cardType)}
                        {bankInfo && (
                          <Tooltip title={bankInfo.name}>
                            <img
                              src={bankInfo.logo}
                              alt={bankInfo.name}
                              style={{
                                height: 24,
                                marginLeft: 4,
                                background: "#fff",
                                borderRadius: 3,
                                padding: 2,
                                boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                                objectFit: "contain",
                                maxWidth: 60,
                              }}
                              loading="lazy"
                            />
                          </Tooltip>
                        )}
                      </Box>
                    </InputAdornment>
                  ),
                  inputMode: "numeric",
                }}
                placeholder="•••• •••• •••• ••••"
                fullWidth
                required
                variant="outlined"
                sx={{
                  background: "#fff",
                  borderRadius: 2,
                  fontWeight: 600,
                  fontSize: 18,
                  letterSpacing: 2,
                }}
              />
              <Stack direction="row" spacing={2}>
                <TextField
                  label="SKT (MM/YY)"
                  value={expiry}
                  onChange={e => {
                    let val = e.target.value.replace(/[^\d]/g, "");
                    if (val.length > 2) val = val.slice(0, 2) + "/" + val.slice(2, 4);
                    setExpiry(val.slice(0, 5));
                  }}
                  placeholder="12/25"
                  fullWidth
                  required
                  variant="outlined"
                  sx={{
                    background: "#fff",
                    borderRadius: 2,
                  }}
                />
                <TextField
                  label="CVC"
                  value={cvc}
                  onChange={e => setCvc(e.target.value.replace(/[^\d]/g, "").slice(0, 4))}
                  placeholder="123"
                  fullWidth
                  required
                  variant="outlined"
                  sx={{
                    background: "#fff",
                    borderRadius: 2,
                  }}
                />
              </Stack>
              <TextField
                label="Kart Üzerindeki İsim"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ad Soyad"
                fullWidth
                required
                variant="outlined"
                sx={{
                  background: "#fff",
                  borderRadius: 2,
                }}
              />
              {error && (
                <Typography color="error" fontWeight={500} sx={{ mt: 1 }}>
                  {error}
                </Typography>
              )}
              {success && (
                <Typography color="success.main" fontWeight={600} sx={{ mt: 1 }}>
                  Ödeme başarılı! Premium üyeliğiniz aktifleşiyor...
                </Typography>
              )}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                sx={{
                  borderRadius: 2,
                  fontWeight: 700,
                  fontSize: 17,
                  boxShadow: 3,
                  py: 1.2,
                  mt: 1,
                  background: "linear-gradient(90deg, #6366f1 60%, #818cf8 100%)",
                }}
                disabled={success}
              >
                Premium Satın Al
              </Button>
              <Button
                onClick={onClose}
                color="secondary"
                fullWidth
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  fontWeight: 600,
                  mt: 0.5,
                }}
                disabled={success}
              >
                Vazgeç
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Fade>
  );
};

export default PremiumPaymentForm;