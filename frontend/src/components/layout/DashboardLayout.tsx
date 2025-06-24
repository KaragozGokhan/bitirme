import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
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
  Chip,
  useMediaQuery,
  Button,
  Menu,
  MenuItem,
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
  AccountCircle,
  Settings as SettingsIcon,
  ExitToApp,
  VolumeOff,
} from "@mui/icons-material";
import { authService } from "../../infrastructure/services/api";
import { useCart } from "../../infrastructure/contexts/CartContext";
import { useAudioPlayer } from "../../infrastructure/contexts/AudioPlayerContext";
import { useMyBooks } from "../../infrastructure/contexts/MyBooksContext";
import { useSidebar } from "../../infrastructure/contexts/SidebarContext";
import YouTube from "react-youtube";
import { categories } from "../../infrastructure/constants/categories";
import bookflixLogo from "../../assets/bookflix_logo.png";

const drawerWidth = 280;

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const MiniPlayer = () => {
  const theme = useTheme();
  const {
    currentTrack,
    isPlaying,
    volume,
    isMuted,
    playerRef,
    togglePlayPause,
    changeVolume,
    toggleMute,
    seek,
    progress,
    duration,
    setProgress,
    setDuration,
    isReady,
    closePlayer,
  } = useAudioPlayer();

  const handleVolumeChange = (event: Event, newValue: number | number[]) => {
    const newVolume = newValue as number;

    // Eğer ses kapalıysa ve slider'a tıklandıysa sesi aç
    if (isMuted && newVolume > 0) {
      toggleMute();
    }

    changeVolume(newVolume);
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
        onClick={closePlayer}
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          zIndex: 1,
          width: 36,
          height: 36,
          background: "linear-gradient(135deg, #ff7675 0%, #d63031 100%)",
          color: "white",
          borderRadius: "50%",
          boxShadow: "0 3px 10px 0 rgba(255, 118, 117, 0.4)",
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            background: "linear-gradient(135deg, #e84393 0%, #a29bfe 100%)",
            transform: "scale(1.15) rotate(90deg)",
            boxShadow: "0 5px 15px 0 rgba(255, 118, 117, 0.6)",
          },
          "&:active": {
            transform: "scale(0.95)",
          },
        }}
      >
        <Close sx={{ fontSize: "1.1rem" }} />
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
          value={progress}
          max={duration}
          onChange={(e, val) => playerRef.current?.seekTo(val as number, true)}
          sx={{
            p: 0,
            "& .MuiSlider-thumb": {
              "&:hover": {
                boxShadow: theme.shadows[4],
              },
              "&.Mui-active": {
                boxShadow: theme.shadows[6],
              },
            },
          }}
          aria-label="Audio progress"
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => formatTime(value)}
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
        spacing={1.5}
        alignItems="center"
        justifyContent="center"
        sx={{ mt: 2, mb: 1 }}
      >
        {/* Geri Sar Butonu */}
        <IconButton
          onClick={() => seek(-15)}
          sx={{
            width: 48,
            height: 48,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            borderRadius: "50%",
            boxShadow: "0 4px 15px 0 rgba(102, 126, 234, 0.4)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              background: "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
              transform: "scale(1.1) translateY(-2px)",
              boxShadow: "0 8px 25px 0 rgba(255, 0, 0, 0.6)",
            },
            "&:active": {
              transform: "scale(0.95)",
            },
          }}
        >
          <FastRewind sx={{ fontSize: "1.3rem" }} />
        </IconButton>

        {/* Ana Oynat/Duraklat Butonu */}
        <IconButton
          onClick={togglePlayPause}
          sx={{
            width: 56,
            height: 56,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            borderRadius: "50%",
            boxShadow: "0 4px 15px 0 rgba(102, 126, 234, 0.4)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              background: "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
              transform: "scale(1.1) translateY(-3px)",
              boxShadow: "0 12px 30px 0 rgba(255, 0, 0, 0.6)",
            },
            "&:active": {
              transform: "scale(0.95)",
              boxShadow: "0 4px 15px 0 rgba(102, 126, 234, 0.4)",
            },
          }}
        >
          {isPlaying ? (
            <Pause sx={{ fontSize: "1.8rem" }} />
          ) : (
            <PlayArrow sx={{ fontSize: "1.8rem", ml: 0.2 }} />
          )}
        </IconButton>

        {/* İleri Sar Butonu */}
        <IconButton
          onClick={() => seek(15)}
          sx={{
            width: 48,
            height: 48,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            borderRadius: "50%",
            boxShadow: "0 4px 15px 0 rgba(102, 126, 234, 0.4)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              background: "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
              transform: "scale(1.1) translateY(-2px)",
              boxShadow: "0 8px 25px 0 rgba(255, 0, 0, 0.6)",
            },
            "&:active": {
              transform: "scale(0.95)",
            },
          }}
        >
          <FastForward sx={{ fontSize: "1.3rem" }} />
        </IconButton>
      </Stack>
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        sx={{ mt: 1, px: 1 }}
      >
        <IconButton
          onClick={toggleMute}
          sx={{
            width: 36,
            height: 36,
            background: "linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%)",
            color: "#8b4513",
            borderRadius: "50%",
            boxShadow: "0 3px 10px 0 rgba(255, 234, 167, 0.4)",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              background: "linear-gradient(135deg, #fab1a0 0%, #e17055 100%)",
              color: "white",
              transform: "scale(1.15)",
              boxShadow: "0 5px 15px 0 rgba(255, 234, 167, 0.6)",
            },
          }}
        >
          {isMuted ? (
            <VolumeOff sx={{ fontSize: "1.1rem" }} />
          ) : volume < 0.5 ? (
            <VolumeDown sx={{ fontSize: "1.1rem" }} />
          ) : (
            <VolumeUp sx={{ fontSize: "1.1rem" }} />
          )}
        </IconButton>
        <Slider
          size="small"
          aria-label="Volume"
          value={isMuted ? 0 : volume * 100}
          onChange={handleVolumeChange}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => `${Math.round(value)}%`}
          sx={{
            "& .MuiSlider-thumb": {
              "&:hover": {
                boxShadow: theme.shadows[3],
              },
              "&.Mui-active": {
                boxShadow: theme.shadows[4],
              },
            },
          }}
        />
        <IconButton
          onClick={toggleMute}
          sx={{
            width: 36,
            height: 36,
            background: "linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%)",
            color: "#8b4513",
            borderRadius: "50%",
            boxShadow: "0 3px 10px 0 rgba(255, 234, 167, 0.4)",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              background: "linear-gradient(135deg, #fab1a0 0%, #e17055 100%)",
              color: "white",
              transform: "scale(1.15)",
              boxShadow: "0 5px 15px 0 rgba(255, 234, 167, 0.6)",
            },
          }}
        >
          {isMuted ? (
            <VolumeOff sx={{ fontSize: "1.1rem" }} />
          ) : volume < 0.5 ? (
            <VolumeDown sx={{ fontSize: "1.1rem" }} />
          ) : (
            <VolumeUp sx={{ fontSize: "1.1rem" }} />
          )}
        </IconButton>
      </Stack>
    </Box>
  );
};

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const { sidebarOpen, toggleSidebar } = useSidebar();
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const { cartItems, clearCartOnLogout } = useCart();
  const { currentTrack, playerRef, setIsPlaying, setIsReady, playTrack } =
    useAudioPlayer();
  const { resetMyBooks, resetUser } = useMyBooks();

  const currentCategoryId = params.categoryId
    ? parseInt(params.categoryId)
    : null;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDesktopDrawerToggle = () => {
    toggleSidebar();
  };

  const handleLogout = () => {
    console.log("🔐 Kullanıcı çıkış yapıyor, tüm state temizleniyor...");
    authService.logout();
    localStorage.removeItem("userId");
    resetUser(); // Tam temizlik için resetUser kullan
    clearCartOnLogout(); // Sepeti de temizle
    navigate("/login");
  };

  const handleCategoriesClick = () => {
    setCategoriesOpen(!categoriesOpen);
  };

  const menuItems = [
    { text: "Profil", icon: <PersonIcon />, path: "/profile" },
    { text: "Kitaplarım", icon: <MyBooksIcon />, path: "/my-books" },
    { text: "Kitaplar", icon: <BookIcon />, path: "/" },
    { text: "Kitap Önerileri", icon: <BookIcon />, path: "/recommendations" },
  ];

  const drawer = (
    <div>
      <Toolbar sx={{ px: 3, py: 2, justifyContent: "center" }}>
        <Box
          sx={{
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            "&:hover": {
              opacity: 0.8,
            },
          }}
          onClick={() => navigate("/")}
        >
          <img
            src={bookflixLogo}
            alt="BOOKFLIX"
            style={{
              width: 140,
              height: "auto",
            }}
          />
        </Box>
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
                selected={currentCategoryId === category.id}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  pl: 4,
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                  "&.Mui-selected": {
                    backgroundColor: "primary.main",
                    color: "primary.contrastText",
                    "&:hover": {
                      backgroundColor: "primary.dark",
                    },
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
                    fontWeight: currentCategoryId === category.id ? 600 : 500,
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
          width: { sm: sidebarOpen ? `calc(100% - ${drawerWidth}px)` : "100%" },
          ml: { sm: sidebarOpen ? `${drawerWidth}px` : 0 },
          transition: "width 0.3s ease, margin-left 0.3s ease",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <IconButton
              color="inherit"
              aria-label="toggle sidebar"
              edge="start"
              onClick={handleDesktopDrawerToggle}
              sx={{ mr: 2, display: { xs: "none", sm: "block" } }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
          <Box
            sx={{
              cursor: "pointer",
              "&:hover": {
                opacity: 0.8,
              },
            }}
            onClick={() => navigate("/")}
          >
            <img
              src={bookflixLogo}
              alt="BOOKFLIX"
              style={{
                height: 40,
                width: "auto",
              }}
            />
          </Box>
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
          variant="persistent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              borderRight: "none",
              bgcolor: "background.paper",
              transition: "transform 0.3s ease",
            },
          }}
          open={sidebarOpen}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: sidebarOpen ? `calc(100% - ${drawerWidth}px)` : "100%" },
          minHeight: "100vh",
          bgcolor: "background.default",
          transition: "width 0.3s ease",
        }}
      >
        <Toolbar />
        {children}
      </Box>
      {currentTrack && currentTrack.audio_url && (
        <YouTube
          videoId={getYouTubeVideoId(currentTrack.audio_url)}
          opts={{ height: "0", width: "0", playerVars: { autoplay: 0 } }}
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
