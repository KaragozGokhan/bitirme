import React, { createContext, useContext, useState, ReactNode, useRef, useCallback } from 'react';
import { Book } from '../types';

// YouTube Player'dan alınacak tip tanımı
// Bu, bize oynatıcı üzerinde tam kontrol sağlayacak
type YouTubePlayer = any;

interface AudioPlayerContextType {
  currentTrack: Book | null;
  isPlaying: boolean;
  isReady: boolean; // Oynatıcının hazır olup olmadığını belirtir
  volume: number;
  progress: number;
  duration: number;
  playerRef: React.MutableRefObject<YouTubePlayer | null>;

  playTrack: (track: Book) => void;
  togglePlayPause: () => void;
  changeVolume: (volume: number) => void;
  seek: (amount: number) => void; // ileri/geri sarma
  setProgress: (progress: number) => void;
  setDuration: (duration: number) => void;
  setIsPlaying: (playing: boolean) => void;
  setIsReady: (ready: boolean) => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
  }
  return context;
};

export const AudioPlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<Book | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const playerRef = useRef<YouTubePlayer | null>(null);

  const playTrack = useCallback((track: Book) => {
    setCurrentTrack(track);
    setIsReady(false); // Yeni parça yüklenirken hazır değil
    setProgress(0); // İlerleme sıfırlanır
    setDuration(0); // Süre sıfırlanır
  }, []);

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
  
  const seek = useCallback((amount: number) => {
    if (!playerRef.current) return;
    const currentTime = playerRef.current.getCurrentTime();
    playerRef.current.seekTo(currentTime + amount, true);
  }, []);

  const value = {
    currentTrack,
    isPlaying,
    isReady,
    volume,
    progress,
    duration,
    playerRef,
    playTrack,
    togglePlayPause,
    changeVolume,
    seek,
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