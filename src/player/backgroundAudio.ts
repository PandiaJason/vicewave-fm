import { Station, Track } from '@/player/playerTypes';

/**
 * Generates a valid, tiny 1-second stereo PCM WAV data URI with a sub-audible
 * signal (amplitude 1/32767) so iOS Safari and Android Chrome register the top-level
 * PWA window as an active media playback session, keeping background execution alive
 * and binding `navigator.mediaSession` to the OS lock screen & Bluetooth controls.
 */
function createSilentKeepAliveWavDataUri(): string {
  const sampleRate = 8000;
  const numChannels = 2;
  const bitsPerSample = 16;
  const numSamples = sampleRate; // 1 second loop
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const byteRate = sampleRate * blockAlign;
  const dataSize = numSamples * blockAlign;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true); // PCM chunk size
  view.setUint16(20, 1, true); // PCM format
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeString(36, 'data');
  view.setUint32(40, dataSize, true);

  // Sub-audible 1 LSB sample so mobile OS audio decoders do not strip zero-silence frames
  for (let i = 0; i < numSamples * numChannels; i++) {
    view.setInt16(44 + i * 2, i % 2 === 0 ? 1 : -1, true);
  }

  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return `data:audio/wav;base64,${typeof btoa !== 'undefined' ? btoa(binary) : ''}`;
}

export interface MediaSessionHandlers {
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSeekTo: (seconds: number) => void;
}

class BackgroundAudioManager {
  private audioEl: HTMLAudioElement | null = null;
  private audioCtx: AudioContext | null = null;
  private initialized = false;

  init() {
    if (typeof window === 'undefined' || this.initialized) return;
    this.initialized = true;

    try {
      const audio = document.createElement('audio');
      audio.src = createSilentKeepAliveWavDataUri();
      audio.loop = true;
      audio.volume = 0.01;
      audio.setAttribute('playsinline', 'true');
      audio.setAttribute('webkit-playsinline', 'true');
      audio.preload = 'auto';
      this.audioEl = audio;
    } catch {
      // ignore
    }
  }

  startKeepAlive() {
    if (typeof window === 'undefined') return;
    this.init();

    if (this.audioEl && this.audioEl.paused) {
      this.audioEl.play().catch(() => {});
    }

    try {
      const AudioCtx =
        window.AudioContext ||
        (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        if (!this.audioCtx) {
          this.audioCtx = new AudioCtx();
        }
        if (this.audioCtx.state === 'suspended') {
          this.audioCtx.resume().catch(() => {});
        }
      }
    } catch {
      // ignore
    }
  }

  stopKeepAlive() {
    if (this.audioEl && !this.audioEl.paused) {
      try {
        this.audioEl.pause();
      } catch {
        // ignore
      }
    }
  }

  updateMediaSessionMetadata(track: Track, station: Station, isPlaying: boolean) {
    if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return;

    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title,
        artist: `${track.artist} • ${station.frequency} FM`,
        album: `VICEWAVE FM — ${station.name}`,
        artwork: [
          {
            src: track.thumbnail,
            sizes: '480x360',
            type: 'image/jpeg',
          },
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      });

      navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
    } catch {
      // ignore
    }
  }

  updatePositionState(currentTime: number, duration: number) {
    if (
      typeof navigator === 'undefined' ||
      !('mediaSession' in navigator) ||
      !('setPositionState' in navigator.mediaSession)
    ) {
      return;
    }

    if (duration > 0 && currentTime >= 0 && currentTime <= duration) {
      try {
        navigator.mediaSession.setPositionState({
          duration,
          playbackRate: 1,
          position: currentTime,
        });
      } catch {
        // ignore
      }
    }
  }

  registerActionHandlers(handlers: MediaSessionHandlers) {
    if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return;

    const actions: Array<[MediaSessionAction, MediaSessionActionHandler]> = [
      ['play', () => handlers.onPlay()],
      ['pause', () => handlers.onPause()],
      ['nexttrack', () => handlers.onNext()],
      ['previoustrack', () => handlers.onPrev()],
      [
        'seekto',
        (details) => {
          if (typeof details.seekTime === 'number') {
            handlers.onSeekTo(details.seekTime);
          }
        },
      ],
      [
        'seekbackward',
        (details) => {
          const offset = details.seekOffset || 10;
          handlers.onSeekTo(Math.max(0, (details.seekTime || 0) - offset));
        },
      ],
      [
        'seekforward',
        (details) => {
          const offset = details.seekOffset || 10;
          handlers.onSeekTo((details.seekTime || 0) + offset);
        },
      ],
    ];

    for (const [action, handler] of actions) {
      try {
        navigator.mediaSession.setActionHandler(action, handler);
      } catch {
        // Some browsers don't support all MediaSession actions
      }
    }
  }
}

export const backgroundAudioManager = new BackgroundAudioManager();
