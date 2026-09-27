'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePlayer } from '@/player/PlayerProvider';
import { ViceWaveLogo } from '@/components/ViceWaveLogo';
import { PalmSilhouetteSVG } from '@/components/Atmosphere';

const FREQ_SEQUENCE = ['88.1', '91.7', '94.5', '96.9', '98.3'];

export const StartupOverlay: React.FC = () => {
  const { startupComplete, setStartupComplete, preferences } = usePlayer();
  const [freqIdx, setFreqIdx] = useState(0);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    if (startupComplete) return;

    if (preferences.reducedMotion) {
      setStartupComplete(true);
      return;
    }

    const stepInterval = setInterval(() => {
      setFreqIdx((prev) => {
        if (prev < FREQ_SEQUENCE.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 150);

    const lockTimer = setTimeout(() => {
      setLocked(true);
    }, 700);

    const finishTimer = setTimeout(() => {
      setStartupComplete(true);
    }, 1350);

    return () => {
      clearInterval(stepInterval);
      clearTimeout(lockTimer);
      clearTimeout(finishTimer);
    };
  }, [startupComplete, setStartupComplete, preferences.reducedMotion]);

  return (
    <AnimatePresence>
      {!startupComplete && (
        <motion.div
          key="startup-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.28, ease: 'easeOut' } }}
          onClick={() => setStartupComplete(true)}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#080713] px-6 overflow-hidden cursor-pointer"
          role="status"
          aria-live="polite"
          aria-label="Tuning into ViceWave FM 98.3"
        >
          {/* Subtle Palm Silhouettes in background */}
          <PalmSilhouetteSVG className="absolute -left-6 bottom-6 w-40 h-52 text-[#120824] opacity-70" />
          <PalmSilhouetteSVG
            flip
            className="absolute -right-6 bottom-6 w-40 h-52 text-[#120824] opacity-70"
          />

          {/* Expanding thin cyan horizontal line */}
          <motion.div
            initial={{ scaleX: 0.05, opacity: 0.4 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="w-64 sm:w-80 h-[1.5px] bg-gradient-to-r from-transparent via-[#27E5FF] to-transparent shadow-[0_0_14px_#27E5FF] mb-6"
          />

          {/* Status header */}
          <div className="text-[10px] font-mono tracking-[0.32em] uppercase text-[#27E5FF] mb-3">
            {locked ? 'SIGNAL LOCKED' : 'SEARCHING THE AIRWAVES...'}
          </div>

          {/* Rolling Digital Frequency */}
          <div className="font-mono font-black text-5xl sm:text-6xl tracking-tight text-white drop-shadow-[0_0_18px_rgba(39,229,255,0.45)] tabular-nums">
            {FREQ_SEQUENCE[freqIdx]}
            <span className="text-base font-bold text-[#FF2DAA] ml-1.5">FM</span>
          </div>

          {/* Brand reveal once locked */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: locked ? 1 : 0.15, y: locked ? 0 : 4 }}
            transition={{ duration: 0.25 }}
            className="mt-6 flex flex-col items-center"
          >
            <ViceWaveLogo size="md" showTagline showPromise />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
