'use client';

import React from 'react';

interface ViceWaveLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  showPromise?: boolean;
  showEmblem?: boolean;
  className?: string;
}

export const ViceWaveLogo: React.FC<ViceWaveLogoProps> = ({
  size = 'md',
  showTagline = true,
  showPromise = false,
  showEmblem = true,
  className = '',
}) => {
  const emblemSize = {
    sm: 'w-20 h-auto',
    md: 'w-28 sm:w-32 h-auto',
    lg: 'w-40 sm:w-48 h-auto',
  }[size];

  const titleClasses = {
    sm: 'text-base tracking-[0.18em]',
    md: 'text-xl sm:text-2xl tracking-[0.22em]',
    lg: 'text-3xl sm:text-4xl tracking-[0.24em]',
  }[size];

  const fmClasses = {
    sm: 'text-[9px] px-1.5 py-0.5',
    md: 'text-[11px] px-2 py-0.5',
    lg: 'text-xs px-2.5 py-0.5',
  }[size];

  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
      {showEmblem && (
        <img
          src="/logo.png"
          alt="ViceWave FM Cassette Emblem"
          className={`${emblemSize} mb-1.5 drop-shadow-[0_0_18px_rgba(255,45,170,0.45)]`}
        />
      )}

      <div className="flex items-baseline gap-2">
        <span
          className={`font-display font-black italic uppercase bg-gradient-to-r from-[#27E5FF] via-[#FFF4FA] to-[#FF2DAA] bg-clip-text text-transparent drop-shadow-[0_0_14px_rgba(255,45,170,0.35)] ${titleClasses}`}
        >
          VICEWAVE
        </span>
        <span
          className={`font-mono font-bold uppercase tracking-[0.2em] rounded bg-[#160A2B] border border-[#27E5FF]/50 text-[#27E5FF] shadow-[0_0_8px_rgba(39,229,255,0.25)] ${fmClasses}`}
        >
          FM
        </span>
      </div>

      {showTagline && (
        <p className="mt-1 text-[10px] sm:text-[11px] font-mono tracking-[0.3em] text-white/70 uppercase">
          80s • MIAMI • ALL NIGHT
        </p>
      )}

      {showPromise && (
        <p className="mt-1 text-[9px] font-mono tracking-[0.28em] text-[#27E5FF]/90 uppercase">
          NO ADS. JUST MUSIC.
        </p>
      )}
    </div>
  );
};
