'use client';

import React from 'react';

interface ViceWaveLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  showPromise?: boolean;
  className?: string;
}

export const ViceWaveLogo: React.FC<ViceWaveLogoProps> = ({
  size = 'md',
  showTagline = true,
  showPromise = false,
  className = '',
}) => {
  const titleClasses = {
    sm: 'text-lg tracking-[0.18em]',
    md: 'text-2xl tracking-[0.22em]',
    lg: 'text-4xl sm:text-5xl tracking-[0.24em]',
  }[size];

  const fmClasses = {
    sm: 'text-[10px] px-1.5 py-0.5',
    md: 'text-xs px-2 py-0.5',
    lg: 'text-sm px-2.5 py-0.5',
  }[size];

  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
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
