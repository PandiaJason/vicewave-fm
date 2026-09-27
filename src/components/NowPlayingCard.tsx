'use client';

import React, { useRef, useState, useSyncExternalStore } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePlayer } from '@/player/PlayerProvider';
import { progressStore } from '@/player/playerStore';
import { GlassPanel } from '@/components/Atmosphere';
import {
  Car,
  Disc,
  Heart,
  ListMusic,
  Moon,
  Pause,
  Play,
  Repeat,
  Repeat1,
  Shuffle,
  SkipBack,
  SkipForward,
  Tv,
  Volume2,
  VolumeX,
} from 'lucide-react';

export function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export const CassetteDeckGraphic: React.FC<{
  stationFrequency: string;
  stationShortName: string;
  trackTitle: string;
  isPlaying: boolean;
}> = ({ stationFrequency, stationShortName, trackTitle, isPlaying }) => {
  return (
    <div className="relative w-full aspect-square max-w-[280px] mx-auto rounded-[22px] bg-gradient-to-b from-[#1A0E30] via-[#0D071B] to-[#080512] border border-[#27E5FF]/40 shadow-neon-cyan p-4 flex flex-col justify-between overflow-hidden select-none">
      {/* Top Cassette Screws & Label Header */}
      <div className="flex items-center justify-between text-[10px] font-mono text-white/45">
        <span className="w-2 h-2 rounded-full bg-white/20 border border-white/30" />
        <span className="tracking-[0.25em] text-[#27E5FF] font-bold">
          CHROME CR-O2 • 90 MIN
        </span>
        <span className="w-2 h-2 rounded-full bg-white/20 border border-white/30" />
      </div>

      {/* Inner Cassette Sticker */}
      <div className="my-auto rounded-xl bg-gradient-to-b from-[#251242] to-[#110821] border border-[#FF2DAA]/50 p-3 shadow-inner">
        <div className="flex items-center justify-between border-b border-white/10 pb-1.5 mb-3">
          <div>
            <div className="text-xs font-display font-black italic tracking-[0.2em] text-white">
              VICEWAVE
            </div>
            <div className="text-[9px] font-mono tracking-[0.22em] text-[#FF2DAA]">
              SIDE A • {stationShortName}
            </div>
          </div>
          <div className="px-2 py-0.5 rounded bg-[#080713] border border-[#27E5FF]/50 font-mono text-xs font-bold text-[#27E5FF]">
            {stationFrequency}
          </div>
        </div>

        {/* Two Rotating Tape Reels Window */}
        <div className="relative h-20 rounded-lg bg-[#06040D] border border-white/15 px-5 flex items-center justify-between overflow-hidden">
          {/* Left Reel */}
          <motion.div
            animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
            transition={
              isPlaying
                ? { duration: 4.5, repeat: Infinity, ease: 'linear' }
                : { duration: 0.2 }
            }
            className="w-12 h-12 rounded-full border-2 border-dashed border-[#27E5FF]/80 bg-[#120A24] flex items-center justify-center shadow-[0_0_10px_rgba(39,229,255,0.25)]"
          >
            <div className="w-4 h-4 rounded-full bg-[#FF2DAA] border border-white/50" />
          </motion.div>

          {/* Center Tape Spool Meter */}
          <div className="flex flex-col items-center">
            <div className="w-10 h-4 rounded bg-[#160A2B] border border-white/10 flex items-center justify-center">
              <span className="text-[8px] font-mono text-[#27E5FF]">
                {isPlaying ? 'PLAY' : 'STOP'}
              </span>
            </div>
            <div className="w-12 h-[1px] bg-gradient-to-r from-[#27E5FF] to-[#FF2DAA] mt-1.5" />
          </div>

          {/* Right Reel */}
          <motion.div
            animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
            transition={
              isPlaying
                ? { duration: 4.5, repeat: Infinity, ease: 'linear' }
                : { duration: 0.2 }
            }
            className="w-12 h-12 rounded-full border-2 border-dashed border-[#FF2DAA]/80 bg-[#120A24] flex items-center justify-center shadow-[0_0_10px_rgba(255,45,170,0.25)]"
          >
            <div className="w-4 h-4 rounded-full bg-[#27E5FF] border border-white/50" />
          </motion.div>
        </div>

        <p className="mt-2.5 text-[10px] font-mono text-white/75 truncate text-center">
          {trackTitle}
        </p>
      </div>

      {/* Bottom Magnetic Shield Trapezoid */}
      <div className="mx-6 h-5 rounded-t-lg bg-[#090614] border-t border-x border-white/15 flex items-center justify-around px-4">
        <span className="w-2 h-2 rounded-full bg-black border border-white/20" />
        <span className="text-[8px] font-mono tracking-[0.28em] text-white/40">
          STEREO DECK
        </span>
        <span className="w-2 h-2 rounded-full bg-black border border-white/20" />
      </div>
    </div>
  );
};

export const ProgressBar: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { seekTo, currentTrack } = usePlayer();
  const snapshot = useSyncExternalStore(
    progressStore.subscribe,
    progressStore.getSnapshot,
    progressStore.getSnapshot
  );

  const duration = snapshot.duration > 0 ? snapshot.duration : currentTrack.duration;
  const current = Math.min(snapshot.currentTime, duration);
  const percent = duration > 0 ? Math.min(100, (current / duration) * 100) : 0;

  if (compact) {
    return (
      <div className="w-full h-1 bg-white/10 overflow-hidden">
        <div
          style={{ width: `${percent}%` }}
          className="h-full bg-gradient-to-r from-[#27E5FF] via-[#FF3DCE] to-[#FF2DAA] transition-[width] duration-300"
        />
      </div>
    );
  }

  return (
    <div className="w-full mt-4 select-none">
      <div className="flex items-center gap-3">
        <span className="text-[11px] font-mono text-white/65 tabular-nums w-10 text-left">
          {formatTime(current)}
        </span>

        <div className="relative flex-1 h-6 flex items-center">
          <input
            type="range"
            min={0}
            max={duration || 240}
            value={current}
            onChange={(e) => seekTo(Number(e.target.value))}
            aria-label="Seek audio position"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
          />
          <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              style={{ width: `${percent}%` }}
              className="h-full rounded-full bg-gradient-to-r from-[#27E5FF] via-[#FF3DCE] to-[#FF2DAA]"
            />
          </div>
          {/* Glowing thumb dot */}
          <div
            style={{ left: `${percent}%` }}
            className="pointer-events-none absolute -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#27E5FF] shadow-[0_0_10px_#27E5FF]"
          />
        </div>

        <span className="text-[11px] font-mono text-white/65 tabular-nums w-10 text-right">
          {formatTime(duration)}
        </span>
      </div>
    </div>
  );
};

export const NowPlayingCard: React.FC = () => {
  const {
    currentTrack,
    currentStation,
    playerState,
    preferences,
    updatePreferences,
    togglePlayPause,
    nextTrack,
    previousTrack,
    toggleFavorite,
    toggleShuffle,
    cycleRepeatMode,
    setVolume,
    toggleMute,
    setVideoModeOpen,
    setQueueDrawerOpen,
    setSleepModalOpen,
    toggleNightDrive,
  } = usePlayer();

  const [swipeBanner, setSwipeBanner] = useState<'NEXT' | 'PREV' | null>(null);
  const [showVolumePopover, setShowVolumePopover] = useState(false);
  const [heartPulse, setHeartPulse] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    touchStartX.current = null;
    touchStartY.current = null;

    // Only trigger horizontal swipe if horizontal movement dominates vertical scroll
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (dx < 0) {
        setSwipeBanner('NEXT');
        nextTrack();
      } else {
        setSwipeBanner('PREV');
        previousTrack();
      }
      setTimeout(() => setSwipeBanner(null), 550);
    }
  };

  const isPlaying = playerState === 'PLAYING';
  const isBuffering = playerState === 'BUFFERING' || playerState === 'TUNING';

  const handleFavoriteClick = () => {
    setHeartPulse(true);
    toggleFavorite(currentTrack.id);
    setTimeout(() => setHeartPulse(false), 420);
  };

  return (
    <GlassPanel
      crt={preferences.crtEnabled}
      className="w-full mt-3 p-4 bg-gradient-to-b from-[#140A28]/90 to-[#090614]/95"
    >
      {/* Top Row: NOW PLAYING label + Cassette / Artwork Toggle */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono tracking-[0.25em] text-[#27E5FF] uppercase font-bold">
            NOW PLAYING
          </span>
          <span className="text-[10px] font-mono text-white/35">•</span>
          <span className="text-[10px] font-mono tracking-wider text-[#FF2DAA]">
            {currentStation.frequency} FM
          </span>
        </div>

        <button
          type="button"
          onClick={() =>
            updatePreferences({ cassetteMode: !preferences.cassetteMode })
          }
          className="px-2.5 py-1 rounded-full bg-white/5 border border-white/15 text-[10px] font-mono tracking-wider text-white/80 hover:border-[#27E5FF]/50 hover:text-white flex items-center gap-1.5 transition"
        >
          <Disc className="w-3 h-3 text-[#27E5FF]" />
          <span>{preferences.cassetteMode ? 'ARTWORK' : 'CASSETTE'}</span>
        </button>
      </div>

      {/* Artwork or Cassette Deck with Subtle State Visualizer */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative flex items-center justify-center my-1"
      >
        {/* Subtle Animated Glow Visualizer behind artwork */}
        {preferences.neonGlow && (
          <motion.div
            aria-hidden="true"
            animate={
              isPlaying
                ? {
                    scale: [1, 1.05, 1],
                    opacity: [0.32, 0.52, 0.32],
                  }
                : isBuffering
                ? {
                    rotate: [0, 180, 360],
                    opacity: 0.42,
                  }
                : { scale: 1, opacity: 0.15 }
            }
            transition={{
              duration: isBuffering ? 3 : 3.6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="pointer-events-none absolute w-60 h-60 rounded-full bg-gradient-to-tr from-[#FF2DAA] via-[#27E5FF] to-[#FF7849] blur-2xl"
          />
        )}

        {preferences.cassetteMode ? (
          <CassetteDeckGraphic
            stationFrequency={currentStation.frequency}
            stationShortName={currentStation.shortName}
            trackTitle={currentTrack.title}
            isPlaying={isPlaying}
          />
        ) : (
          <div className="relative w-full max-w-[270px] aspect-square rounded-[22px] overflow-hidden border border-[#27E5FF]/45 shadow-[0_12px_32px_rgba(0,0,0,0.85),0_0_16px_rgba(255,45,170,0.25)] bg-[#0B0617]">
            <img
              src={currentTrack.thumbnail}
              alt={currentTrack.title}
              className="w-full h-full object-cover"
              loading="eager"
            />
            {/* Cinematic Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#080713]/85 via-transparent to-[#080713]/30" />

            {/* Top Right Frequency Badge */}
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#080713]/85 backdrop-blur-md border border-[#27E5FF]/60 text-[11px] font-mono font-bold text-[#27E5FF] shadow-neon-cyan">
              {currentStation.frequency} FM
            </div>

            {/* Bottom Left Genre / Station Stamp */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <span className="px-2 py-0.5 rounded bg-[#FF2DAA]/25 border border-[#FF2DAA]/60 text-[10px] font-mono tracking-wider text-white uppercase">
                {currentStation.shortName}
              </span>
              <span className="text-[10px] font-mono tracking-widest text-white/75 uppercase">
                SWIPE ◀ ▶
              </span>
            </div>
          </div>
        )}

        {/* Swipe Feedback Toast */}
        <AnimatePresence>
          {swipeBanner && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-x-6 py-2.5 rounded-xl bg-[#080713]/95 border border-[#27E5FF] text-center font-mono text-xs tracking-[0.2em] text-[#27E5FF] shadow-neon-cyan z-20"
            >
              {swipeBanner === 'NEXT' ? 'NEXT FREQUENCY →' : '← PREVIOUS TRACK'}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Track Metadata */}
      <div className="mt-4 text-center px-2">
        <div className="text-[10px] font-mono tracking-[0.25em] text-white/45 uppercase">
          NOW PLAYING
        </div>
        <h2 className="mt-1 text-lg sm:text-xl font-bold text-white truncate">
          {currentTrack.title}
        </h2>
        <p className="text-xs sm:text-sm text-white/70 truncate mt-0.5">
          {currentTrack.artist}
        </p>
        <p className="text-[11px] font-mono tracking-[0.22em] text-[#FF2DAA] uppercase mt-1">
          {currentStation.shortName} {currentStation.frequency}
        </p>
      </div>

      {/* Seek Progress Bar */}
      <ProgressBar />

      {/* Main Transport Controls Row */}
      <div className="mt-4 flex items-center justify-between px-1 sm:px-3">
        <button
          type="button"
          onClick={toggleShuffle}
          aria-label={`Shuffle ${preferences.shuffle ? 'On' : 'Off'}`}
          aria-pressed={preferences.shuffle}
          className={`min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center border transition active:scale-95 ${
            preferences.shuffle
              ? 'bg-[#27E5FF]/20 border-[#27E5FF] text-[#27E5FF] shadow-neon-cyan'
              : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
          }`}
        >
          <Shuffle className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={previousTrack}
          aria-label="Previous Track"
          className="min-w-[48px] min-h-[48px] rounded-full bg-gradient-to-b from-[#23153C] to-[#10091E] border border-white/15 text-white flex items-center justify-center shadow-chrome-inset hover:border-[#27E5FF]/50 active:scale-95 transition"
        >
          <SkipBack className="w-5 h-5" />
        </button>

        {/* Huge 70px Circular Chrome/Neon Play/Pause Button */}
        <button
          type="button"
          onClick={togglePlayPause}
          aria-label={isPlaying ? 'Pause Broadcast' : 'Play Broadcast'}
          className="w-[70px] h-[70px] rounded-full bg-gradient-to-b from-[#2A1748] via-[#160A2B] to-[#0B0617] border-2 border-[#27E5FF] shadow-[0_0_24px_rgba(39,229,255,0.45),0_0_12px_rgba(255,45,170,0.4),inset_0_1px_2px_rgba(255,255,255,0.35)] flex items-center justify-center text-white active:scale-95 transition-transform"
        >
          {isPlaying ? (
            <Pause className="w-8 h-8 text-[#27E5FF] fill-[#27E5FF]" />
          ) : (
            <Play className="w-8 h-8 text-[#FF2DAA] fill-[#FF2DAA] ml-1" />
          )}
        </button>

        <button
          type="button"
          onClick={nextTrack}
          aria-label="Next Track"
          className="min-w-[48px] min-h-[48px] rounded-full bg-gradient-to-b from-[#23153C] to-[#10091E] border border-white/15 text-white flex items-center justify-center shadow-chrome-inset hover:border-[#27E5FF]/50 active:scale-95 transition"
        >
          <SkipForward className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={cycleRepeatMode}
          aria-label={`Repeat mode: ${preferences.repeatMode}`}
          className={`min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center border transition active:scale-95 ${
            preferences.repeatMode !== 'OFF'
              ? 'bg-[#FF2DAA]/20 border-[#FF2DAA] text-[#FF2DAA] shadow-neon-pink'
              : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
          }`}
        >
          {preferences.repeatMode === 'ONE' ? (
            <Repeat1 className="w-4 h-4" />
          ) : (
            <Repeat className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Secondary Hardware Bar: Favorite, Volume, Sleep Timer, Queue, Show Video */}
      <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between gap-1">
        {/* Favorite Heart with classy scale + neon pulse */}
        <motion.button
          type="button"
          onClick={handleFavoriteClick}
          animate={heartPulse ? { scale: [1, 1.28, 0.95, 1] } : { scale: 1 }}
          transition={{ duration: 0.35 }}
          aria-label={
            currentTrack.favorite ? 'Remove from Favorites' : 'Save to Favorites'
          }
          className={`min-h-[44px] min-w-[44px] px-3 rounded-xl border flex items-center justify-center gap-1.5 transition ${
            currentTrack.favorite
              ? 'bg-[#FF2DAA]/20 border-[#FF2DAA] text-[#FF2DAA] shadow-neon-pink'
              : 'bg-white/5 border-white/10 text-white/70 hover:text-white'
          }`}
        >
          <Heart
            className={`w-4 h-4 ${currentTrack.favorite ? 'fill-[#FF2DAA]' : ''}`}
          />
        </motion.button>

        {/* Volume Toggle */}
        <button
          type="button"
          onClick={() => setShowVolumePopover((v) => !v)}
          aria-label="Toggle Volume Slider"
          className={`min-h-[44px] min-w-[44px] px-3 rounded-xl border flex items-center justify-center gap-1.5 transition ${
            showVolumePopover
              ? 'bg-[#27E5FF]/20 border-[#27E5FF] text-[#27E5FF]'
              : 'bg-white/5 border-white/10 text-white/70 hover:text-white'
          }`}
        >
          {preferences.muted || preferences.volume === 0 ? (
            <VolumeX className="w-4 h-4 text-[#FF7849]" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </button>

        {/* Sleep Timer Trigger */}
        <button
          type="button"
          onClick={() => setSleepModalOpen(true)}
          aria-label="Configure Sleep Timer"
          className="min-h-[44px] min-w-[44px] px-3 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white flex items-center justify-center"
        >
          <Moon className="w-4 h-4" />
        </button>

        {/* Queue Trigger */}
        <button
          type="button"
          onClick={() => setQueueDrawerOpen(true)}
          aria-label="Open Station Queue"
          className="min-h-[44px] min-w-[44px] px-3 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white flex items-center justify-center"
        >
          <ListMusic className="w-4 h-4" />
        </button>

        {/* SHOW VIDEO Trigger */}
        <button
          type="button"
          onClick={() => setVideoModeOpen(true)}
          aria-label="Show Official YouTube Video Player"
          className="min-h-[44px] px-3 rounded-xl bg-white/5 border border-white/10 text-[11px] font-mono tracking-wider text-white/80 hover:border-[#27E5FF]/50 hover:text-[#27E5FF] flex items-center gap-1.5"
        >
          <Tv className="w-4 h-4 text-[#27E5FF]" />
          <span className="hidden xs:inline">SHOW VIDEO</span>
        </button>
      </div>

      {/* Expandable Volume Slider Row */}
      <AnimatePresence>
        {showVolumePopover && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 p-3 rounded-xl bg-[#090514] border border-white/10 flex items-center gap-3">
              <button
                type="button"
                onClick={toggleMute}
                aria-label={preferences.muted ? 'Unmute' : 'Mute'}
                className="text-white/75 hover:text-white"
              >
                {preferences.muted || preferences.volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-[#FF7849]" />
                ) : (
                  <Volume2 className="w-4 h-4 text-[#27E5FF]" />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={100}
                value={preferences.muted ? 0 : preferences.volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                aria-label="Volume level"
                className="flex-1 accent-[#27E5FF] h-1.5 rounded-lg cursor-pointer"
              />
              <span className="text-xs font-mono text-white/75 w-9 text-right tabular-nums">
                {preferences.muted ? 'MUTE' : `${preferences.volume}%`}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* START NIGHT DRIVE Full-Width Action Bar */}
      <button
        type="button"
        onClick={() => toggleNightDrive(true)}
        className="mt-3 w-full min-h-[46px] rounded-xl bg-gradient-to-r from-[#160A2B] via-[#241142] to-[#160A2B] border border-[#FF2DAA]/50 hover:border-[#27E5FF] text-xs font-mono font-bold tracking-[0.24em] text-white uppercase flex items-center justify-center gap-2.5 shadow-neon-pink active:scale-[0.99] transition"
      >
        <Car className="w-4 h-4 text-[#27E5FF]" />
        <span>START NIGHT DRIVE</span>
      </button>
    </GlassPanel>
  );
};
