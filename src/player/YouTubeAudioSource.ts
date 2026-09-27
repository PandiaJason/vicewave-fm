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
  loadVideoById: (videoId: string, startSeconds?: number) => void;
  cueVideoById: (videoId: string, startSeconds?: number) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  getVideoData: () => { video_id?: string; title?: string; author?: string };
  destroy: () => void;
}

export class YouTubeAudioSource implements IAudioSource {
  private player: YTPlayerInstance | null = null;
  private isReady = false;
  private events: AudioSourceEvents;
  private progressTimer: ReturnType<typeof setInterval> | null = null;
  private pendingTrack: { track: Track; autoplay: boolean } | null = null;
  private pendingPlay = false;
  private desiredVolume = 85;
  private desiredMuted = false;

  constructor(events: AudioSourceEvents) {
    this.events = events;
  }

  init(containerId: string, initialTrack: Track, playlistId?: string): void {
    if (typeof window === 'undefined') return;

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
            ...(playlistId ? { listType: 'playlist', list: playlistId } : {}),
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
      this.events.onStatusChange('PLAYING');
      this.startProgressLoop();
      this.syncMetadata();
    } else if (stateCode === 2) {
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

  private syncMetadata() {
    if (!this.player || !this.isReady) return;
    try {
      const data = this.player.getVideoData?.();
      const duration = this.player.getDuration?.() || 0;
      if (data && data.video_id && data.title && this.events.onMetadataUpdate) {
        this.events.onMetadataUpdate(
          data.video_id,
          data.title,
          data.author || 'ViceWave 80s Rotation',
          duration
        );
      }
    } catch {
      // ignore metadata lookup failure
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
    }, 450);
  }

  private stopProgressLoop() {
    if (this.progressTimer) {
      clearInterval(this.progressTimer);
      this.progressTimer = null;
    }
  }

  play(): void {
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
    if (!this.isReady || !this.player) {
      this.pendingTrack = { track, autoplay };
      if (autoplay) {
        this.events.onStatusChange('BUFFERING');
      }
      return;
    }

    try {
      if (autoplay) {
        this.events.onStatusChange('BUFFERING');
        this.player.loadVideoById(track.youtubeVideoId, 0);
      } else {
        this.player.cueVideoById(track.youtubeVideoId, 0);
      }
    } catch {
      this.events.onError('LOAD_FAILED');
    }
  }

  seek(seconds: number): void {
    if (!this.isReady || !this.player) return;
    try {
      this.player.seekTo(seconds, true);
      const duration = this.player.getDuration() || 0;
      this.events.onTimeUpdate(seconds, duration);
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
