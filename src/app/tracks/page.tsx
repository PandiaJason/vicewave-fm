'use client';

import React, { useMemo, useState } from 'react';
import { usePlayer } from '@/player/PlayerProvider';
import { GenreType } from '@/player/playerTypes';
import { TrackCard } from '@/components/TrackComponents';
import { GlassPanel, PalmSilhouetteSVG } from '@/components/Atmosphere';
import { Radio, Search, X } from 'lucide-react';

const GENRE_FILTERS: GenreType[] = ['ALL', 'POP', 'ROCK', 'SYNTH', 'FUNK', 'SOFT'];

export default function TracksPage() {
  const { tracks, preferences } = usePlayer();
  const [query, setQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<GenreType>('ALL');

  const filteredTracks = useMemo(() => {
    return tracks.filter((track) => {
      const matchesGenre =
        selectedGenre === 'ALL' || track.genre === selectedGenre;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        track.title.toLowerCase().includes(q) ||
        track.artist.toLowerCase().includes(q) ||
        track.genre.toLowerCase().includes(q);
      return matchesGenre && matchesQuery;
    });
  }, [tracks, selectedGenre, query]);

  return (
    <div className="w-full flex flex-col pt-3">
      {/* Page Header */}
      <header className="mb-4 px-1">
        <div className="text-[10px] font-mono tracking-[0.28em] text-[#27E5FF] uppercase">
          VICEWAVE ROTATION CATALOG
        </div>
        <h1 className="text-2xl sm:text-3xl font-display font-black italic tracking-[0.18em] text-white uppercase mt-0.5">
          THE AIRWAVES
        </h1>
        <p className="text-xs text-white/65 mt-1">
          Every track currently in rotation.
        </p>
      </header>

      {/* Search Bar */}
      <div className="relative mb-3">
        <Search className="w-4 h-4 text-[#27E5FF] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="SEARCH THE AIRWAVES..."
          aria-label="Search the airwaves"
          className="w-full min-h-[46px] pl-10 pr-10 rounded-xl bg-[#110922]/90 border border-white/15 focus:border-[#27E5FF] focus:outline-none text-xs font-mono tracking-wider text-white placeholder:text-white/40 shadow-inner"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            aria-label="Clear search"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-white/60 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Genre Filter Chips */}
      <div
        className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 mb-3"
        role="tablist"
        aria-label="Genre filter chips"
      >
        {GENRE_FILTERS.map((genre) => {
          const active = selectedGenre === genre;
          return (
            <button
              key={genre}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setSelectedGenre(genre)}
              className={`min-h-[40px] px-4 rounded-full font-mono text-xs font-bold tracking-[0.18em] border transition shrink-0 ${
                active
                  ? 'bg-gradient-to-r from-[#FF2DAA]/30 to-[#27E5FF]/30 border-[#27E5FF] text-white shadow-neon-cyan'
                  : 'bg-[#110922]/80 border-white/10 text-white/60 hover:text-white hover:border-white/25'
              }`}
            >
              {genre}
            </button>
          );
        })}
      </div>

      {/* Track List or Search Empty State */}
      {filteredTracks.length > 0 ? (
        <div className="space-y-2.5">
          {filteredTracks.map((track) => (
            <TrackCard key={track.id} track={track} />
          ))}
        </div>
      ) : (
        <GlassPanel
          crt={preferences.crtEnabled}
          className="p-8 mt-2 flex flex-col items-center text-center relative overflow-hidden"
        >
          <PalmSilhouetteSVG className="absolute -right-6 -bottom-4 w-32 h-40 text-white/[0.04]" />
          <div className="w-14 h-14 rounded-full bg-[#160A2B] border border-[#27E5FF]/40 flex items-center justify-center text-[#27E5FF] shadow-neon-cyan mb-4 animate-pulse">
            <Radio className="w-6 h-6" />
          </div>
          <h2 className="text-base font-mono font-bold tracking-[0.25em] text-white uppercase">
            NO SIGNAL
          </h2>
          <p className="text-xs text-white/70 mt-1">
            Nothing found on this frequency.
          </p>
          <p className="text-[11px] font-mono text-[#27E5FF]/80 mt-1">
            Try another search.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setSelectedGenre('ALL');
            }}
            className="mt-4 min-h-[44px] px-5 rounded-xl bg-white/5 border border-white/15 text-xs font-mono tracking-widest text-white hover:border-[#27E5FF]"
          >
            RESET FILTER
          </button>
        </GlassPanel>
      )}
    </div>
  );
}
