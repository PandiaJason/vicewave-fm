'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { usePlayer } from '@/player/PlayerProvider';
import { Track } from '@/player/playerTypes';
import { formatTime } from '@/components/NowPlayingCard';
import { Download, Heart, MoreVertical, Play, Radio, Tv } from 'lucide-react';

export const Equalizer: React.FC<{ active?: boolean }> = ({ active = true }) => (
  <span
    className="inline-flex items-end gap-[2px] h-3.5 px-1"
    aria-label={active ? 'Now Playing Equalizer' : 'Paused Equalizer'}
  >
    {[0.4, 0.9, 0.6, 1].map((h, i) => (
      <motion.span
        key={i}
        animate={
          active
            ? {
                scaleY: [h, 1 - h * 0.4, h],
              }
            : { scaleY: 0.3 }
        }
        transition={{
          duration: 0.55 + i * 0.1,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{ originY: 1 }}
        className={`w-[2.5px] h-3 rounded-t-[1px] ${
          i % 2 === 0 ? 'bg-[#27E5FF]' : 'bg-[#FF2DAA]'
        }`}
      />
    ))}
  </span>
);

export const TrackCard: React.FC<{ track: Track }> = ({ track }) => {
  const {
    currentTrack,
    playerState,
    stations,
    selectTrack,
    selectStation,
    toggleFavorite,
    setVideoModeOpen,
  } = usePlayer();

  const [menuOpen, setMenuOpen] = useState(false);

  const isCurrent = currentTrack.id === track.id;
  const isPlaying = isCurrent && playerState === 'PLAYING';
  const station = stations.find((s) => s.id === track.stationId);

  return (
    <div
      className={`relative rounded-2xl p-3 transition-all border backdrop-blur-md ${
        isCurrent
          ? 'bg-gradient-to-r from-[#21103B]/95 to-[#120A26]/95 border-[#27E5FF] shadow-neon-cyan'
          : 'bg-[#110922]/80 border-white/[0.08] hover:border-white/20'
      }`}
    >
      <div className="flex items-center gap-3">
        {/* Thumbnail with Play/Equalizer overlay */}
        <button
          type="button"
          onClick={() => selectTrack(track.id, true)}
          aria-label={`Play ${track.title} by ${track.artist}`}
          className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-white/15 group focus:outline-none focus:ring-2 focus:ring-[#27E5FF]"
        >
          <img
            src={track.thumbnail}
            alt={track.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div
            className={`absolute inset-0 flex items-center justify-center transition-opacity ${
              isCurrent
                ? 'bg-[#080713]/65 opacity-100'
                : 'bg-[#080713]/55 opacity-0 group-hover:opacity-100'
            }`}
          >
            {isCurrent ? (
              <Equalizer active={isPlaying} />
            ) : (
              <Play className="w-5 h-5 text-white fill-white" />
            )}
          </div>
        </button>

        {/* Track Title, Artist, Station Frequency & Duration */}
        <button
          type="button"
          onClick={() => selectTrack(track.id, true)}
          className="flex-1 min-w-0 text-left focus:outline-none"
        >
          <div className="flex items-center gap-1.5">
            {isCurrent && (
              <span className="px-1.5 py-0.5 rounded bg-[#27E5FF]/20 border border-[#27E5FF]/50 text-[9px] font-mono text-[#27E5FF] uppercase">
                ON AIR
              </span>
            )}
            <h3
              className={`text-sm font-bold truncate ${
                isCurrent ? 'text-[#27E5FF]' : 'text-white'
              }`}
            >
              {track.title}
            </h3>
          </div>
          <p className="text-xs text-white/65 truncate mt-0.5">{track.artist}</p>
          <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[10px] font-mono text-white/45">
            <span className="text-[#FF2DAA] font-semibold">
              {station?.frequency || '98.3'} FM
            </span>
            <span>•</span>
            <span>{formatTime(track.duration)}</span>
            <span>•</span>
            <span className="text-[#27E5FF]/85">
              {track.startTimeLabel}–{track.endTimeLabel}
            </span>
            <span>•</span>
            <span className="uppercase">{track.genre}</span>
          </div>
        </button>

        {/* Actions: Favorite Heart + More Menu */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => toggleFavorite(track.id)}
            aria-label={track.favorite ? 'Remove from Favorites' : 'Add to Favorites'}
            className={`min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center transition active:scale-90 ${
              track.favorite
                ? 'text-[#FF2DAA]'
                : 'text-white/45 hover:text-white/80'
            }`}
          >
            <Heart className={`w-4 h-4 ${track.favorite ? 'fill-[#FF2DAA]' : ''}`} />
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="More track options"
            className="min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center text-white/50 hover:text-white"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expandable More Menu */}
      {menuOpen && (
        <div className="mt-2.5 pt-2.5 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <button
            type="button"
            onClick={() => {
              selectStation(track.stationId);
              setMenuOpen(false);
            }}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 flex items-center gap-1.5"
          >
            <Radio className="w-3.5 h-3.5 text-[#27E5FF]" />
            <span>TUNE {station?.frequency} FM</span>
          </button>

          <button
            type="button"
            onClick={() => {
              selectTrack(track.id, true);
              setVideoModeOpen(true);
              setMenuOpen(false);
            }}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 flex items-center gap-1.5"
          >
            <Tv className="w-3.5 h-3.5 text-[#FF2DAA]" />
            <span>SHOW VIDEO</span>
          </button>

          {track.downloadAllowed && track.sourceType === 'local' ? (
            <button
              type="button"
              className="px-3 py-1.5 rounded-lg bg-[#27E5FF]/15 border border-[#27E5FF]/40 text-[#27E5FF] flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>SAVE OFFLINE</span>
            </button>
          ) : (
            <span className="text-[10px] text-white/35 px-2">
              STREAM ONLY • YOUTUBE API
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export const RecentlyOnAirCarousel: React.FC = () => {
  const { history, tracks, stations, selectTrack, currentTrack } = usePlayer();

  const recentTracks = history
    .map((h) => tracks.find((t) => t.id === h.trackId))
    .filter((t): t is Track => Boolean(t));

  if (recentTracks.length === 0) return null;

  return (
    <section className="w-full mt-4" aria-label="Recently On Air">
      <div className="flex items-center justify-between px-1 mb-2">
        <span className="text-[11px] font-mono font-bold tracking-[0.24em] text-white/75 uppercase">
          RECENTLY ON AIR
        </span>
        <span className="text-[10px] font-mono text-[#27E5FF]/75">
          {recentTracks.length} LOGGED
        </span>
      </div>

      <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-2">
        {recentTracks.map((track) => {
          const st = stations.find((s) => s.id === track.stationId);
          const isCurrent = currentTrack.id === track.id;
          return (
            <button
              key={track.id}
              type="button"
              onClick={() => selectTrack(track.id, true)}
              className={`w-44 shrink-0 p-2.5 rounded-xl border text-left transition flex items-center gap-2.5 ${
                isCurrent
                  ? 'bg-[#1D0E36]/90 border-[#FF2DAA] shadow-neon-pink'
                  : 'bg-[#100820]/85 border-white/10 hover:border-white/25'
              }`}
            >
              <img
                src={track.thumbnail}
                alt={track.title}
                className="w-11 h-11 rounded-lg object-cover shrink-0 border border-white/10"
                loading="lazy"
              />
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-white truncate">
                  {track.title}
                </div>
                <div className="text-[10px] text-white/55 truncate mt-0.5">
                  {track.artist}
                </div>
                <div className="text-[9px] font-mono text-[#27E5FF] mt-0.5">
                  {st?.frequency || '98.3'} FM
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
