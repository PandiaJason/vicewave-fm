'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { usePlayer } from '@/player/PlayerProvider';
import { ViceWaveLogo } from '@/components/ViceWaveLogo';
import { GlassPanel } from '@/components/Atmosphere';
import { Download, WifiOff } from 'lucide-react';

export const SignalMeter: React.FC = () => {
  const { playerState, isOffline } = usePlayer();

  if (isOffline || playerState === 'OFFLINE') {
    return (
      <div
        className="inline-flex items-center gap-1.5 text-[10px] font-mono text-[#FF7849] tracking-widest uppercase"
        aria-label="Offline: No Signal"
      >
        <WifiOff className="w-3 h-3" />
        <span>× NO SIGNAL</span>
      </div>
    );
  }

  const isStreaming = playerState === 'PLAYING';
  const isBuffering = playerState === 'BUFFERING' || playerState === 'TUNING';

  return (
    <div
      className="inline-flex items-end gap-[3px] h-3.5 px-1.5 py-0.5 rounded bg-black/40 border border-white/10"
      aria-label={`Signal status: ${playerState}`}
    >
      {[0.35, 0.58, 0.8, 1].map((baseHeight, idx) => (
        <motion.span
          key={idx}
          animate={
            isStreaming
              ? {
                  scaleY: [baseHeight, Math.min(1, baseHeight + 0.25), baseHeight],
                  opacity: [0.85, 1, 0.85],
                }
              : isBuffering
              ? {
                  scaleY: idx % 2 === 0 ? [0.3, 0.7, 0.3] : [0.7, 0.3, 0.7],
                  opacity: [0.5, 1, 0.5],
                }
              : { scaleY: baseHeight * 0.7, opacity: 0.45 }
          }
          transition={{
            duration: isBuffering ? 0.5 : 1.1 + idx * 0.15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ originY: 1 }}
          className={`w-[3px] h-2.5 rounded-t-[1px] ${
            idx >= 2 ? 'bg-[#27E5FF]' : 'bg-[#FF2DAA]'
          }`}
        />
      ))}
      <span className="ml-1 text-[9px] font-mono tracking-wider text-white/70">
        {isBuffering ? 'TUNE' : 'SIGNAL'}
      </span>
    </div>
  );
};

export const RadioHeader: React.FC = () => {
  const { playerState, sleepTimer, setSleepModalOpen } = usePlayer();

  const formatRemaining = (secs: number | null) => {
    if (secs === null) return '';
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const triggerInstallModal = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('vicewave:open-install'));
    }
  };

  return (
    <header className="w-full pt-1 pb-3 flex flex-col items-center">
      <div className="w-full flex items-center justify-between px-1 mb-2 gap-1.5">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#160A2B]/90 border border-white/10">
          <span
            className={`w-2 h-2 rounded-full ${
              playerState === 'PLAYING'
                ? 'bg-[#FF2DAA] shadow-[0_0_8px_#FF2DAA] animate-ping-slow'
                : 'bg-[#27E5FF]/60'
            }`}
          />
          <span className="text-[9px] sm:text-[10px] font-mono tracking-[0.16em] text-white/85 uppercase">
            LIVE FROM THE COAST
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {sleepTimer.option !== 'OFF' && (
            <button
              type="button"
              onClick={() => setSleepModalOpen(true)}
              className="px-2 py-0.5 rounded-full bg-[#FF2DAA]/20 border border-[#FF2DAA]/50 text-[9px] font-mono text-[#FF2DAA] tracking-wider"
            >
              {sleepTimer.option === 'END_OF_TRACK'
                ? 'SLEEP: END'
                : `SLEEP ${formatRemaining(sleepTimer.remainingSeconds)}`}
            </button>
          )}

          {/* Direct 1-Tap Mobile PWA Download Trigger */}
          <button
            type="button"
            onClick={triggerInstallModal}
            aria-label="Download ViceWave FM Mobile App"
            className="px-2.5 py-1 rounded-full bg-gradient-to-r from-[#FF2DAA]/30 to-[#27E5FF]/30 border border-[#27E5FF]/60 text-[9px] font-mono font-bold tracking-wider text-white flex items-center gap-1 shadow-neon-cyan active:scale-95 transition"
          >
            <Download className="w-3 h-3 text-[#27E5FF]" />
            <span>GET APP</span>
          </button>

          <SignalMeter />
        </div>
      </div>

      <ViceWaveLogo size="md" showTagline={true} showPromise={false} />
    </header>
  );
};

export const FrequencyTuner: React.FC = () => {
  const { stations, currentStation, selectStation, stepStation } = usePlayer();
  const touchStartX = useRef<number | null>(null);

  const minFreq = 88;
  const maxFreq = 108;
  const markerPercent = Math.max(
    4,
    Math.min(96, ((currentStation.numericFreq - minFreq) / (maxFreq - minFreq)) * 100)
  );

  const dialNumbers = [88, 90, 92, 94, 96, 98, 100, 102, 104, 106, 108];

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(deltaX) > 36) {
      stepStation(deltaX < 0 ? 'NEXT' : 'PREV');
    }
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="w-full mt-3 select-none"
      role="region"
      aria-label="FM Frequency Tuner"
    >
      <div className="relative h-12 rounded-xl bg-[#070510]/95 border border-white/10 px-3 flex flex-col justify-between py-1.5 overflow-hidden shadow-inner">
        <div className="flex items-center justify-between text-[10px] font-mono text-white/50 px-1">
          {dialNumbers.map((num) => (
            <span
              key={num}
              className={
                Math.abs(currentStation.numericFreq - num) < 1.2
                  ? 'text-[#27E5FF] font-bold'
                  : ''
              }
            >
              {num}
            </span>
          ))}
        </div>

        <div className="relative flex items-end justify-between h-3 px-1">
          {Array.from({ length: 41 }).map((_, idx) => {
            const isMajor = idx % 4 === 0;
            return (
              <span
                key={idx}
                className={`w-[1px] ${
                  isMajor ? 'h-2.5 bg-white/35' : 'h-1.5 bg-white/15'
                }`}
              />
            );
          })}
        </div>

        {stations.map((st) => {
          const pos = ((st.numericFreq - minFreq) / (maxFreq - minFreq)) * 100;
          const isCurrent = st.id === currentStation.id;
          return (
            <button
              key={st.id}
              type="button"
              onClick={() => selectStation(st.id)}
              style={{ left: `${pos}%` }}
              aria-label={`Tune to ${st.frequency} ${st.name}`}
              className="absolute inset-y-0 -translate-x-1/2 w-7 flex items-center justify-center group focus:outline-none"
            >
              <span
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  isCurrent
                    ? 'bg-[#FF2DAA] scale-125 shadow-[0_0_8px_#FF2DAA]'
                    : 'bg-[#27E5FF]/40 group-hover:bg-[#27E5FF]'
                }`}
              />
            </button>
          );
        })}

        <motion.div
          animate={{ left: `${markerPercent}%` }}
          transition={{ type: 'spring', stiffness: 260, damping: 26 }}
          className="pointer-events-none absolute inset-y-0 -translate-x-1/2 flex flex-col items-center justify-between"
        >
          <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-[#FF2DAA]" />
          <div className="w-[2px] flex-1 bg-gradient-to-b from-[#FF2DAA] via-[#27E5FF] to-[#FF2DAA] shadow-[0_0_10px_#27E5FF]" />
          <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[6px] border-b-[#27E5FF]" />
        </motion.div>
      </div>
    </div>
  );
};

export const RadioKnob: React.FC = () => {
  const { stepStation, currentStation } = usePlayer();
  const [angle, setAngle] = useState(0);
  const dragStartX = useRef<number | null>(null);

  const rotateStep = (dir: 'NEXT' | 'PREV') => {
    setAngle((prev) => prev + (dir === 'NEXT' ? 36 : -36));
    stepStation(dir);
  };

  return (
    <div className="flex items-center justify-between gap-3 mt-2.5 pt-2 border-t border-white/[0.06]">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-mono tracking-[0.2em] text-white/45 uppercase">
          ROTARY TUNER
        </span>
        <span className="text-[10px] font-mono text-[#27E5FF]/80">
          {currentStation.channelCode}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => rotateStep('PREV')}
          aria-label="Tune previous frequency"
          className="min-h-[44px] px-3 rounded-lg bg-[#0B0718] border border-white/10 text-[11px] font-mono text-white/75 hover:text-white hover:border-[#27E5FF]/50 active:scale-95 transition"
        >
          ◀ TUNE
        </button>

        <button
          type="button"
          onClick={() => rotateStep('NEXT')}
          onPointerDown={(e) => {
            dragStartX.current = e.clientX;
          }}
          onPointerUp={(e) => {
            if (dragStartX.current !== null) {
              const diff = e.clientX - dragStartX.current;
              dragStartX.current = null;
              if (Math.abs(diff) > 16) {
                rotateStep(diff > 0 ? 'NEXT' : 'PREV');
              }
            }
          }}
          aria-label="Rotary frequency knob: tap or drag to tune"
          title="Tap or drag clockwise/counterclockwise to tune"
          className="relative w-11 h-11 rounded-full bg-gradient-to-b from-[#342357] via-[#170E2B] to-[#090512] border border-white/25 shadow-[0_2px_10px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.3)] flex items-center justify-center active:scale-95 transition-transform"
        >
          <motion.div
            animate={{ rotate: angle }}
            transition={{ type: 'spring', stiffness: 220, damping: 20 }}
            className="w-8 h-8 rounded-full bg-[#0B0616] border border-white/10 flex items-start justify-center pt-1"
          >
            <span className="w-1 h-2.5 rounded-full bg-[#27E5FF] shadow-[0_0_6px_#27E5FF]" />
          </motion.div>
        </button>

        <button
          type="button"
          onClick={() => rotateStep('NEXT')}
          aria-label="Tune next frequency"
          className="min-h-[44px] px-3 rounded-lg bg-[#0B0718] border border-white/10 text-[11px] font-mono text-white/75 hover:text-white hover:border-[#27E5FF]/50 active:scale-95 transition"
        >
          TUNE ▶
        </button>
      </div>
    </div>
  );
};

export const StationSelector: React.FC = () => {
  const { stations, currentStation, selectStation } = usePlayer();

  return (
    <div
      className="w-full flex items-center gap-1.5 overflow-x-auto no-scrollbar py-2 mt-1"
      role="tablist"
      aria-label="Preset Radio Stations"
    >
      {stations.map((st) => {
        const active = st.id === currentStation.id;
        return (
          <button
            key={st.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => selectStation(st.id)}
            className={`min-h-[44px] shrink-0 px-3 py-1.5 rounded-xl border text-left transition-all flex flex-col justify-center ${
              active
                ? 'bg-gradient-to-b from-[#251242] to-[#120824] border-[#FF2DAA] shadow-neon-pink text-white'
                : 'bg-[#0C071A]/85 border-white/10 text-white/65 hover:border-white/25 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <span
                className={`text-xs font-mono font-bold ${
                  active ? 'text-[#27E5FF]' : 'text-white/80'
                }`}
              >
                {st.frequency}
              </span>
              <span className="text-[10px] font-bold tracking-wider uppercase">
                {st.shortName}
              </span>
            </div>
            <span className="text-[9px] font-mono text-white/45 uppercase truncate max-w-[96px]">
              {st.genre}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export const RadioDisplay: React.FC = () => {
  const { currentStation, playerState, preferences, tuningTransition } = usePlayer();

  const shownFreq = tuningTransition.active
    ? tuningTransition.displayFreq
    : currentStation.frequency;

  return (
    <GlassPanel
      crt={preferences.crtEnabled}
      className="w-full p-4 bg-gradient-to-b from-[#130926]/95 to-[#090614]/95 border border-white/15"
    >
      <div className="flex items-center justify-between text-[10px] font-mono tracking-[0.2em] text-white/55 border-b border-white/[0.07] pb-2">
        <div className="flex items-center gap-2">
          <span className="px-1.5 py-0.5 rounded bg-[#27E5FF]/15 border border-[#27E5FF]/40 text-[#27E5FF] font-bold">
            FM
          </span>
          <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-white/80">
            STEREO
          </span>
          <span className="hidden xs:inline text-white/45">MEM</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[#FF2DAA] font-bold">{currentStation.channelCode}</span>
          <span className="px-1.5 py-0.5 rounded bg-[#FF2DAA]/15 border border-[#FF2DAA]/40 text-white/90">
            {tuningTransition.active
              ? tuningTransition.phase === 'ROLLING'
                ? 'TUNING...'
                : 'SIGNAL LOCKED'
              : playerState === 'PLAYING'
              ? '● ON AIR'
              : playerState === 'BUFFERING'
              ? 'TUNING...'
              : 'STANDBY'}
          </span>
        </div>
      </div>

      <div className="py-3 flex flex-col items-center justify-center relative">
        <div className="flex items-baseline justify-center gap-2">
          <motion.span
            key={shownFreq}
            initial={{ opacity: 0.75, y: -2 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.12 }}
            className={`font-mono font-black text-5xl sm:text-6xl tracking-tight tabular-nums text-white ${
              preferences.neonGlow
                ? 'drop-shadow-[0_0_20px_rgba(39,229,255,0.45)]'
                : ''
            }`}
          >
            {shownFreq}
          </motion.span>
          <div className="flex flex-col items-start">
            <span className="text-sm font-mono font-bold text-[#27E5FF] tracking-widest">
              MHz
            </span>
            <span className="text-[10px] font-mono text-[#FF2DAA] tracking-widest">
              ST
            </span>
          </div>
        </div>

        <div className="mt-1 text-center">
          <div className="text-base sm:text-lg font-display font-extrabold tracking-[0.22em] text-white uppercase">
            {currentStation.name}
          </div>
          <div className="text-[11px] font-mono tracking-[0.26em] text-[#27E5FF]/85 uppercase mt-0.5">
            {currentStation.tagline}
          </div>
        </div>
      </div>

      <FrequencyTuner />

      {preferences.tuningEffects && <RadioKnob />}

      <StationSelector />
    </GlassPanel>
  );
};
