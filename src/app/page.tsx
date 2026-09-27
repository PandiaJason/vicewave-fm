'use client';

import React from 'react';
import { RadioHeader, RadioDisplay } from '@/components/RadioConsole';
import { NowPlayingCard } from '@/components/NowPlayingCard';
import { RecentlyOnAirCarousel } from '@/components/TrackComponents';

export default function RadioPage() {
  return (
    <div className="w-full flex flex-col items-center">
      {/* Top Radio Brand Header & Live Signal Meter */}
      <RadioHeader />

      {/* Tinted Smoked Glass FM Receiver Console */}
      <RadioDisplay />

      {/* Now Playing Artwork / Cassette Deck & Main Transport Controls */}
      <NowPlayingCard />

      {/* Recently On Air Horizontal Carousel */}
      <RecentlyOnAirCarousel />

      {/* Subtle Brand Promise Footer */}
      <div className="mt-6 mb-2 text-center select-none">
        <p className="text-[10px] font-mono tracking-[0.28em] text-white/40 uppercase">
          NO ADS. NO CLUTTER. JUST THE AIRWAVES.
        </p>
      </div>
    </div>
  );
}
