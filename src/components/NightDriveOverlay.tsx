'use client';

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePlayer } from '@/player/PlayerProvider';
import { PalmSilhouetteSVG, RetroGrid } from '@/components/Atmosphere';
import { ProgressBar } from '@/components/NowPlayingCard';
import { Heart, Pause, Play, Radio, SkipBack, SkipForward, X } from 'lucide-react';

export const NightDriveOverlay: React.FC = () => {
  const {
    preferences,
    toggleNightDrive,
    currentStation,
    currentTrack,
    playerState,
    togglePlayPause,
    nextTrack,
    previousTrack,
    stepStation,
    toggleFavorite,
  } = usePlayer();

  const isPlaying = playerState === 'PLAYING';

  return (
    <AnimatePresence>
      {preferences.nightDrive && (
        <motion.div
          key="night-drive-mode"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[85] bg-[#05040B] flex flex-col justify-between p-5 sm:p-8 overflow-hidden select-none"
          role="dialog"
          aria-label="Night Drive Mode Dashboard"
        >
          {/* Deep Atmospheric Road Grid & Palm Silhouettes */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden"
          >
            <div
              className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[320px] h-[320px] rounded-full opacity-25 blur-[3px]"
              style={{
                background:
                  'linear-gradient(180deg, #FF7849 0%, #FF2DAA 60%, #160A2B 100%)',
              }}
            />
            <RetroGrid intense />
            <PalmSilhouetteSVG className="absolute -left-6 bottom-12 w-48 h-64 text-[#040309] opacity-90" />
            <PalmSilhouetteSVG
              flip
              className="absolute -right-6 bottom-12 w-48 h-64 text-[#040309] opacity-90"
            />
          </div>

          {/* Top Bar */}
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="font-display font-black italic text-xl tracking-[0.25em] bg-gradient-to-r from-[#27E5FF] to-[#FF2DAA] bg-clip-text text-transparent">
                VICEWAVE
              </div>
              <div className="text-[10px] font-mono tracking-[0.32em] text-[#27E5FF] uppercase">
                NIGHT DRIVE • EYES ON THE ROAD
              </div>
            </div>

            <button
              type="button"
              onClick={() => toggleNightDrive(false)}
              aria-label="Exit Night Drive Mode"
              className="min-h-[48px] px-4 rounded-full bg-white/5 border border-white/15 text-xs font-mono tracking-wider text-white/85 hover:border-[#27E5FF] flex items-center gap-2 active:scale-95 transition"
            >
              <span>EXIT DRIVE</span>
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Center Dashboard Content (Responsive Portrait & Landscape Split) */}
          <div className="relative z-10 my-auto w-full max-w-3xl mx-auto flex flex-col landscape:flex-row items-center justify-center gap-6 landscape:gap-12">
            {/* LEFT in Landscape / TOP in Portrait: Giant Frequency + Compact Artwork */}
            <div className="flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#160A2B]/90 border border-[#FF2DAA]/40 text-[11px] font-mono tracking-[0.28em] text-[#FF2DAA] uppercase mb-2">
                <Radio className="w-3.5 h-3.5" />
                <span>{currentStation.name}</span>
              </div>

              <div className="font-mono font-black text-7xl sm:text-8xl tracking-tighter text-white drop-shadow-[0_0_26px_rgba(39,229,255,0.55)] tabular-nums">
                {currentStation.frequency}
                <span className="text-xl font-bold text-[#27E5FF] ml-2">FM</span>
              </div>

              <div className="mt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => stepStation('PREV')}
                  className="min-h-[48px] px-4 rounded-xl bg-white/5 border border-white/15 text-xs font-mono text-white/80 active:scale-95"
                >
                  ◀ STATION
                </button>
                <button
                  type="button"
                  onClick={() => stepStation('NEXT')}
                  className="min-h-[48px] px-4 rounded-xl bg-white/5 border border-white/15 text-xs font-mono text-white/80 active:scale-95"
                >
                  STATION ▶
                </button>
              </div>
            </div>

            {/* RIGHT in Landscape / BOTTOM in Portrait: Track + Oversized Controls */}
            <div className="w-full max-w-md flex flex-col items-center text-center">
              <div className="flex items-center gap-3 mb-2">
                <img
                  src={currentTrack.thumbnail}
                  alt={currentTrack.title}
                  className="w-14 h-14 rounded-xl object-cover border border-[#27E5FF]/50"
                />
                <div className="text-left max-w-[240px]">
                  <h2 className="text-xl font-bold text-white truncate">
                    {currentTrack.title}
                  </h2>
                  <p className="text-sm text-white/65 truncate">
                    {currentTrack.artist}
                  </p>
                </div>
              </div>

              <div className="w-full px-2">
                <ProgressBar />
              </div>

              {/* Oversized Car-Mount Controls */}
              <div className="mt-6 flex items-center justify-center gap-6">
                <button
                  type="button"
                  onClick={previousTrack}
                  aria-label="Previous Track"
                  className="w-16 h-16 rounded-2xl bg-[#140B26] border border-white/15 flex items-center justify-center text-white active:scale-95"
                >
                  <SkipBack className="w-7 h-7" />
                </button>

                <button
                  type="button"
                  onClick={togglePlayPause}
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                  className="w-24 h-24 rounded-full bg-gradient-to-b from-[#2A1648] to-[#0E071B] border-2 border-[#27E5FF] shadow-[0_0_32px_rgba(39,229,255,0.55)] flex items-center justify-center text-white active:scale-95"
                >
                  {isPlaying ? (
                    <Pause className="w-11 h-11 text-[#27E5FF] fill-[#27E5FF]" />
                  ) : (
                    <Play className="w-11 h-11 text-[#FF2DAA] fill-[#FF2DAA] ml-1" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={nextTrack}
                  aria-label="Next Track"
                  className="w-16 h-16 rounded-2xl bg-[#140B26] border border-white/15 flex items-center justify-center text-white active:scale-95"
                >
                  <SkipForward className="w-7 h-7" />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Minimal Status Footer */}
          <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-3 text-xs font-mono text-white/50">
            <span>NO ADS. JUST MUSIC.</span>
            <button
              type="button"
              onClick={() => toggleFavorite(currentTrack.id)}
              className={`min-h-[44px] px-4 rounded-xl border flex items-center gap-2 ${
                currentTrack.favorite
                  ? 'bg-[#FF2DAA]/20 border-[#FF2DAA] text-[#FF2DAA]'
                  : 'bg-white/5 border-white/10 text-white/75'
              }`}
            >
              <Heart
                className={`w-4 h-4 ${currentTrack.favorite ? 'fill-[#FF2DAA]' : ''}`}
              />
              <span>{currentTrack.favorite ? 'SAVED' : 'SAVE'}</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
