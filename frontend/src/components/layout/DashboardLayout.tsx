import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useTheme,
  Collapse,
  Badge,
  Slider,
  Stack,
  Avatar,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Book as BookIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Category as CategoryIcon,
  ExpandLess,
  ExpandMore,
  LocalLibrary as MyBooksIcon,
  ShoppingCart as ShoppingCartIcon,
  PlayArrow,
  Pause,
  VolumeDown,
  VolumeUp,
  FastForward,
  FastRewind,
  Close,
} from "@mui/icons-material";
import { authService } from "../../infrastructure/services/api";
import { useCart } from "../../infrastructure/contexts/CartContext";
import { useAudioPlayer } from "../../infrastructure/contexts/AudioPlayerContext";
import YouTube from "react-youtube";

const drawerWidth = 280;

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const MiniPlayer = () => {
  const {
    currentTrack,
    isPlaying,
    volume,
    playerRef,
    togglePlayPause,
    changeVolume,
    seek,
    progress,
    duration,
    setProgress,
    setDuration,
    isReady,
    closePlayer,
  } = useAudioPlayer();

  const handleVolumeChange = (event: Event, newValue: number | number[]) => {
    changeVolume(newValue as number);
  };

  const formatTime = (time: number) => {
    if (isNaN(time) || time < 0) {
      return "0:00";
    }

    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");

    if (hours > 0) {
      const paddedMinutes = minutes.toString().padStart(2, "0");
      return `${hours}:${paddedMinutes}:${seconds}`;
    }

    return `${minutes}:${seconds}`;
  };

  useEffect(() => {
    if (!isReady) return;
    const interval = setInterval(() => {
      if (playerRef.current && isPlaying) {
        const currentTime = playerRef.current.getCurrentTime();
        const videoDuration = playerRef.current.getDuration();
        setProgress(currentTime);
        if (duration !== videoDuration) {
          setDuration(videoDuration);
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, isReady, playerRef, setProgress, setDuration, duration]);

  if (!currentTrack) return null;

  return (
    <Box
      sx={{
        p: 2,
        borderTop: "1px solid",
        borderColor: "divider",
        position: "relative",
      }}
    >
      <IconButton
        size="small"
        onClick={closePlayer}
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          zIndex: 1,
          color: "text.secondary",
          "&:hover": {
            color: "text.primary",
            backgroundColor: "action.hover",
          },
        }}
      >
        <Close fontSize="small" />
      </IconButton>
      <Stack direction="column" spacing={1} alignItems="center" sx={{ mb: 2 }}>
        <Avatar
          src={
            currentTrack.cover_image_url &&
            currentTrack.cover_image_url.startsWith("kitaplar/")
              ? `/${currentTrack.cover_image_url}`
              : currentTrack.cover_image_url ||
                "https://via.placeholder.com/120x120"
          }
          variant="rounded"
          sx={{ width: 120, height: 120, mb: 1 }}
        />
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="subtitle2" noWrap sx={{ fontWeight: "bold" }}>
            {currentTrack.title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {currentTrack.author}
          </Typography>
        </Box>
      </Stack>
      <Box sx={{ width: "100%", mt: 1 }}>
        <Slider
          size="small"
          value={progress}
          max={duration}
          onChange={(e, val) => playerRef.current?.seekTo(val as number, true)}
          sx={{ p: 0 }}
        />
        <Stack direction="row" justifyContent="space-between" sx={{ mt: -1 }}>
          <Typography variant="caption">{formatTime(progress)}</Typography>
          <Typography variant="caption">
            -{formatTime(duration - progress)}
          </Typography>
        </Stack>
      </Box>
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        justifyContent="center"
        sx={{ mt: 1 }}
      >
        <IconButton size="small" onClick={() => seek(-15)}>
          <FastRewind />
        </IconButton>
        <IconButton onClick={togglePlayPause}>
          {isPlaying ? <Pause /> : <PlayArrow />}
        </IconButton>
        <IconButton size="small" onClick={() => seek(15)}>
          <FastForward />
        </IconButton>
      </Stack>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1 }}>
        <VolumeDown />
        <Slider
          aria-label="Volume"
          value={volume * 100}
          onChange={handleVolumeChange}
        />
        <VolumeUp />
      </Stack>
    </Box>
  );
};

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems } = useCart();
  const { currentTrack, playerRef, setIsPlaying, setIsReady, playTrack } =
    useAudioPlayer();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    authService.logout();
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const handleCategoriesClick = () => {
    setCategoriesOpen(!categoriesOpen);
  };

  const categories = [
    { id: 1, name: "Roman" },
    { id: 2, name: "Bilim Kurgu" },
    { id: 3, name: "Klasik" },
    { id: 4, name: "Çocuk" },
    { id: 5, name: "Felsefe" },
    { id: 6, name: "Tarih" },
    { id: 7, name: "Biyografi" },
    { id: 8, name: "Kişisel Gelişim" },
    { id: 9, name: "Polisiye" },
    { id: 10, name: "Fantastik" },
    { id: 11, name: "Psikoloji" },
    { id: 12, name: "Edebiyat" },
    { id: 13, name: "Macera" },
    { id: 14, name: "Dram" },
    { id: 15, name: "Şiir" },
  ];

  const menuItems = [
    { text: "Profil", icon: <PersonIcon />, path: "/profile" },
    { text: "Kitaplarım", icon: <MyBooksIcon />, path: "/my-books" },
    { text: "Kitaplar", icon: <BookIcon />, path: "/" },
  ];

  const drawer = (
    <div>
      <Toolbar sx={{ px: 3, py: 2 }}>
        <Typography
          variant="h4"
          noWrap
          component="div"
          fontWeight={700}
          color="primary"
          sx={{ 
            cursor: 'pointer',
            fontFamily: 'Graphique, sans-serif',
            '&:hover': {
              opacity: 0.8,
            }
          }}
          onClick={() => navigate('/')}
        >
          BOOKFLIX
        </Typography>
      </Toolbar>
      <Divider sx={{ mx: 2 }} />
      <List sx={{ px: 2, py: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => {
                navigate(item.path);
              }}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                "&.Mui-selected": {
                  backgroundColor: "primary.main",
                  color: "primary.contrastText",
                  "&:hover": {
                    backgroundColor: "primary.dark",
                  },
                  "& .MuiListItemIcon-root": {
                    color: "primary.contrastText",
                  },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: "0.875rem",
                  fontWeight: 600,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleCategoriesClick}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              "&:hover": {
                backgroundColor: "action.hover",
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <CategoryIcon />
            </ListItemIcon>
            <ListItemText
              primary="Kategoriler"
              primaryTypographyProps={{
                fontSize: "0.875rem",
                fontWeight: 600,
              }}
            />
            {categoriesOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        <Collapse in={categoriesOpen} timeout="auto" unmountOnExit>
          <List component="div" sx={{ pl: 2 }}>
            {categories.map((category) => (
              <ListItemButton
                key={category.id}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  pl: 4,
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
                onClick={() => {
                  navigate(`/category/${category.id}`);
                }}
              >
                <ListItemText
                  primary={category.name}
                  primaryTypographyProps={{
                    fontSize: "0.875rem",
                    fontWeight: 500,
                  }}
                />
              </ListItemButton>
            ))}
          </List>
        </Collapse>
      </List>
      <Divider sx={{ mx: 2 }} />
      <List sx={{ px: 2, py: 1 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 2,
              color: "error.main",
              "&:hover": {
                backgroundColor: "error.lighter",
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: "error.main" }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText
              primary="Çıkış Yap"
              primaryTypographyProps={{
                fontSize: "0.875rem",
                fontWeight: 600,
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <MiniPlayer />
    </div>
  );

  const getYouTubeVideoId = (url: string) => {
    try {
      return new URL(url).searchParams.get("v");
    } catch (e) {
      // Handle cases where the URL is not standard, e.g., youtu.be links
      const match = url.match(
        /(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#&?]*).*/
      );
      return match && match[1].length === 11 ? match[1] : null;
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <CssBaseline />
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography 
            variant="h5" 
            noWrap 
            component="div" 
            fontWeight={600}
            sx={{ 
              cursor: 'pointer',
              fontFamily: 'Graphique, sans-serif',
              '&:hover': {
                opacity: 0.8,
              }
            }}
            onClick={() => navigate('/')}
          >
            {menuItems.find((item) => item.path === location.pathname)?.text ||
              "BOOKFLIX"}
          </Typography>
          <Box>
            <IconButton color="inherit" onClick={() => navigate("/cart")}>
              <Badge badgeContent={cartItems.length} color="secondary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              borderRight: "none",
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              borderRight: "none",
              bgcolor: "background.paper",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: "100vh",
          bgcolor: "background.default",
        }}
      >
        <Toolbar />
        {children}
      </Box>
      {currentTrack && currentTrack.audio_url && (
        <YouTube
          videoId={getYouTubeVideoId(currentTrack.audio_url)}
          opts={{ height: "0", width: "0", playerVars: { autoplay: 1 } }}
          onReady={(event: any) => {
            playerRef.current = event.target;
            setIsReady(true);
          }}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnd={() => {
            setIsPlaying(false);
            setIsReady(false);
          }}
          onError={() => {
            setIsPlaying(false);
            setIsReady(false);
          }}
          style={{ display: "none" }}
        />
      )}
    </Box>
  );
};
