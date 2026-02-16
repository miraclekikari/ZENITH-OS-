import { useCallback, useEffect, useRef, useState } from 'react';

interface UseNotificationSoundOptions {
  volume?: number;
  enabled?: boolean;
}

export const useNotificationSound = (options: UseNotificationSoundOptions = {}) => {
  const { volume = 0.5, enabled = true } = options;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Initialize audio element
  useEffect(() => {
    if (!enabled) return;

    const audio = new Audio('/sounds/notif.mp3');
    audio.volume = volume;
    audio.preload = 'auto';
    
    audio.addEventListener('canplaythrough', () => {
      setIsLoaded(true);
    });

    audio.addEventListener('ended', () => {
      setIsPlaying(false);
    });

    audio.addEventListener('error', (e) => {
      console.warn('Failed to load notification sound:', e);
    });

    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, [enabled, volume]);

  // Play sound function
  const playSound = useCallback(() => {
    if (!enabled || !audioRef.current || !isLoaded) {
      return;
    }

    // Reset audio to start
    audioRef.current.currentTime = 0;
    
    // Play with user interaction context
    const playPromise = audioRef.current.play();
    
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          // Auto-play was prevented, need user interaction
          console.warn('Audio play failed (user interaction required):', error);
          setIsPlaying(false);
        });
    }
  }, [enabled, isLoaded]);

  // Stop sound function
  const stopSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, []);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  return {
    playSound,
    stopSound,
    isLoaded,
    isPlaying,
  };
};

export default useNotificationSound;
