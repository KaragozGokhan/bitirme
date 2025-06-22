import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useRef,
  useCallback,
  useEffect,
} from "react";
import { Book } from "../types";

// YouTube Player'dan alınacak tip tanımı
// Bu, bize oynatıcı üzerinde tam kontrol sağlayacak
type YouTubePlayer = any;

interface AudioPlayerContextType {
  currentTrack: Book | null;
  isPlaying: boolean;
  isReady: boolean; // Oynatıcının hazır olup olmadığını belirtir
  volume: number;
  isMuted: boolean; // Ses kapalı mı açık mı
  progress: number;
  duration: number;
  playerRef: React.MutableRefObject<YouTubePlayer | null>;

  playTrack: (track: Book) => void;
  togglePlayPause: () => void;
  changeVolume: (volume: number) => void;
  toggleMute: () => void; // Ses açma/kapama
  seek: (amount: number) => void; // ileri/geri sarma
  closePlayer: () => void; // Oynatıcıyı kapat
  setProgress: (progress: number) => void;
  setDuration: (duration: number) => void;
  setIsPlaying: (playing: boolean) => void;
  setIsReady: (ready: boolean) => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(
  undefined
);

export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error(
      "useAudioPlayer must be used within an AudioPlayerProvider"
    );
  }
  return context;
};

export const AudioPlayerProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentTrack, setCurrentTrack] = useState<Book | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const playerRef = useRef<YouTubePlayer | null>(null);

  const playTrack = useCallback((track: Book) => {
    setCurrentTrack(track);
    setIsReady(false); // Yeni parça yüklenirken hazır değil
    setProgress(0); // İlerleme sıfırlanır
    setDuration(0); // Süre sıfırlanır
  }, []);

  // Player hazır olduğunda otomatik oynatmayı başlat
  useEffect(() => {
    if (isReady && currentTrack && playerRef.current) {
      // Kısa bir gecikme ile oynatmayı başlat
      setTimeout(() => {
        if (playerRef.current) {
          playerRef.current.playVideo();
          setIsPlaying(true);
        }
      }, 500);
    }
  }, [isReady, currentTrack]);

  const togglePlayPause = useCallback(() => {
    if (!playerRef.current || !isReady) return;

    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  }, [isReady, isPlaying]);

  const changeVolume = useCallback((newVolume: number) => {
    if (!playerRef.current) return;
    const clampedVolume = Math.max(0, Math.min(100, newVolume));
    playerRef.current.setVolume(clampedVolume);
    setVolume(clampedVolume / 100);
  }, []);

  const toggleMute = useCallback(() => {
    if (!playerRef.current) return;
    
    if (isMuted) {
      // Ses aç
      playerRef.current.unMute();
      setIsMuted(false);
    } else {
      // Ses kapat
      playerRef.current.mute();
      setIsMuted(true);
    }
  }, [isMuted]);

  const seek = useCallback((amount: number) => {
    if (!playerRef.current) return;
    const currentTime = playerRef.current.getCurrentTime();
    playerRef.current.seekTo(currentTime + amount, true);
  }, []);

  const closePlayer = useCallback(() => {
    if (playerRef.current) {
      playerRef.current.stopVideo();
    }
    setCurrentTrack(null);
    setIsPlaying(false);
    setIsReady(false);
    setProgress(0);
    setDuration(0);
  }, []);

  const value = {
    currentTrack,
    isPlaying,
    isReady,
    volume,
    isMuted,
    progress,
    duration,
    playerRef,
    playTrack,
    togglePlayPause,
    changeVolume,
    toggleMute,
    seek,
    closePlayer,
    setProgress,
    setDuration,
    setIsPlaying,
    setIsReady,
  };

  return (
    <AudioPlayerContext.Provider value={value}>
      {children}
    </AudioPlayerContext.Provider>
  );
};
