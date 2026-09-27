'use client';

import React from 'react';
import { Radio, Tv, X } from 'lucide-react';

interface YouTubePlayerProps {
  videoModeOpen: boolean;
  onCloseVideoMode: () => void;
  stationFrequency: string;
  stationName: string;
  trackTitle: string;
  trackArtist: string;
}

/**
 * Persistent YouTube IFrame Player wrapper.
 * When `videoModeOpen` is false, it stays inside the active viewport at 1% opacity (2x2px)
 * rather than 0% off-screen so mobile browsers (iOS Safari / Android Chrome) never
 * throttle or suspend the embedded audio pipeline during background playback.
 */
export const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
  videoModeOpen,
  onCloseVideoMode,
  stationFrequency,
  stationName,
  trackTitle,
  trackArtist,
}) => {
  return (
    <div
      aria-hidden={!videoModeOpen}
      className={
        videoModeOpen
          ? 'fixed inset-0 z-[90] flex flex-col items-center justify-center bg-[#080713]/95 backdrop-blur-xl p-4'
          : 'fixed bottom-1 right-1 w-[2px] h-[2px] opacity-[0.01] pointer-events-none overflow-hidden z-0'
      }
    >
      {videoModeOpen && (
        <div className="w-full max-w-md mb-4 flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#160A2B] border border-[#27E5FF]/40 text-[#27E5FF]">
              <Tv className="w-4 h-4" />
            </span>
            <div>
              <div className="text-[10px] font-mono tracking-[0.2em] text-[#27E5FF] uppercase">
                VIDEO BROADCAST • {stationFrequency} FM
              </div>
              <div className="text-xs font-semibold text-white truncate max-w-[210px]">
                {stationName}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onCloseVideoMode}
            className="min-h-[44px] px-4 py-2 rounded-full bg-gradient-to-r from-[#FF2DAA]/20 to-[#27E5FF]/20 border border-[#27E5FF]/50 text-xs font-mono tracking-wider text-white flex items-center gap-2 active:scale-95 transition-transform"
          >
            <Radio className="w-3.5 h-3.5 text-[#27E5FF]" />
            <span>RETURN TO RADIO</span>
            <X className="w-3.5 h-3.5 text-white/70" />
          </button>
        </div>
      )}

      <div
        className={
          videoModeOpen
            ? 'w-full max-w-md aspect-video rounded-2xl overflow-hidden border border-[#27E5FF]/40 shadow-neon-cyan bg-black'
            : 'w-full h-full'
        }
      >
        <div id="vicewave-yt-player" className="w-full h-full" />
      </div>

      {videoModeOpen && (
        <div className="w-full max-w-md mt-4 p-4 rounded-xl bg-[#160A2B]/80 border border-white/10 text-center">
          <p className="text-sm font-semibold text-white truncate">{trackTitle}</p>
          <p className="text-xs text-white/60 mt-0.5 truncate">{trackArtist}</p>
          <p className="text-[10px] font-mono tracking-[0.18em] text-white/40 mt-3 uppercase">
            OFFICIAL YOUTUBE EMBED • NO APP ADS ADDED
          </p>
        </div>
      )}
    </div>
  );
};
