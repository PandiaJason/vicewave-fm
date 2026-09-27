'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  clearSavedFavorites,
  clearSavedHistory,
  getSavedFavorites,
  getSavedHistory,
  getSavedPreferences,
  getSavedStationState,
  saveHistoryEntry,
  saveStationState,
  saveUserPreferences,
  toggleSavedFavorite,
  cacheTrackMetadata,
} from '@/lib/db';
import { IAudioSource } from '@/player/AudioSource';
import { backgroundAudioManager } from '@/player/backgroundAudio';
import {
  DEFAULT_PREFERENCES,
  INITIAL_TRACKS,
  INITIAL_YOUTUBE_PLAYLIST_ID,
  progressStore,
  STATIONS,
} from '@/player/playerStore';
import {
  HistoryItem,
  PlaybackStatus,
  RepeatMode,
  SleepTimerOption,
  SleepTimerState,
  Station,
  Track,
  UserPreferences,
} from '@/player/playerTypes';
import { YouTubeAudioSource } from '@/player/YouTubeAudioSource';
import { YouTubePlayer } from '@/player/YouTubePlayer';

export interface TuningTransitionState {
  active: boolean;
  phase: 'ROLLING' | 'LOCKED';
  displayFreq: string;
  targetStationName: string;
}

interface PlayerContextValue {
  tracks: Track[];
  stations: Station[];
  currentStation: Station;
  currentTrack: Track;
  playerState: PlaybackStatus;
  favorites: string[];
  history: HistoryItem[];
  preferences: UserPreferences;
  sleepTimer: SleepTimerState;
  isOffline: boolean;
  videoModeOpen: boolean;
  tuningTransition: TuningTransitionState;
  startupComplete: boolean;
  queueDrawerOpen: boolean;
  sleepModalOpen: boolean;

  // Actions
  setStartupComplete: (done: boolean) => void;
  togglePlayPause: () => void;
  play: () => void;
  pause: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  selectTrack: (trackId: string, switchStation?: boolean) => void;
  selectStation: (stationId: string) => void;
  stepStation: (direction: 'NEXT' | 'PREV') => void;
  seekTo: (seconds: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleFavorite: (trackId?: string) => void;
  toggleShuffle: () => void;
  cycleRepeatMode: () => void;
  updatePreferences: (partial: Partial<UserPreferences>) => void;
  setSleepTimerOption: (option: SleepTimerOption) => void;
  setVideoModeOpen: (open: boolean) => void;
  setQueueDrawerOpen: (open: boolean) => void;
  setSleepModalOpen: (open: boolean) => void;
  toggleNightDrive: (force?: boolean) => void;
  retryPlayback: () => void;
  clearAllFavorites: () => Promise<void>;
  clearAllHistory: () => Promise<void>;
  resetAllPreferences: () => Promise<void>;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tracks, setTracks] = useState<Track[]>(INITIAL_TRACKS);
  const [stations] = useState<Station[]>(STATIONS);
  const [currentStationId, setCurrentStationId] = useState<string>('vicewave-fm');
  // Default to "Out of Touch" by Daryl Hall & John Oates on 98.3 VICEWAVE FM
  const [currentTrackId, setCurrentTrackId] = useState<string>('vw-983-01');
  const [playerState, setPlayerState] = useState<PlaybackStatus>('IDLE');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [videoModeOpen, setVideoModeOpen] = useState<boolean>(false);
  const [startupComplete, setStartupComplete] = useState<boolean>(false);
  const [queueDrawerOpen, setQueueDrawerOpen] = useState<boolean>(false);
  const [sleepModalOpen, setSleepModalOpen] = useState<boolean>(false);

  const [sleepTimer, setSleepTimer] = useState<SleepTimerState>({
    option: 'OFF',
    expiresAt: null,
    remainingSeconds: null,
  });

  const [tuningTransition, setTuningTransition] = useState<TuningTransitionState>({
    active: false,
    phase: 'LOCKED',
    displayFreq: '98.3',
    targetStationName: 'VICEWAVE FM',
  });

  const audioSourceRef = useRef<IAudioSource | null>(null);
  const currentTrackIdRef = useRef<string>(currentTrackId);
  const currentStationIdRef = useRef<string>(currentStationId);
  const preferencesRef = useRef<UserPreferences>(preferences);
  const sleepTimerRef = useRef<SleepTimerState>(sleepTimer);
  const tracksRef = useRef<Track[]>(tracks);

  currentTrackIdRef.current = currentTrackId;
  currentStationIdRef.current = currentStationId;
  preferencesRef.current = preferences;
  sleepTimerRef.current = sleepTimer;
  tracksRef.current = tracks;

  const currentStation = useMemo(
    () => stations.find((s) => s.id === currentStationId) || stations[1],
    [stations, currentStationId]
  );

  const currentTrack = useMemo(
    () => tracks.find((t) => t.id === currentTrackId) || tracks[0],
    [tracks, currentTrackId]
  );

  const triggerHaptic = useCallback((ms = 10) => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(ms);
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    async function hydrateFromDB() {
      const [savedFavs, savedHist, savedPrefs, savedStation] = await Promise.all([
        getSavedFavorites(),
        getSavedHistory(),
        getSavedPreferences(),
        getSavedStationState(),
      ]);

      if (!mounted) return;

      const osReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

      const mergedPrefs: UserPreferences = {
        ...DEFAULT_PREFERENCES,
        ...(savedPrefs || {}),
        reducedMotion: savedPrefs?.reducedMotion ?? Boolean(osReducedMotion),
      };

      setPreferences(mergedPrefs);
      setFavorites(savedFavs);
      setTracks((prev) =>
        prev.map((t) => ({
          ...t,
          favorite: savedFavs.includes(t.id),
        }))
      );

      // Filter out any legacy track IDs from history
      const validHist = savedHist.filter((h) =>
        INITIAL_TRACKS.some((t) => t.id === h.trackId)
      );

      if (validHist.length > 0) {
        setHistory(validHist);
      } else {
        const initialHistory = await saveHistoryEntry('vw-983-01');
        setHistory(initialHistory);
      }

      if (mergedPrefs.resumeLastStation && savedStation) {
        if (STATIONS.some((s) => s.id === savedStation.stationId)) {
          setCurrentStationId(savedStation.stationId);
        }
        if (INITIAL_TRACKS.some((t) => t.id === savedStation.trackId)) {
          setCurrentTrackId(savedStation.trackId);
        }
      } else if (mergedPrefs.defaultStationId) {
        setCurrentStationId(mergedPrefs.defaultStationId);
      }

      await cacheTrackMetadata(INITIAL_TRACKS);
    }

    hydrateFromDB();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const updateOnlineStatus = () => {
      const offline = !navigator.onLine;
      setIsOffline(offline);
      if (offline) {
        setPlayerState('OFFLINE');
      }
    };
    updateOnlineStatus();
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  const handleNextTrackInternal = useCallback((fromEnded = false) => {
    if (fromEnded && sleepTimerRef.current.option === 'END_OF_TRACK') {
      audioSourceRef.current?.pause();
      backgroundAudioManager.stopKeepAlive();
      setPlayerState('PAUSED');
      setSleepTimer({ option: 'OFF', expiresAt: null, remainingSeconds: null });
      return;
    }

    const prefs = preferencesRef.current;
    const allTracks = tracksRef.current;
    const station = STATIONS.find((s) => s.id === currentStationIdRef.current) || STATIONS[1];
    const stationTracks = allTracks.filter((t) => station.trackIds.includes(t.id));
    const pool = stationTracks.length > 0 ? stationTracks : allTracks;

    if (fromEnded && prefs.repeatMode === 'ONE') {
      const current = allTracks.find((t) => t.id === currentTrackIdRef.current) || pool[0];
      audioSourceRef.current?.loadTrack(current, true);
      backgroundAudioManager.startKeepAlive();
      saveHistoryEntry(current.id).then(setHistory);
      return;
    }

    let next: Track;
    if (prefs.shuffle && pool.length > 1) {
      const candidates = pool.filter((t) => t.id !== currentTrackIdRef.current);
      next = candidates[Math.floor(Math.random() * candidates.length)] || pool[0];
    } else {
      const idx = pool.findIndex((t) => t.id === currentTrackIdRef.current);
      const nextIdx = idx >= 0 ? (idx + 1) % pool.length : 0;
      if (fromEnded && prefs.repeatMode === 'OFF' && idx === pool.length - 1) {
        audioSourceRef.current?.pause();
        backgroundAudioManager.stopKeepAlive();
        setPlayerState('PAUSED');
        return;
      }
      next = pool[nextIdx];
    }

    setCurrentTrackId(next.id);
    progressStore.setProgress(0, next.duration);
    backgroundAudioManager.startKeepAlive();
    audioSourceRef.current?.loadTrack(next, true);
    saveHistoryEntry(next.id).then(setHistory);
    saveStationState(currentStationIdRef.current, next.id);
  }, []);

  useEffect(() => {
    const source = new YouTubeAudioSource({
      onStatusChange: (status) => {
        setPlayerState(status);
        if (status === 'PLAYING') {
          backgroundAudioManager.startKeepAlive();
        }
      },
      onTimeUpdate: (rawVideoSeconds) => {
        const allTracks = tracksRef.current;
        const active =
          allTracks.find((t) => t.id === currentTrackIdRef.current) || allTracks[0];

        // Calculate song-relative elapsed time (0 .. active.duration)
        const relElapsed = Math.max(
          0,
          Math.min(active.duration, rawVideoSeconds - active.startSeconds)
        );
        progressStore.setProgress(relElapsed, active.duration);
        backgroundAudioManager.updatePositionState(relElapsed, active.duration);

        // Check if current song has reached its endSeconds timestamp
        if (rawVideoSeconds >= active.endSeconds) {
          if (sleepTimerRef.current.option === 'END_OF_TRACK') {
            audioSourceRef.current?.pause();
            backgroundAudioManager.stopKeepAlive();
            setPlayerState('PAUSED');
            setSleepTimer({ option: 'OFF', expiresAt: null, remainingSeconds: null });
            return;
          }

          if (preferencesRef.current.repeatMode === 'ONE') {
            audioSourceRef.current?.seek(active.startSeconds);
            return;
          }

          if (preferencesRef.current.shuffle) {
            handleNextTrackInternal(true);
            return;
          }
        }

        // Natural continuous broadcast auto-track synchronization:
        // If the video timestamp crosses into another track on the same station, update Now Playing automatically!
        const stationTracks = allTracks.filter(
          (t) => t.stationId === currentStationIdRef.current
        );
        const matchedTrack = stationTracks.find(
          (t) => rawVideoSeconds >= t.startSeconds && rawVideoSeconds < t.endSeconds
        );

        if (matchedTrack && matchedTrack.id !== currentTrackIdRef.current) {
          setCurrentTrackId(matchedTrack.id);
          saveHistoryEntry(matchedTrack.id).then(setHistory);
          saveStationState(currentStationIdRef.current, matchedTrack.id);
        }
      },
      onTrackEnd: () => {
        handleNextTrackInternal(true);
      },
      onError: () => {
        if (!navigator.onLine) {
          setIsOffline(true);
          setPlayerState('OFFLINE');
        } else {
          setPlayerState('ERROR');
        }
      },
    });

    audioSourceRef.current = source;
    const initTrack =
      INITIAL_TRACKS.find((t) => t.id === currentTrackIdRef.current) || INITIAL_TRACKS[0];
    source.init('vicewave-yt-player', initTrack, INITIAL_YOUTUBE_PLAYLIST_ID);

    return () => {
      source.destroy();
      audioSourceRef.current = null;
    };
  }, [handleNextTrackInternal]);

  useEffect(() => {
    backgroundAudioManager.updateMediaSessionMetadata(
      currentTrack,
      currentStation,
      playerState === 'PLAYING'
    );
  }, [currentTrack, currentStation, playerState]);

  useEffect(() => {
    if (!sleepTimer.expiresAt) return;

    const timer = setInterval(() => {
      const now = Date.now();
      const diffSec = Math.max(0, Math.ceil((sleepTimer.expiresAt! - now) / 1000));
      if (diffSec <= 0) {
        audioSourceRef.current?.pause();
        backgroundAudioManager.stopKeepAlive();
        setPlayerState('PAUSED');
        setSleepTimer({ option: 'OFF', expiresAt: null, remainingSeconds: null });
      } else {
        setSleepTimer((prev) => ({
          ...prev,
          remainingSeconds: diffSec,
        }));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [sleepTimer.expiresAt]);

  useEffect(() => {
    let wakeLock: { release: () => Promise<void> } | null = null;
    async function requestWakeLock() {
      if (
        typeof navigator !== 'undefined' &&
        'wakeLock' in navigator &&
        (playerState === 'PLAYING' || (preferences.nightDrive && preferences.keepScreenAwake))
      ) {
        try {
          const navWithWake = navigator as Navigator & {
            wakeLock: { request: (type: 'screen') => Promise<{ release: () => Promise<void> }> };
          };
          wakeLock = await navWithWake.wakeLock.request('screen');
        } catch {
          // ignore
        }
      }
    }
    requestWakeLock();
    return () => {
      if (wakeLock) {
        wakeLock.release().catch(() => {});
      }
    };
  }, [playerState, preferences.nightDrive, preferences.keepScreenAwake]);

  const play = useCallback(() => {
    if (isOffline) return;
    triggerHaptic(10);
    backgroundAudioManager.startKeepAlive();
    audioSourceRef.current?.play();
    saveHistoryEntry(currentTrackIdRef.current).then(setHistory);
  }, [isOffline, triggerHaptic]);

  const pause = useCallback(() => {
    triggerHaptic(8);
    backgroundAudioManager.stopKeepAlive();
    audioSourceRef.current?.pause();
  }, [triggerHaptic]);

  const togglePlayPause = useCallback(() => {
    if (playerState === 'PLAYING' || playerState === 'BUFFERING') {
      pause();
    } else {
      play();
    }
  }, [playerState, pause, play]);

  const nextTrack = useCallback(() => {
    triggerHaptic(12);
    backgroundAudioManager.startKeepAlive();
    handleNextTrackInternal(false);
  }, [handleNextTrackInternal, triggerHaptic]);

  const previousTrack = useCallback(() => {
    triggerHaptic(12);
    backgroundAudioManager.startKeepAlive();
    const active =
      tracksRef.current.find((t) => t.id === currentTrackIdRef.current) || tracksRef.current[0];
    const rawVideoTime = audioSourceRef.current?.getCurrentTime() || 0;
    const relTime = Math.max(0, rawVideoTime - active.startSeconds);

    if (relTime > 5) {
      audioSourceRef.current?.seek(active.startSeconds);
      progressStore.setProgress(0, active.duration);
      return;
    }

    const allTracks = tracksRef.current;
    const station = STATIONS.find((s) => s.id === currentStationIdRef.current) || STATIONS[1];
    const stationTracks = allTracks.filter((t) => station.trackIds.includes(t.id));
    const pool = stationTracks.length > 0 ? stationTracks : allTracks;
    const idx = pool.findIndex((t) => t.id === currentTrackIdRef.current);
    const prevIdx = idx > 0 ? idx - 1 : pool.length - 1;
    const prevTrack = pool[prevIdx] || pool[0];

    setCurrentTrackId(prevTrack.id);
    progressStore.setProgress(0, prevTrack.duration);
    audioSourceRef.current?.loadTrack(prevTrack, true);
    saveHistoryEntry(prevTrack.id).then(setHistory);
    saveStationState(currentStationIdRef.current, prevTrack.id);
  }, [triggerHaptic]);

  const selectTrack = useCallback(
    (trackId: string, switchStation = true) => {
      const found = tracksRef.current.find((t) => t.id === trackId);
      if (!found) return;
      triggerHaptic(12);
      backgroundAudioManager.startKeepAlive();
      if (switchStation && found.stationId !== currentStationIdRef.current) {
        setCurrentStationId(found.stationId);
      }
      setCurrentTrackId(found.id);
      progressStore.setProgress(0, found.duration);
      audioSourceRef.current?.loadTrack(found, true);
      saveHistoryEntry(found.id).then(setHistory);
      saveStationState(found.stationId, found.id);
    },
    [triggerHaptic]
  );

  const selectStation = useCallback(
    (stationId: string) => {
      const target = stations.find((s) => s.id === stationId);
      if (!target) return;

      triggerHaptic(15);
      backgroundAudioManager.startKeepAlive();
      const startFreq = currentStation.numericFreq;
      const endFreq = target.numericFreq;

      setCurrentStationId(target.id);

      const stationTrack =
        tracksRef.current.find((t) => t.id === target.trackIds[0]) ||
        tracksRef.current.find((t) => t.stationId === target.id) ||
        tracksRef.current[0];

      if (stationTrack) {
        setCurrentTrackId(stationTrack.id);
        progressStore.setProgress(0, stationTrack.duration);
        audioSourceRef.current?.loadTrack(stationTrack, true);
        saveHistoryEntry(stationTrack.id).then(setHistory);
        saveStationState(target.id, stationTrack.id);
      }

      if (preferencesRef.current.stationTransition && !preferencesRef.current.reducedMotion) {
        const step1 = (startFreq + (endFreq - startFreq) * 0.35).toFixed(1);
        const step2 = (startFreq + (endFreq - startFreq) * 0.75).toFixed(1);

        setTuningTransition({
          active: true,
          phase: 'ROLLING',
          displayFreq: step1,
          targetStationName: target.name,
        });

        setTimeout(() => {
          setTuningTransition({
            active: true,
            phase: 'ROLLING',
            displayFreq: step2,
            targetStationName: target.name,
          });
        }, 140);

        setTimeout(() => {
          setTuningTransition({
            active: true,
            phase: 'LOCKED',
            displayFreq: target.frequency,
            targetStationName: target.name,
          });
        }, 280);

        setTimeout(() => {
          setTuningTransition((prev) => ({ ...prev, active: false }));
        }, 540);
      }
    },
    [stations, currentStation.numericFreq, triggerHaptic]
  );

  const stepStation = useCallback(
    (direction: 'NEXT' | 'PREV') => {
      const idx = stations.findIndex((s) => s.id === currentStationIdRef.current);
      if (idx === -1) return;
      const nextIdx =
        direction === 'NEXT'
          ? (idx + 1) % stations.length
          : (idx - 1 + stations.length) % stations.length;
      selectStation(stations[nextIdx].id);
    },
    [stations, selectStation]
  );

  // Seek within the active song's [startSeconds .. endSeconds] window
  const seekTo = useCallback((relativeSeconds: number) => {
    const active =
      tracksRef.current.find((t) => t.id === currentTrackIdRef.current) || tracksRef.current[0];
    const clampedRel = Math.max(0, Math.min(active.duration, relativeSeconds));
    const targetVideoSeconds = active.startSeconds + clampedRel;
    progressStore.setProgress(clampedRel, active.duration);
    audioSourceRef.current?.seek(targetVideoSeconds);
  }, []);

  useEffect(() => {
    backgroundAudioManager.registerActionHandlers({
      onPlay: () => play(),
      onPause: () => pause(),
      onNext: () => nextTrack(),
      onPrev: () => previousTrack(),
      onSeekTo: (seconds) => seekTo(seconds),
    });
  }, [play, pause, nextTrack, previousTrack, seekTo]);

  const setVolume = useCallback((volume: number) => {
    const clamped = Math.max(0, Math.min(100, volume));
    audioSourceRef.current?.setVolume(clamped);
    if (clamped > 0 && preferencesRef.current.muted) {
      audioSourceRef.current?.setMuted(false);
    }
    setPreferences((prev) => {
      const updated = { ...prev, volume: clamped, muted: clamped === 0 ? true : false };
      saveUserPreferences(updated);
      return updated;
    });
  }, []);

  const toggleMute = useCallback(() => {
    triggerHaptic(8);
    const nextMuted = !preferencesRef.current.muted;
    audioSourceRef.current?.setMuted(nextMuted);
    setPreferences((prev) => {
      const updated = { ...prev, muted: nextMuted };
      saveUserPreferences(updated);
      return updated;
    });
  }, [triggerHaptic]);

  const toggleFavorite = useCallback(
    (trackId?: string) => {
      const targetId = trackId || currentTrackIdRef.current;
      triggerHaptic(14);
      setFavorites((prev) => {
        const isFav = !prev.includes(targetId);
        const nextFavs = isFav ? [...prev, targetId] : prev.filter((id) => id !== targetId);
        toggleSavedFavorite(targetId, isFav);
        setTracks((tList) =>
          tList.map((t) => (t.id === targetId ? { ...t, favorite: isFav } : t))
        );
        return nextFavs;
      });
    },
    [triggerHaptic]
  );

  const toggleShuffle = useCallback(() => {
    triggerHaptic(10);
    setPreferences((prev) => {
      const updated = { ...prev, shuffle: !prev.shuffle };
      saveUserPreferences(updated);
      return updated;
    });
  }, [triggerHaptic]);

  const cycleRepeatMode = useCallback(() => {
    triggerHaptic(10);
    const order: RepeatMode[] = ['ALL', 'ONE', 'OFF'];
    setPreferences((prev) => {
      const nextMode = order[(order.indexOf(prev.repeatMode) + 1) % order.length];
      const updated = { ...prev, repeatMode: nextMode };
      saveUserPreferences(updated);
      return updated;
    });
  }, [triggerHaptic]);

  const updatePreferences = useCallback((partial: Partial<UserPreferences>) => {
    setPreferences((prev) => {
      const updated = { ...prev, ...partial };
      saveUserPreferences(updated);
      return updated;
    });
  }, []);

  const setSleepTimerOption = useCallback((option: SleepTimerOption) => {
    if (option === 'OFF') {
      setSleepTimer({ option: 'OFF', expiresAt: null, remainingSeconds: null });
    } else if (option === 'END_OF_TRACK') {
      setSleepTimer({ option: 'END_OF_TRACK', expiresAt: null, remainingSeconds: null });
    } else {
      const mins = parseInt(option, 10);
      const secs = mins * 60;
      setSleepTimer({
        option,
        expiresAt: Date.now() + secs * 1000,
        remainingSeconds: secs,
      });
    }
  }, []);

  const toggleNightDrive = useCallback(
    (force?: boolean) => {
      triggerHaptic(15);
      setPreferences((prev) => {
        const nextVal = typeof force === 'boolean' ? force : !prev.nightDrive;
        const updated = { ...prev, nightDrive: nextVal };
        saveUserPreferences(updated);
        return updated;
      });
    },
    [triggerHaptic]
  );

  const retryPlayback = useCallback(() => {
    const offline = typeof navigator !== 'undefined' && !navigator.onLine;
    setIsOffline(offline);
    if (offline) {
      setPlayerState('OFFLINE');
      return;
    }
    backgroundAudioManager.startKeepAlive();
    const current =
      tracksRef.current.find((t) => t.id === currentTrackIdRef.current) || tracksRef.current[0];
    audioSourceRef.current?.loadTrack(current, true);
  }, []);

  const clearAllFavorites = useCallback(async () => {
    await clearSavedFavorites();
    setFavorites([]);
    setTracks((prev) => prev.map((t) => ({ ...t, favorite: false })));
  }, []);

  const clearAllHistory = useCallback(async () => {
    await clearSavedHistory();
    setHistory([]);
  }, []);

  const resetAllPreferences = useCallback(async () => {
    setPreferences(DEFAULT_PREFERENCES);
    audioSourceRef.current?.setVolume(DEFAULT_PREFERENCES.volume);
    audioSourceRef.current?.setMuted(false);
    await saveUserPreferences(DEFAULT_PREFERENCES);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlayPause();
      } else if (e.code === 'ArrowRight' && e.shiftKey) {
        e.preventDefault();
        nextTrack();
      } else if (e.code === 'ArrowLeft' && e.shiftKey) {
        e.preventDefault();
        previousTrack();
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        toggleMute();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [togglePlayPause, nextTrack, previousTrack, toggleMute]);

  const value = useMemo<PlayerContextValue>(
    () => ({
      tracks,
      stations,
      currentStation,
      currentTrack,
      playerState,
      favorites,
      history,
      preferences,
      sleepTimer,
      isOffline,
      videoModeOpen,
      tuningTransition,
      startupComplete,
      queueDrawerOpen,
      sleepModalOpen,
      setStartupComplete,
      togglePlayPause,
      play,
      pause,
      nextTrack,
      previousTrack,
      selectTrack,
      selectStation,
      stepStation,
      seekTo,
      setVolume,
      toggleMute,
      toggleFavorite,
      toggleShuffle,
      cycleRepeatMode,
      updatePreferences,
      setSleepTimerOption,
      setVideoModeOpen,
      setQueueDrawerOpen,
      setSleepModalOpen,
      toggleNightDrive,
      retryPlayback,
      clearAllFavorites,
      clearAllHistory,
      resetAllPreferences,
    }),
    [
      tracks,
      stations,
      currentStation,
      currentTrack,
      playerState,
      favorites,
      history,
      preferences,
      sleepTimer,
      isOffline,
      videoModeOpen,
      tuningTransition,
      startupComplete,
      queueDrawerOpen,
      sleepModalOpen,
      togglePlayPause,
      play,
      pause,
      nextTrack,
      previousTrack,
      selectTrack,
      selectStation,
      stepStation,
      seekTo,
      setVolume,
      toggleMute,
      toggleFavorite,
      toggleShuffle,
      cycleRepeatMode,
      updatePreferences,
      setSleepTimerOption,
      toggleNightDrive,
      retryPlayback,
      clearAllFavorites,
      clearAllHistory,
      resetAllPreferences,
    ]
  );

  return (
    <PlayerContext.Provider value={value}>
      {children}
      <YouTubePlayer
        videoModeOpen={videoModeOpen}
        onCloseVideoMode={() => setVideoModeOpen(false)}
        stationFrequency={currentStation.frequency}
        stationName={currentStation.name}
        trackTitle={currentTrack.title}
        trackArtist={currentTrack.artist}
      />
    </PlayerContext.Provider>
  );
};

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return ctx;
}
