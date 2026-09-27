'use client';

import React from 'react';
import Link from 'next/link';
import { usePlayer } from '@/player/PlayerProvider';
import { TrackCard } from '@/components/TrackComponents';
import { GlassPanel, PalmSilhouetteSVG } from '@/components/Atmosphere';
import { Heart, Radio } from 'lucide-react';

export default function FavoritesPage() {
  const { tracks, favorites, preferences } = usePlayer();

  const favoriteTracks = tracks.filter(
    (t) => favorites.includes(t.id) || t.favorite
  );

  return (
    <div className="w-full flex flex-col pt-3">
      <header className="mb-4 px-1">
        <div className="text-[10px] font-mono tracking-[0.28em] text-[#FF2DAA] uppercase">
          SAVED ON THIS DEVICE
        </div>
        <h1 className="text-2xl sm:text-3xl font-display font-black italic tracking-[0.16em] text-white uppercase mt-0.5">
          FAVORITE FREQUENCIES
        </h1>
        <p className="text-xs text-white/65 mt-1">
          The songs you keep coming back to.
        </p>
      </header>

      {favoriteTracks.length > 0 ? (
        <div className="space-y-2.5">
          {favoriteTracks.map((track) => (
            <TrackCard key={track.id} track={track} />
          ))}
        </div>
      ) : (
        <GlassPanel
          crt={preferences.crtEnabled}
          className="p-8 mt-3 flex flex-col items-center text-center relative overflow-hidden"
        >
          <PalmSilhouetteSVG className="absolute -left-6 -bottom-4 w-36 h-44 text-white/[0.04]" />
          <PalmSilhouetteSVG
            flip
            className="absolute -right-6 -bottom-4 w-36 h-44 text-white/[0.04]"
          />

          <div className="w-16 h-16 rounded-full bg-[#180A2D] border-2 border-[#FF2DAA] shadow-neon-pink flex items-center justify-center text-[#FF2DAA] mb-4">
            <Heart className="w-8 h-8" />
          </div>

          <h2 className="text-base font-mono font-bold tracking-[0.24em] text-white uppercase">
            NOTHING SAVED YET
          </h2>
          <p className="text-xs text-white/70 mt-2 max-w-[240px] leading-relaxed">
            When something hits different, tap the heart.
          </p>

          <Link
            href="/"
            className="mt-5 min-h-[46px] px-6 rounded-xl bg-gradient-to-r from-[#FF2DAA]/25 to-[#27E5FF]/25 border border-[#27E5FF] text-xs font-mono font-bold tracking-[0.2em] text-white inline-flex items-center gap-2 shadow-neon-cyan active:scale-95 transition"
          >
            <Radio className="w-4 h-4 text-[#27E5FF]" />
            <span>RETURN TO RADIO</span>
          </Link>
        </GlassPanel>
      )}
    </div>
  );
}
