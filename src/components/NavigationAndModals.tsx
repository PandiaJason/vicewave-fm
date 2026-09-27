'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { usePlayer } from '@/player/PlayerProvider';
import { SleepTimerOption } from '@/player/playerTypes';
import { SunsetBackground } from '@/components/Atmosphere';
import { ViceWaveLogo } from '@/components/ViceWaveLogo';
import { ProgressBar } from '@/components/NowPlayingCard';
import { StartupOverlay } from '@/components/StartupOverlay';
import { NightDriveOverlay } from '@/components/NightDriveOverlay';
import { Equalizer } from '@/components/TrackComponents';
import {
  AlertTriangle,
  Download,
  Heart,
  Moon,
  MoreVertical,
  Music,
  Pause,
  Play,
  PlusSquare,
  Radio,
  RefreshCw,
  Settings,
  Share,
  SkipForward,
  Smartphone,
  WifiOff,
  X,
} from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

declare global {
  interface Window {
    __deferredPwaPrompt?: BeforeInstallPromptEvent | null;
  }
}

export const MiniPlayer: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const {
    currentTrack,
    currentStation,
    playerState,
    togglePlayPause,
    nextTrack,
  } = usePlayer();

  if (pathname === '/') return null;

  const isPlaying = playerState === 'PLAYING';

  return (
    <div className="fixed bottom-[76px] inset-x-0 z-40 px-3 pointer-events-none">
      <div className="max-w-[450px] mx-auto pointer-events-auto rounded-2xl bg-[#120924]/95 backdrop-blur-xl border border-[#27E5FF]/40 shadow-[0_8px_28px_rgba(0,0,0,0.85),0_0_15px_rgba(39,229,255,0.2)] overflow-hidden">
        <div className="p-2.5 flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="flex items-center gap-3 flex-1 min-w-0 text-left focus:outline-none"
          >
            <div className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0 border border-[#FF2DAA]/50">
              <img
                src={currentTrack.thumbnail}
                alt={currentTrack.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono font-bold text-[#27E5FF]">
                  {currentStation.frequency} FM
                </span>
                <span className="text-white/30">•</span>
                <span className="text-[10px] font-mono text-[#FF2DAA] truncate">
                  {currentStation.shortName}
                </span>
              </div>
              <div className="text-xs font-bold text-white truncate">
                {currentTrack.title}
              </div>
              <div className="text-[10px] text-white/60 truncate">
                {currentTrack.artist}
              </div>
            </div>
          </button>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={togglePlayPause}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              className="w-11 h-11 rounded-xl bg-[#1D0F36] border border-[#27E5FF]/50 flex items-center justify-center text-white active:scale-95 transition"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-[#27E5FF] fill-[#27E5FF]" />
              ) : (
                <Play className="w-5 h-5 text-[#FF2DAA] fill-[#FF2DAA] ml-0.5" />
              )}
            </button>
            <button
              type="button"
              onClick={nextTrack}
              aria-label="Next Track"
              className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/80 hover:text-white active:scale-95 transition"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>
        </div>
        <ProgressBar compact />
      </div>
    </div>
  );
};

export const BottomNavigation: React.FC = () => {
  const pathname = usePathname();
  const { favorites } = usePlayer();

  const navItems = [
    { href: '/', label: 'RADIO', icon: Radio },
    { href: '/tracks', label: 'TRACKS', icon: Music },
    { href: '/favorites', label: 'FAVORITES', icon: Heart, badge: favorites.length },
    { href: '/settings', label: 'SETTINGS', icon: Settings },
  ];

  return (
    <nav
      aria-label="Primary Bottom Navigation"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      className="fixed bottom-0 inset-x-0 z-40 px-3 pb-2 pt-1 pointer-events-none"
    >
      <div className="max-w-[450px] mx-auto pointer-events-auto h-16 rounded-2xl bg-[#0D071B]/90 backdrop-blur-xl border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.9)] grid grid-cols-4 px-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={`relative my-1.5 rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
                active
                  ? 'text-white bg-gradient-to-b from-[#251244] to-[#130924] border border-[#27E5FF]/50 shadow-neon-cyan'
                  : 'text-white/55 hover:text-white/85'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-4 h-4 ${
                    active ? 'text-[#27E5FF]' : 'text-current'
                  }`}
                />
                {typeof item.badge === 'number' && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 px-1 min-w-[14px] h-[14px] rounded-full bg-[#FF2DAA] text-[8px] font-mono font-bold text-white flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[9px] font-mono font-bold tracking-[0.16em]">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export const SleepTimerModal: React.FC = () => {
  const {
    sleepModalOpen,
    setSleepModalOpen,
    sleepTimer,
    setSleepTimerOption,
  } = usePlayer();

  const options: { value: SleepTimerOption; label: string }[] = [
    { value: 'OFF', label: 'OFF' },
    { value: '15', label: '15 MIN' },
    { value: '30', label: '30 MIN' },
    { value: '45', label: '45 MIN' },
    { value: '60', label: '60 MIN' },
    { value: 'END_OF_TRACK', label: 'END OF TRACK' },
  ];

  const formatCountdown = (secs: number | null) => {
    if (secs === null) return '';
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      {sleepModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div className="w-full max-w-sm rounded-2xl bg-[#120924] border border-[#27E5FF]/40 shadow-neon-cyan p-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-[#27E5FF]" />
                <h3 className="text-sm font-mono font-bold tracking-[0.2em] text-white uppercase">
                  SLEEP TIMER
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSleepModalOpen(false)}
                aria-label="Close Sleep Timer"
                className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-white/70 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {sleepTimer.option !== 'OFF' && (
              <div className="mb-4 p-3 rounded-xl bg-[#FF2DAA]/15 border border-[#FF2DAA]/50 text-center">
                <p className="text-xs font-mono font-bold tracking-[0.2em] text-[#FF2DAA]">
                  {sleepTimer.option === 'END_OF_TRACK'
                    ? 'SLEEP AT END OF CURRENT TRACK'
                    : `SLEEP IN ${formatCountdown(sleepTimer.remainingSeconds)}`}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2.5">
              {options.map((opt) => {
                const active = sleepTimer.option === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setSleepTimerOption(opt.value);
                      setSleepModalOpen(false);
                    }}
                    className={`min-h-[46px] rounded-xl border text-xs font-mono font-bold tracking-wider transition ${
                      active
                        ? 'bg-[#27E5FF]/20 border-[#27E5FF] text-[#27E5FF] shadow-neon-cyan'
                        : 'bg-white/5 border-white/10 text-white/75 hover:border-white/30'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const QueueDrawer: React.FC = () => {
  const {
    queueDrawerOpen,
    setQueueDrawerOpen,
    currentStation,
    tracks,
    currentTrack,
    selectTrack,
  } = usePlayer();

  const stationTracks = tracks.filter((t) =>
    currentStation.trackIds.includes(t.id)
  );

  return (
    <AnimatePresence>
      {queueDrawerOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-4"
        >
          <motion.div
            initial={{ y: 40 }}
            animate={{ y: 0 }}
            exit={{ y: 40 }}
            className="w-full max-w-md max-h-[80vh] rounded-2xl bg-[#120924] border border-[#FF2DAA]/45 shadow-neon-pink p-4 flex flex-col"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
              <div>
                <div className="text-[10px] font-mono tracking-[0.22em] text-[#27E5FF] uppercase">
                  STATION ROTATION • {currentStation.frequency} FM
                </div>
                <h3 className="text-sm font-bold text-white uppercase">
                  {currentStation.name} QUEUE
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setQueueDrawerOpen(false)}
                aria-label="Close Queue"
                className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-white/70 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {stationTracks.map((track) => {
                const isCurrent = track.id === currentTrack.id;
                return (
                  <button
                    key={track.id}
                    type="button"
                    onClick={() => {
                      selectTrack(track.id, false);
                      setQueueDrawerOpen(false);
                    }}
                    className={`w-full p-2.5 rounded-xl border text-left flex items-center gap-3 transition ${
                      isCurrent
                        ? 'bg-[#251244] border-[#27E5FF] text-white'
                        : 'bg-white/5 border-white/10 text-white/80 hover:border-white/25'
                    }`}
                  >
                    <img
                      src={track.thumbnail}
                      alt={track.title}
                      className="w-11 h-11 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold truncate">
                        {track.title}
                      </div>
                      <div className="text-[10px] text-white/55 truncate">
                        {track.artist}
                      </div>
                    </div>
                    {isCurrent && <Equalizer active />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const OfflineAndErrorBanners: React.FC = () => {
  const { isOffline, playerState, retryPlayback, nextTrack } = usePlayer();

  if (isOffline || playerState === 'OFFLINE') {
    return (
      <div
        role="alert"
        className="w-full mb-3 p-4 rounded-2xl bg-[#1B0B2E]/95 border border-[#FF7849] shadow-lg text-center"
      >
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#FF7849]/20 text-[#FF7849] mb-2">
          <WifiOff className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-mono font-bold tracking-[0.22em] text-white uppercase">
          YOU&apos;RE OFF THE AIR
        </h3>
        <p className="text-xs text-white/70 mt-1">
          Streaming needs an internet connection. Your favorites and history are still here.
        </p>
        <button
          type="button"
          onClick={retryPlayback}
          className="mt-3 min-h-[44px] px-5 rounded-xl bg-[#FF7849]/25 border border-[#FF7849] text-xs font-mono font-bold tracking-widest text-white inline-flex items-center gap-2 active:scale-95"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>RETRY SIGNAL</span>
        </button>
      </div>
    );
  }

  if (playerState === 'ERROR') {
    return (
      <div
        role="alert"
        className="w-full mb-3 p-4 rounded-2xl bg-[#1B0B2E]/95 border border-[#FF2DAA] shadow-neon-pink text-center"
      >
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#FF2DAA]/20 text-[#FF2DAA] mb-2">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-mono font-bold tracking-[0.22em] text-white uppercase">
          SIGNAL LOST
        </h3>
        <p className="text-xs text-white/70 mt-1">
          We couldn&apos;t tune into this track.
        </p>
        <div className="mt-3 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={retryPlayback}
            className="min-h-[44px] px-4 rounded-xl bg-[#27E5FF]/20 border border-[#27E5FF] text-xs font-mono font-bold text-white"
          >
            TRY AGAIN
          </button>
          <button
            type="button"
            onClick={nextTrack}
            className="min-h-[44px] px-4 rounded-xl bg-[#FF2DAA]/20 border border-[#FF2DAA] text-xs font-mono font-bold text-white"
          >
            SKIP TRACK
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export const TopMobilePwaBar: React.FC<{
  onDownloadClick: () => void;
  onDismiss: () => void;
}> = ({ onDownloadClick, onDismiss }) => {
  return (
    <div className="w-full mb-2.5 p-2.5 rounded-2xl bg-gradient-to-r from-[#230E3F]/95 via-[#130826]/95 to-[#230E3F]/95 border border-[#27E5FF]/60 shadow-neon-cyan flex items-center justify-between gap-2">
      <div className="flex items-center gap-2.5 min-w-0">
        <img
          src="/logo.png"
          alt="ViceWave FM"
          className="w-10 h-8 object-contain shrink-0 rounded bg-[#080713] p-0.5 border border-[#FF2DAA]/40"
        />
        <div className="min-w-0">
          <div className="text-[10px] font-mono font-bold tracking-[0.16em] text-[#27E5FF] uppercase truncate">
            VICEWAVE FM MOBILE APP
          </div>
          <div className="text-[11px] text-white/80 truncate">
            Download fullscreen PWA to your phone
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={onDownloadClick}
          className="min-h-[38px] px-3 rounded-xl bg-gradient-to-r from-[#FF2DAA] to-[#27E5FF] text-[10px] font-mono font-bold tracking-wider text-white flex items-center gap-1.5 shadow-neon-pink active:scale-95 transition"
        >
          <Download className="w-3.5 h-3.5" />
          <span>DOWNLOAD</span>
        </button>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Hide top download banner"
          className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/55 hover:text-white"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export const InstallPrompt: React.FC<{ renderTopBarOnly?: boolean }> = ({
  renderTopBarOnly = false,
}) => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [bannerVisible, setBannerVisible] = useState(false);
  const [guideModalOpen, setGuideModalOpen] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone);
    setIsStandalone(standalone);

    const ua = window.navigator.userAgent.toLowerCase();
    const iosDevice = /iphone|ipad|ipod/.test(ua);
    setIsIOS(iosDevice);

    if (window.__deferredPwaPrompt) {
      setDeferredPrompt(window.__deferredPwaPrompt);
    }

    if (!standalone) {
      setBannerVisible(true);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const syncDeferred = () => {
      if (window.__deferredPwaPrompt) {
        setDeferredPrompt(window.__deferredPwaPrompt);
        setBannerVisible(true);
      }
    };

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      const evt = e as BeforeInstallPromptEvent;
      window.__deferredPwaPrompt = evt;
      setDeferredPrompt(evt);
      setBannerVisible(true);
    };

    const handleOpenInstallRequest = async () => {
      const promptEvt = deferredPrompt || window.__deferredPwaPrompt;
      if (promptEvt) {
        await promptEvt.prompt();
        const choice = await promptEvt.userChoice;
        if (choice.outcome === 'accepted') {
          window.__deferredPwaPrompt = null;
          setDeferredPrompt(null);
          setBannerVisible(false);
        }
      } else {
        setGuideModalOpen(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('vicewave:pwa-ready', syncDeferred);
    window.addEventListener('vicewave:open-install', handleOpenInstallRequest);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('vicewave:pwa-ready', syncDeferred);
      window.removeEventListener('vicewave:open-install', handleOpenInstallRequest);
    };
  }, [deferredPrompt]);

  const handleDismiss = () => {
    setBannerVisible(false);
  };

  const handleInstallClick = async () => {
    const promptEvt = deferredPrompt || window.__deferredPwaPrompt;
    if (promptEvt) {
      await promptEvt.prompt();
      const choice = await promptEvt.userChoice;
      if (choice.outcome === 'accepted') {
        window.__deferredPwaPrompt = null;
        setDeferredPrompt(null);
        setBannerVisible(false);
      }
    } else {
      setGuideModalOpen(true);
    }
  };

  if (isStandalone) return null;

  if (renderTopBarOnly) {
    return bannerVisible ? (
      <TopMobilePwaBar
        onDownloadClick={handleInstallClick}
        onDismiss={handleDismiss}
      />
    ) : null;
  }

  return (
    <>
      <AnimatePresence>
        {bannerVisible && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="w-full mt-4 p-4 rounded-2xl bg-gradient-to-r from-[#1D0D36]/95 via-[#130826]/95 to-[#1D0D36]/95 border border-[#27E5FF]/55 shadow-neon-cyan"
          >
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="ViceWave FM App Icon"
                className="w-14 h-11 object-contain shrink-0 rounded-lg bg-[#080713] p-1 border border-[#FF2DAA]/50"
              />
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-mono font-bold tracking-[0.2em] text-[#27E5FF] uppercase">
                  TAKE THE NIGHT WITH YOU
                </div>
                <p className="text-xs text-white/80 mt-0.5 leading-snug">
                  Download ViceWave FM as a standalone mobile app for a fullscreen radio experience.
                </p>
              </div>
            </div>

            <div className="mt-3.5 flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleInstallClick}
                className="flex-1 min-h-[46px] px-4 rounded-xl bg-gradient-to-r from-[#FF2DAA] via-[#FF3DCE] to-[#27E5FF] text-xs font-mono font-bold tracking-[0.16em] text-white flex items-center justify-center gap-2 shadow-neon-pink active:scale-95 transition"
              >
                <Download className="w-4 h-4" />
                <span>DOWNLOAD PWA APP</span>
              </button>
              <button
                type="button"
                onClick={handleDismiss}
                className="min-h-[46px] px-4 rounded-xl bg-white/5 border border-white/15 text-xs font-mono text-white/65 hover:text-white"
              >
                NOT NOW
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {guideModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[95] bg-black/85 backdrop-blur-lg flex items-end sm:items-center justify-center p-4"
          >
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              exit={{ y: 50 }}
              className="w-full max-w-md rounded-3xl bg-[#120924] border border-[#27E5FF]/60 shadow-neon-cyan p-5 text-white"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <Smartphone className="w-5 h-5 text-[#27E5FF]" />
                  <div>
                    <div className="text-[10px] font-mono tracking-[0.22em] text-[#27E5FF] uppercase">
                      DOWNLOADABLE PWA APP
                    </div>
                    <h3 className="text-sm font-bold uppercase">
                      INSTALL VICEWAVE FM
                    </h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setGuideModalOpen(false)}
                  aria-label="Close install instructions"
                  className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-white/70 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#080713] border border-white/10 mb-4">
                <img
                  src="/logo.png"
                  alt="ViceWave FM"
                  className="w-16 h-12 object-contain"
                />
                <div>
                  <div className="font-display font-black italic text-sm tracking-[0.18em] text-white">
                    VICEWAVE FM
                  </div>
                  <div className="text-[10px] font-mono text-[#FF2DAA] tracking-widest">
                    80s • MIAMI • ALL NIGHT
                  </div>
                  <div className="text-[10px] font-mono text-white/50 mt-0.5">
                    Standalone Fullscreen PWA • No Ads
                  </div>
                </div>
              </div>

              {isIOS ? (
                <div className="space-y-3 text-xs">
                  <div className="text-[10px] font-mono tracking-[0.2em] text-[#27E5FF] uppercase">
                    IPHONE / IPAD (SAFARI) DOWNLOAD STEPS:
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-[#27E5FF]/20 border border-[#27E5FF] flex items-center justify-center text-[#27E5FF] shrink-0">
                      <Share className="w-4 h-4" />
                    </span>
                    <p className="text-white/85 leading-relaxed">
                      <strong>1.</strong> Tap the <strong>Share</strong> button at the bottom of Safari.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-[#FF2DAA]/20 border border-[#FF2DAA] flex items-center justify-center text-[#FF2DAA] shrink-0">
                      <PlusSquare className="w-4 h-4" />
                    </span>
                    <p className="text-white/85 leading-relaxed">
                      <strong>2.</strong> Scroll down and tap <strong>&ldquo;Add to Home Screen&rdquo;</strong>, then tap <strong>Add</strong>.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 text-xs">
                  <div className="text-[10px] font-mono tracking-[0.2em] text-[#27E5FF] uppercase">
                    ANDROID / CHROME DOWNLOAD STEPS:
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-[#27E5FF]/20 border border-[#27E5FF] flex items-center justify-center text-[#27E5FF] shrink-0">
                      <MoreVertical className="w-4 h-4" />
                    </span>
                    <p className="text-white/85 leading-relaxed">
                      <strong>1.</strong> Tap the browser <strong>Menu (⋮)</strong> in the top-right corner (or Share on iOS).
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-[#FF2DAA]/20 border border-[#FF2DAA] flex items-center justify-center text-[#FF2DAA] shrink-0">
                      <Download className="w-4 h-4" />
                    </span>
                    <p className="text-white/85 leading-relaxed">
                      <strong>2.</strong> Tap <strong>&ldquo;Install app&rdquo;</strong> or <strong>&ldquo;Add to Home screen&rdquo;</strong> to download the app onto your phone.
                    </p>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => setGuideModalOpen(false)}
                className="mt-5 w-full min-h-[46px] rounded-xl bg-gradient-to-r from-[#FF2DAA] to-[#27E5FF] text-xs font-mono font-bold tracking-[0.2em] text-white uppercase"
              >
                GOT IT • BACK TO RADIO
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export const AppShell: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const {
    preferences,
    currentStation,
    tracks,
    history,
    currentTrack,
    selectTrack,
    selectStation,
    stations,
  } = usePlayer();

  const upNextTracks = tracks
    .filter((t) => currentStation.trackIds.includes(t.id))
    .slice(0, 5);

  const recentTracks = history
    .map((h) => tracks.find((t) => t.id === h.trackId))
    .filter(Boolean)
    .slice(0, 5);

  return (
    <div
      style={{
        paddingTop: 'env(safe-area-inset-top)',
      }}
      className="relative min-h-screen w-full overflow-x-hidden bg-[#080713] text-white flex flex-col"
    >
      <SunsetBackground
        animated={preferences.backgroundAnimation && !preferences.reducedMotion}
        nightDrive={preferences.nightDrive}
      />

      <StartupOverlay />

      <NightDriveOverlay />

      <SleepTimerModal />
      <QueueDrawer />

      <div className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 pt-2 pb-36 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <aside className="hidden lg:flex lg:col-span-3 flex-col gap-5 sticky top-8 pt-4">
          <div className="p-5 rounded-2xl bg-[#110922]/85 backdrop-blur-md border border-white/10 shadow-smoked-glass">
            <ViceWaveLogo
              size="md"
              showTagline
              showPromise
              className="items-start"
            />
            <p className="mt-4 text-xs text-white/65 leading-relaxed">
              Broadcasting uninterrupted 1980s coastal synth, pop, funk, and midnight rock directly from the ocean boulevard.
            </p>
            <div className="mt-4 pt-3 border-t border-white/10 text-[10px] font-mono tracking-[0.22em] text-[#27E5FF] uppercase">
              NO ADS. NO CLUTTER. JUST THE AIRWAVES.
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#110922]/85 backdrop-blur-md border border-white/10 shadow-smoked-glass">
            <div className="text-[10px] font-mono tracking-[0.22em] text-white/45 uppercase mb-2">
              STATION DIRECTORY
            </div>
            <div className="space-y-2">
              {stations.map((st) => {
                const active = st.id === currentStation.id;
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => selectStation(st.id)}
                    className={`w-full p-2.5 rounded-xl border text-left transition flex items-center justify-between ${
                      active
                        ? 'bg-[#241142] border-[#FF2DAA] text-white shadow-neon-pink'
                        : 'bg-white/5 border-white/10 text-white/70 hover:text-white'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold">{st.name}</div>
                      <div className="text-[10px] text-white/50">{st.tagline}</div>
                    </div>
                    <span className="font-mono text-xs font-bold text-[#27E5FF]">
                      {st.frequency}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        <main className="w-full max-w-[450px] mx-auto lg:col-span-6">
          {/* Top-of-Screen Downloadable PWA Bar */}
          <InstallPrompt renderTopBarOnly />
          <OfflineAndErrorBanners />
          {children}
          {/* Bottom Full PWA Download Card & Modal */}
          <InstallPrompt />
        </main>

        <aside className="hidden lg:flex lg:col-span-3 flex-col gap-5 sticky top-8 pt-4">
          <div className="p-5 rounded-2xl bg-[#110922]/85 backdrop-blur-md border border-white/10 shadow-smoked-glass">
            <div className="text-[10px] font-mono tracking-[0.24em] text-[#27E5FF] uppercase mb-3">
              UP NEXT ON {currentStation.frequency} FM
            </div>
            <div className="space-y-2.5">
              {upNextTracks.map((track) => {
                const isCurrent = track.id === currentTrack.id;
                return (
                  <button
                    key={track.id}
                    type="button"
                    onClick={() => selectTrack(track.id, false)}
                    className={`w-full p-2 rounded-xl border text-left flex items-center gap-2.5 transition ${
                      isCurrent
                        ? 'bg-[#231140] border-[#27E5FF] text-white'
                        : 'bg-white/5 border-white/10 text-white/75 hover:text-white'
                    }`}
                  >
                    <img
                      src={track.thumbnail}
                      alt={track.title}
                      className="w-10 h-10 rounded-lg object-cover shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold truncate">
                        {track.title}
                      </div>
                      <div className="text-[10px] text-white/55 truncate">
                        {track.artist}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {recentTracks.length > 0 && (
            <div className="p-5 rounded-2xl bg-[#110922]/85 backdrop-blur-md border border-white/10 shadow-smoked-glass">
              <div className="text-[10px] font-mono tracking-[0.24em] text-[#FF2DAA] uppercase mb-3">
                RECENTLY ON AIR
              </div>
              <div className="space-y-2">
                {recentTracks.map((track) =>
                  track ? (
                    <button
                      key={track.id}
                      type="button"
                      onClick={() => selectTrack(track.id, true)}
                      className="w-full p-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/25 text-left flex items-center gap-2.5"
                    >
                      <img
                        src={track.thumbnail}
                        alt={track.title}
                        className="w-9 h-9 rounded-lg object-cover shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold text-white truncate">
                          {track.title}
                        </div>
                        <div className="text-[10px] text-white/50 truncate">
                          {track.artist}
                        </div>
                      </div>
                    </button>
                  ) : null
                )}
              </div>
            </div>
          )}
        </aside>
      </div>

      <MiniPlayer />
      <BottomNavigation />
    </div>
  );
};
