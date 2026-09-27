import { Station, Track } from '@/player/playerTypes';

export interface MediaSessionHandlers {
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSeekTo: (seconds: number) => void;
}

class BackgroundAudioManager {
  private audioCtx: AudioContext | null = null;

  startKeepAlive() {
    if (typeof window === 'undefined') return;
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
    // No secondary <audio> element needed because HybridAudioSource plays native HTML5 <audio>
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
        // ignore unsupported MediaSession actions
      }
    }
  }
}

export const backgroundAudioManager = new BackgroundAudioManager();
