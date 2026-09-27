'use client';

import React from 'react';

export const PalmSilhouetteSVG: React.FC<{ className?: string; flip?: boolean }> = ({
  className = 'w-36 h-48',
  flip = false,
}) => (
  <svg
    viewBox="0 0 200 260"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} ${flip ? '-scale-x-100' : ''} pointer-events-none select-none`}
    aria-hidden="true"
  >
    {/* Curved coastal palm trunk */}
    <path
      d="M92 260C95 210 104 160 118 92L126 94C116 162 110 212 108 260H92Z"
      fill="currentColor"
    />
    {/* Fronds */}
    <path
      d="M122 92C92 65 48 64 14 84C45 55 86 50 122 82Z"
      fill="currentColor"
    />
    <path
      d="M122 90C85 48 42 32 8 42C44 20 88 28 124 84Z"
      fill="currentColor"
    />
    <path
      d="M123 88C105 42 78 16 48 10C84 8 114 34 126 84Z"
      fill="currentColor"
    />
    <path
      d="M124 88C136 40 164 18 194 22C164 30 142 52 127 90Z"
      fill="currentColor"
    />
    <path
      d="M125 91C152 58 182 56 198 72C174 68 148 74 126 95Z"
      fill="currentColor"
    />
    <path
      d="M124 94C150 84 176 92 192 116C168 100 146 96 123 98Z"
      fill="currentColor"
    />
    <path
      d="M120 94C90 86 58 98 32 124C60 94 92 84 121 98Z"
      fill="currentColor"
    />
  </svg>
);

export const RetroGrid: React.FC<{ intense?: boolean }> = ({ intense = false }) => (
  <div
    aria-hidden="true"
    className={`pointer-events-none absolute inset-x-0 bottom-0 h-56 overflow-hidden transition-opacity duration-500 ${
      intense ? 'opacity-45' : 'opacity-20'
    }`}
  >
    {/* Horizon glow line */}
    <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#FF2DAA]/60 to-transparent shadow-[0_0_12px_#FF2DAA]" />
    {/* Perspective grid plane */}
    <div
      className="w-full h-full origin-top"
      style={{
        transform: 'perspective(220px) rotateX(68deg) scaleX(1.8)',
        backgroundImage: `
          linear-gradient(to right, rgba(39, 229, 255, 0.22) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 45, 170, 0.22) 1px, transparent 1px)
        `,
        backgroundSize: '36px 28px',
      }}
    />
    {/* Bottom vignette mask */}
    <div className="absolute inset-0 bg-gradient-to-t from-[#080713] via-transparent to-[#080713]/70" />
  </div>
);

export const SunsetBackground: React.FC<{
  animated?: boolean;
  nightDrive?: boolean;
}> = ({ animated = true, nightDrive = false }) => (
  <div
    aria-hidden="true"
    className="pointer-events-none fixed inset-0 overflow-hidden z-0 bg-[#080713]"
  >
    {/* Upper deep purple sky gradient */}
    <div
      className="absolute inset-0"
      style={{
        background:
          'radial-gradient(circle at 50% 18%, rgba(22, 10, 43, 0.95) 0%, rgba(8, 7, 19, 1) 72%)',
      }}
    />

    {/* Enormous soft 80s sunset disc behind distant skyline */}
    <div
      className={`absolute left-1/2 -translate-x-1/2 rounded-full transition-all duration-700 ${
        nightDrive
          ? 'top-[22%] w-[340px] h-[340px] sm:w-[460px] sm:h-[460px] opacity-35 blur-[2px]'
          : 'top-[14%] w-[280px] h-[280px] sm:w-[420px] sm:h-[420px] opacity-25 blur-[4px]'
      } ${animated ? 'animate-pulse-slow' : ''}`}
      style={{
        background:
          'linear-gradient(180deg, #FFB347 0%, #FF7849 28%, #FF2DAA 65%, #160A2B 100%)',
        maskImage:
          'repeating-linear-gradient(to bottom, black 0px, black 10px, transparent 10px, transparent 13px)',
        WebkitMaskImage:
          'repeating-linear-gradient(to bottom, black 0px, black 10px, transparent 10px, transparent 13px)',
      }}
    />

    {/* Distant Miami skyline silhouette */}
    <svg
      viewBox="0 0 1200 180"
      preserveAspectRatio="none"
      className="absolute bottom-44 inset-x-0 w-full h-24 text-[#0b081a] opacity-90"
    >
      <path
        fill="currentColor"
        d="M0,180 L0,140 L45,140 L45,112 L80,112 L80,145 L120,145 L120,88 L165,88 L165,135 L210,135 L210,98 L248,98 L248,68 L285,68 L285,130 L340,130 L340,104 L390,104 L390,148 L440,148 L440,75 L490,75 L490,125 L540,125 L540,56 L585,56 L585,132 L640,132 L640,92 L690,92 L690,140 L740,140 L740,84 L790,84 L790,126 L850,126 L850,64 L895,64 L895,136 L950,136 L950,105 L1010,105 L1010,144 L1065,144 L1065,96 L1115,96 L1115,138 L1200,138 L1200,180 Z"
      />
    </svg>

    {/* Perspective Retro Grid */}
    <RetroGrid intense={nightDrive} />

    {/* Palm silhouettes flanking the coastal highway */}
    <PalmSilhouetteSVG
      className={`absolute -left-8 bottom-20 w-44 h-60 text-[#070510] transition-opacity duration-500 ${
        nightDrive ? 'opacity-95' : 'opacity-65'
      }`}
    />
    <PalmSilhouetteSVG
      flip
      className={`absolute -right-8 bottom-16 w-48 h-64 text-[#070510] transition-opacity duration-500 ${
        nightDrive ? 'opacity-95' : 'opacity-65'
      }`}
    />
  </div>
);

export const GlassPanel: React.FC<{
  children: React.ReactNode;
  className?: string;
  crt?: boolean;
}> = ({ children, className = '', crt = false }) => (
  <div
    className={`relative rounded-2xl bg-[#110922]/85 backdrop-blur-md border border-white/[0.08] shadow-smoked-glass overflow-hidden ${className}`}
  >
    {crt && (
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 opacity-[0.035]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(255,255,255,0.9) 0px, rgba(255,255,255,0.9) 1px, transparent 1px, transparent 3px)',
        }}
      />
    )}
    {children}
  </div>
);

export const NeonButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'pink' | 'cyan' | 'chrome' | 'ghost';
    active?: boolean;
  }
> = ({ children, className = '', variant = 'chrome', active = false, ...props }) => {
  const styles = {
    pink: active
      ? 'bg-[#FF2DAA]/25 border-[#FF2DAA] text-white shadow-neon-pink'
      : 'bg-[#160A2B]/80 border-[#FF2DAA]/40 text-white/90 hover:border-[#FF2DAA]',
    cyan: active
      ? 'bg-[#27E5FF]/20 border-[#27E5FF] text-white shadow-neon-cyan'
      : 'bg-[#160A2B]/80 border-[#27E5FF]/40 text-white/90 hover:border-[#27E5FF]',
    chrome: active
      ? 'bg-gradient-to-b from-[#291947] to-[#120924] border-[#27E5FF]/70 text-white shadow-neon-cyan'
      : 'bg-gradient-to-b from-[#21153B] to-[#0E081C] border-white/15 text-white/80 hover:border-white/30 shadow-chrome-inset',
    ghost: active
      ? 'bg-white/10 border-white/25 text-[#27E5FF]'
      : 'bg-transparent border-transparent text-white/65 hover:text-white',
  }[variant];

  return (
    <button
      type="button"
      className={`min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-xl border transition-all duration-150 active:translate-y-[1px] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#27E5FF] ${styles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
