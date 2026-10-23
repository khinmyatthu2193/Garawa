'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { musicMoods, musicTracks, type MusicMood, type MusicTrack } from '@/lib/music/catalog';

type MusicContextValue = {
  tracks: MusicTrack[];
  filteredTracks: MusicTrack[];
  currentTrack: MusicTrack | null;
  selectedMood: MusicMood | 'all';
  isPlaying: boolean;
  loading: boolean;
  error: string | null;
  volume: number;
  muted: boolean;
  currentTime: number;
  duration: number;
  expanded: boolean;
  hasTracks: boolean;
  setSelectedMood: (mood: MusicMood | 'all') => void;
  setTrack: (id: string) => void;
  play: () => Promise<void>;
  pause: () => void;
  togglePlay: () => Promise<void>;
  next: () => void;
  previous: () => void;
  setVolume: (value: number) => void;
  toggleMute: () => void;
  seek: (value: number) => void;
  setExpanded: (value: boolean) => void;
};

const MusicContext = createContext<MusicContextValue | null>(null);
const STORAGE_KEY = 'garawa-music-preferences';

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [trackId, setTrackId] = useState<string | null>(null);
  const [selectedMood, setSelectedMood] = useState<MusicMood | 'all'>('all');
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [volume, setVolumeState] = useState(0.75);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const currentTrack = musicTracks.find((track) => track.id === trackId) ?? null;
  const filteredTracks = selectedMood === 'all' ? musicTracks : musicTracks.filter((track) => track.mood === selectedMood);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audioRef.current = audio;
    const onTime = () => setCurrentTime(audio.currentTime);
    const onMetadata = () => setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onError = () => { setIsPlaying(false); setLoading(false); setError('ဒီတေးသွားကို ဖွင့်၍မရသေးပါ။'); };
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onMetadata);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('error', onError);
    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onMetadata);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('error', onError);
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as Partial<{ trackId: string; mood: MusicMood | 'all'; volume: number; muted: boolean; expanded: boolean }>;
      if (saved.trackId && musicTracks.some((track) => track.id === saved.trackId)) setTrackId(saved.trackId);
      if (saved.mood === 'all' || musicMoods.some((mood) => mood.id === saved.mood)) setSelectedMood(saved.mood);
      if (typeof saved.volume === 'number') setVolumeState(Math.min(1, Math.max(0, saved.volume)));
      if (typeof saved.muted === 'boolean') setMuted(saved.muted);
      if (typeof saved.expanded === 'boolean') setExpanded(saved.expanded);
    } catch { /* Ignore malformed local preferences. */ }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ trackId, mood: selectedMood, volume, muted, expanded }));
  }, [trackId, selectedMood, volume, muted, expanded]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setError(null);
    if (currentTrack?.src) {
      audio.src = currentTrack.src;
      audio.load();
    } else {
      audio.removeAttribute('src');
      audio.load();
    }
  }, [currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = muted;
    }
  }, [volume, muted]);

  const play = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || !currentTrack?.src) { setError('အသံဖိုင် မရရှိသေးပါ။'); return; }
    setLoading(true); setError(null);
    try { await audio.play(); } catch { setIsPlaying(false); setError('တေးသွားကို ဖွင့်၍မရပါ။'); } finally { setLoading(false); }
  }, [currentTrack]);
  const pause = useCallback(() => audioRef.current?.pause(), []);
  const togglePlay = useCallback(() => isPlaying ? (pause(), Promise.resolve()) : play(), [isPlaying, pause, play]);
  const setTrack = useCallback((id: string) => { if (musicTracks.some((track) => track.id === id)) setTrackId(id); }, []);
  const move = useCallback((direction: 1 | -1) => {
    const list = filteredTracks.length ? filteredTracks : musicTracks;
    if (!list.length) return;
    const index = Math.max(0, list.findIndex((track) => track.id === trackId));
    setTrackId(list[(index + direction + list.length) % list.length].id);
  }, [filteredTracks, trackId]);
  const seek = useCallback((value: number) => { if (audioRef.current) audioRef.current.currentTime = value; setCurrentTime(value); }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onEnded = () => {
      const list = filteredTracks.length ? filteredTracks : musicTracks;
      if (!list.length) return;
      const index = Math.max(0, list.findIndex((track) => track.id === trackId));
      setTrackId(list[(index + 1) % list.length].id);
    };
    audio.addEventListener('ended', onEnded);
    return () => audio.removeEventListener('ended', onEnded);
  }, [filteredTracks, trackId]);

  const value = useMemo<MusicContextValue>(() => ({
    tracks: musicTracks, filteredTracks, currentTrack, selectedMood, isPlaying, loading, error, volume, muted, currentTime, duration, expanded,
    hasTracks: musicTracks.length > 0, setSelectedMood, setTrack, play, pause, togglePlay, next: () => move(1), previous: () => move(-1),
    setVolume: (value) => setVolumeState(Math.min(1, Math.max(0, value))), toggleMute: () => setMuted((value) => !value), seek, setExpanded,
  }), [filteredTracks, currentTrack, selectedMood, isPlaying, loading, error, volume, muted, currentTime, duration, expanded, play, pause, togglePlay, setTrack, move, seek]);

  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (!context) throw new Error('useMusic must be used inside MusicProvider');
  return context;
}
