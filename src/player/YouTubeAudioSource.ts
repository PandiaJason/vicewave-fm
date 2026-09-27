import { AudioSourceEvents, IAudioSource } from '@/player/AudioSource';
import { Track } from '@/player/playerTypes';

declare global {
  interface Window {
    YT?: {
      Player: new (
        elementId: string,
        config: {
          height?: string | number;
          width?: string | number;
          videoId?: string;
          playerVars?: Record<string, string | number>;
          events?: {
            onReady?: (event: { target: YTPlayerInstance }) => void;
            onStateChange?: (event: { data: number; target: YTPlayerInstance }) => void;
            onError?: (event: { data: number }) => void;
          };
        }
      ) => YTPlayerInstance;
      PlayerState?: {
        UNSTARTED: number;
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
        BUFFERING: number;
        CUED: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

export interface YTPlayerInstance {
  playVideo: () => void;
  pauseVideo: () => void;
  stopVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  setVolume: (volume: number) => void;
  mute: () => void;
  unMute: () => void;
  isMuted: () => boolean;
  loadVideoById: (
    videoIdOrConfig: string | { videoId: string; startSeconds?: number },
    startSeconds?: number
  ) => void;
  cueVideoById: (
    videoIdOrConfig: string | { videoId: string; startSeconds?: number },
    startSeconds?: number
  ) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  getVideoData: () => { video_id?: string; title?: string; author?: string };
  destroy: () => void;
}

export class YouTubeAudioSource implements IAudioSource {
  private player: YTPlayerInstance | null = null;
  private isReady = false;
  private loadedVideoId: string | null = null;
  private events: AudioSourceEvents;
  private progressTimer: ReturnType<typeof setInterval> | null = null;
  private pendingTrack: { track: Track; autoplay: boolean } | null = null;
  private pendingPlay = false;
  private desiredVolume = 85;
  private desiredMuted = false;
  private userIntendedPlay = false;
  private visibilityHandler: (() => void) | null = null;

  constructor(events: AudioSourceEvents) {
    this.events = events;
  }

  init(containerId: string, initialTrack: Track, _playlistId?: string): void {
    if (typeof window === 'undefined') return;

    this.loadedVideoId = initialTrack.youtubeVideoId;

    this.visibilityHandler = () => {
      if (this.userIntendedPlay && this.isReady && this.player) {
        setTimeout(() => {
          if (this.userIntendedPlay && this.player) {
            try {
              this.player.playVideo();
            } catch {
              // ignore
            }
          }
        }, 60);
      }
    };
    document.addEventListener('visibilitychange', this.visibilityHandler);
    window.addEventListener('pagehide', this.visibilityHandler);
    window.addEventListener('blur', this.visibilityHandler);

    const createPlayer = () => {
      if (!window.YT || !window.YT.Player) return;
      try {
        this.player = new window.YT.Player(containerId, {
          height: '100%',
          width: '100%',
          videoId: initialTrack.youtubeVideoId,
          playerVars: {
            playsinline: 1,
            controls: 1,
            rel: 0,
            modestbranding: 1,
            enablejsapi: 1,
            start: initialTrack.startSeconds || 0,
            origin: window.location.origin,
          },
          events: {
            onReady: (e) => {
              this.isReady = true;
              e.target.setVolume(this.desiredVolume);
              if (this.desiredMuted) {
                e.target.mute();
              } else {
                e.target.unMute();
              }

              if (this.pendingTrack) {
                const { track, autoplay } = this.pendingTrack;
                this.pendingTrack = null;
                this.loadTrack(track, autoplay);
              } else if (this.pendingPlay) {
                this.pendingPlay = false;
                this.userIntendedPlay = true;
                e.target.seekTo(initialTrack.startSeconds || 0, true);
                e.target.playVideo();
              }
            },
            onStateChange: (e) => {
              this.handleStateChange(e.data);
            },
            onError: (e) => {
              this.stopProgressLoop();
              this.events.onError(e.data);
            },
          },
        });
      } catch {
        this.events.onError('INIT_FAILED');
      }
    };

    if (window.YT && window.YT.Player) {
      createPlayer();
    } else {
      const existingScript = document.querySelector(
        'script[src="https://www.youtube.com/iframe_api"]'
      );
      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prevCallback) prevCallback();
        createPlayer();
      };
      if (!existingScript) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        tag.async = true;
        document.head.appendChild(tag);
      }
    }
  }

  private handleStateChange(stateCode: number) {
    // YT.PlayerState: -1 UNSTARTED, 0 ENDED, 1 PLAYING, 2 PAUSED, 3 BUFFERING, 5 CUED
    if (stateCode === 1) {
      this.userIntendedPlay = true;
      this.events.onStatusChange('PLAYING');
      this.startProgressLoop();
    } else if (stateCode === 2) {
      if (
        this.userIntendedPlay &&
        typeof document !== 'undefined' &&
        (document.hidden || document.visibilityState === 'hidden')
      ) {
        setTimeout(() => {
          if (this.userIntendedPlay && this.player) {
            try {
              this.player.playVideo();
            } catch {
              // ignore
            }
          }
        }, 80);
        return;
      }
      this.events.onStatusChange('PAUSED');
      this.stopProgressLoop();
    } else if (stateCode === 3) {
      this.events.onStatusChange('BUFFERING');
    } else if (stateCode === 0) {
      this.stopProgressLoop();
      this.events.onTrackEnd();
    } else if (stateCode === 5) {
      this.events.onStatusChange('PAUSED');
    }
  }

  private startProgressLoop() {
    this.stopProgressLoop();
    this.progressTimer = setInterval(() => {
      if (!this.player || !this.isReady) return;
      try {
        const current = this.player.getCurrentTime() || 0;
        const duration = this.player.getDuration() || 0;
        this.events.onTimeUpdate(current, duration);
      } catch {
        // ignore transient iframe state errors
      }
    }, 350);
  }

  private stopProgressLoop() {
    if (this.progressTimer) {
      clearInterval(this.progressTimer);
      this.progressTimer = null;
    }
  }

  play(): void {
    this.userIntendedPlay = true;
    if (!this.isReady || !this.player) {
      this.pendingPlay = true;
      this.events.onStatusChange('BUFFERING');
      return;
    }
    try {
      this.player.playVideo();
    } catch {
      this.events.onError('PLAY_FAILED');
    }
  }

  pause(): void {
    this.userIntendedPlay = false;
    this.pendingPlay = false;
    if (!this.isReady || !this.player) return;
    try {
      this.player.pauseVideo();
      this.events.onStatusChange('PAUSED');
    } catch {
      // ignore
    }
  }

  loadTrack(track: Track, autoplay: boolean): void {
    this.userIntendedPlay = autoplay;
    if (!this.isReady || !this.player) {
      this.pendingTrack = { track, autoplay };
      if (autoplay) {
        this.events.onStatusChange('BUFFERING');
      }
      return;
    }

    const startSec = track.startSeconds || 0;

    try {
      // If the station's broadcast video is already loaded, seek directly to the song's startSeconds!
      if (this.loadedVideoId === track.youtubeVideoId) {
        this.player.seekTo(startSec, true);
        if (autoplay) {
          this.player.playVideo();
          this.events.onStatusChange('PLAYING');
          this.startProgressLoop();
        } else {
          this.player.pauseVideo();
        }
        return;
      }

      // Otherwise load the new station's broadcast video at startSec
      this.loadedVideoId = track.youtubeVideoId;
      if (autoplay) {
        this.events.onStatusChange('BUFFERING');
        this.player.loadVideoById({
          videoId: track.youtubeVideoId,
          startSeconds: startSec,
        });
      } else {
        this.player.cueVideoById({
          videoId: track.youtubeVideoId,
          startSeconds: startSec,
        });
      }
    } catch {
      this.events.onError('LOAD_FAILED');
    }
  }

  seek(seconds: number): void {
    if (!this.isReady || !this.player) return;
    try {
      this.player.seekTo(seconds, true);
    } catch {
      // ignore
    }
  }

  setVolume(volume: number): void {
    this.desiredVolume = Math.max(0, Math.min(100, volume));
    if (!this.isReady || !this.player) return;
    try {
      this.player.setVolume(this.desiredVolume);
    } catch {
      // ignore
    }
  }

  setMuted(muted: boolean): void {
    this.desiredMuted = muted;
    if (!this.isReady || !this.player) return;
    try {
      if (muted) {
        this.player.mute();
      } else {
        this.player.unMute();
      }
    } catch {
      // ignore
    }
  }

  getCurrentTime(): number {
    if (!this.isReady || !this.player) return 0;
    try {
      return this.player.getCurrentTime() || 0;
    } catch {
      return 0;
    }
  }

  getDuration(): number {
    if (!this.isReady || !this.player) return 0;
    try {
      return this.player.getDuration() || 0;
    } catch {
      return 0;
    }
  }

  destroy(): void {
    this.stopProgressLoop();
    if (typeof document !== 'undefined' && this.visibilityHandler) {
      document.removeEventListener('visibilitychange', this.visibilityHandler);
      window.removeEventListener('pagehide', this.visibilityHandler);
      window.removeEventListener('blur', this.visibilityHandler);
    }
    if (this.player) {
      try {
        this.player.destroy();
      } catch {
        // ignore
      }
      this.player = null;
    }
    this.isReady = false;
  }
}
