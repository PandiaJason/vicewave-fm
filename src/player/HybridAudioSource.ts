import { AudioSourceEvents, IAudioSource } from '@/player/AudioSource';
import { Track } from '@/player/playerTypes';
import { YouTubeAudioSource } from '@/player/YouTubeAudioSource';

/**
 * HybridAudioSource
 * Primary Engine: Native HTML5 <audio> streaming direct HTTP Byte-Range MP3 broadcasts.
 * Why: Mobile OSes (iOS Safari / Android Chrome) natively allow HTML5 <audio> to play
 * continuously when the phone screen is turned OFF, locked, or in the background, and bind
 * it directly to the Lock-Screen MediaSession & Bluetooth/CarPlay controls.
 *
 * Secondary / Video Mode Engine: Official YouTube IFrame Player API (`YouTubeAudioSource`).
 * Automatically activates when the user opens "SHOW VIDEO" or as a fallback if the direct
 * MP3 stream is unreachable on a restricted network.
 */
export class HybridAudioSource implements IAudioSource {
  private audio: HTMLAudioElement | null = null;
  private ytSource: YouTubeAudioSource;
  private events: AudioSourceEvents;
  private currentTrack: Track | null = null;
  private usingYouTubeFallback = false;
  private videoModeActive = false;
  private desiredVolume = 85;
  private desiredMuted = false;
  private userIntendedPlay = false;

  constructor(events: AudioSourceEvents) {
    this.events = events;
    this.ytSource = new YouTubeAudioSource({
      onStatusChange: (status) => {
        if (this.usingYouTubeFallback || this.videoModeActive) {
          this.events.onStatusChange(status);
        }
      },
      onTimeUpdate: (curr, dur) => {
        if (this.usingYouTubeFallback || this.videoModeActive) {
          this.events.onTimeUpdate(curr, dur);
        }
      },
      onTrackEnd: () => {
        if (this.usingYouTubeFallback || this.videoModeActive) {
          this.events.onTrackEnd();
        }
      },
      onError: (code) => {
        if (this.usingYouTubeFallback || this.videoModeActive) {
          this.events.onError(code);
        }
      },
    });
  }

  init(containerId: string, initialTrack: Track, playlistId?: string): void {
    this.currentTrack = initialTrack;
    this.ytSource.init(containerId, initialTrack, playlistId);

    if (typeof window === 'undefined') return;

    const el = new Audio();
    el.preload = 'metadata';
    el.setAttribute('playsinline', 'true');
    el.setAttribute('webkit-playsinline', 'true');
    el.volume = this.desiredVolume / 100;
    el.muted = this.desiredMuted;
    el.src = initialTrack.audioStreamUrl;

    el.addEventListener('loadedmetadata', () => {
      if (this.currentTrack && el.currentTime < 1) {
        try {
          el.currentTime = this.currentTrack.startSeconds || 0;
        } catch {
          // ignore
        }
      }
    });

    el.addEventListener('playing', () => {
      if (!this.usingYouTubeFallback && !this.videoModeActive) {
        this.userIntendedPlay = true;
        this.events.onStatusChange('PLAYING');
      }
    });

    el.addEventListener('waiting', () => {
      if (!this.usingYouTubeFallback && !this.videoModeActive) {
        this.events.onStatusChange('BUFFERING');
      }
    });

    el.addEventListener('pause', () => {
      if (!this.usingYouTubeFallback && !this.videoModeActive) {
        // If paused unexpectedly by transient network/OS interruption while user intended play, resume
        if (this.userIntendedPlay && !el.ended) {
          setTimeout(() => {
            if (this.userIntendedPlay && this.audio && !this.videoModeActive) {
              this.audio.play().catch(() => {});
            }
          }, 120);
          return;
        }
        this.events.onStatusChange('PAUSED');
      }
    });

    el.addEventListener('timeupdate', () => {
      if (!this.usingYouTubeFallback && !this.videoModeActive) {
        this.events.onTimeUpdate(el.currentTime || 0, el.duration || 3600);
      }
    });

    el.addEventListener('ended', () => {
      if (!this.usingYouTubeFallback && !this.videoModeActive) {
        this.events.onTrackEnd();
      }
    });

    el.addEventListener('error', () => {
      // Seamless fallback to YouTube IFrame API if direct MP3 stream is blocked
      if (!this.usingYouTubeFallback && this.currentTrack) {
        this.usingYouTubeFallback = true;
        this.ytSource.loadTrack(this.currentTrack, this.userIntendedPlay);
      }
    });

    this.audio = el;
  }

  setVideoMode(active: boolean) {
    if (this.videoModeActive === active) return;
    const currentSec = this.getCurrentTime();
    this.videoModeActive = active;

    if (active) {
      // Switch to YouTube embedded video at exact current timestamp
      if (this.audio && !this.audio.paused) {
        this.userIntendedPlay = true;
        this.audio.pause();
      }
      if (this.currentTrack) {
        this.ytSource.loadTrack(
          { ...this.currentTrack, startSeconds: Math.floor(currentSec) },
          this.userIntendedPlay
        );
      }
    } else {
      // Switch back to native HTML5 <audio> for screen-off / background radio playback
      this.ytSource.pause();
      if (this.audio && this.currentTrack) {
        this.usingYouTubeFallback = false;
        if (this.audio.src !== this.currentTrack.audioStreamUrl) {
          this.audio.src = this.currentTrack.audioStreamUrl;
        }
        try {
          this.audio.currentTime = currentSec || this.currentTrack.startSeconds || 0;
        } catch {
          // ignore
        }
        if (this.userIntendedPlay) {
          this.audio.play().catch(() => {});
        }
      }
    }
  }

  play(): void {
    this.userIntendedPlay = true;
    if (this.usingYouTubeFallback || this.videoModeActive || !this.audio) {
      this.ytSource.play();
      return;
    }

    const startSec = this.currentTrack?.startSeconds || 0;
    if (this.audio.currentTime < startSec - 2) {
      try {
        this.audio.currentTime = startSec;
      } catch {
        // If metadata isn't loaded yet, set currentTime once loadedmetadata fires
        const onMeta = () => {
          if (this.audio) {
            try {
              this.audio.currentTime = startSec;
            } catch {
              // ignore
            }
          }
          this.audio?.removeEventListener('loadedmetadata', onMeta);
        };
        this.audio.addEventListener('loadedmetadata', onMeta);
      }
    }

    this.events.onStatusChange('BUFFERING');
    this.audio.play().catch(() => {
      // Fallback to YouTube if HTML5 audio play is rejected
      if (this.currentTrack) {
        this.usingYouTubeFallback = true;
        this.ytSource.loadTrack(this.currentTrack, true);
      }
    });
  }

  pause(): void {
    this.userIntendedPlay = false;
    if (this.usingYouTubeFallback || this.videoModeActive || !this.audio) {
      this.ytSource.pause();
      return;
    }
    this.audio.pause();
    this.events.onStatusChange('PAUSED');
  }

  loadTrack(track: Track, autoplay: boolean): void {
    this.currentTrack = track;
    this.userIntendedPlay = autoplay;

    if (this.usingYouTubeFallback || this.videoModeActive || !this.audio) {
      this.ytSource.loadTrack(track, autoplay);
      return;
    }

    const startSec = track.startSeconds || 0;
    const sameStream = this.audio.src === track.audioStreamUrl;

    if (sameStream && this.audio.readyState >= 1) {
      try {
        this.audio.currentTime = startSec;
      } catch {
        // ignore
      }
      if (autoplay) {
        this.audio.play().catch(() => {});
      } else {
        this.audio.pause();
      }
      return;
    }

    this.audio.src = track.audioStreamUrl;
    const onLoadedMeta = () => {
      if (this.audio) {
        try {
          this.audio.currentTime = startSec;
        } catch {
          // ignore
        }
        if (this.userIntendedPlay) {
          this.audio.play().catch(() => {});
        }
      }
      this.audio?.removeEventListener('loadedmetadata', onLoadedMeta);
    };
    this.audio.addEventListener('loadedmetadata', onLoadedMeta);

    if (autoplay) {
      this.events.onStatusChange('BUFFERING');
      this.audio.load();
      this.audio.play().catch(() => {});
    }
  }

  seek(seconds: number): void {
    if (this.usingYouTubeFallback || this.videoModeActive || !this.audio) {
      this.ytSource.seek(seconds);
      return;
    }
    try {
      this.audio.currentTime = seconds;
    } catch {
      // ignore
    }
  }

  setVolume(volume: number): void {
    this.desiredVolume = Math.max(0, Math.min(100, volume));
    this.ytSource.setVolume(this.desiredVolume);
    if (this.audio) {
      this.audio.volume = this.desiredVolume / 100;
    }
  }

  setMuted(muted: boolean): void {
    this.desiredMuted = muted;
    this.ytSource.setMuted(muted);
    if (this.audio) {
      this.audio.muted = muted;
    }
  }

  getCurrentTime(): number {
    if (this.usingYouTubeFallback || this.videoModeActive || !this.audio) {
      return this.ytSource.getCurrentTime();
    }
    return this.audio.currentTime || 0;
  }

  getDuration(): number {
    if (this.usingYouTubeFallback || this.videoModeActive || !this.audio) {
      return this.ytSource.getDuration();
    }
    return this.audio.duration || 3600;
  }

  destroy(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.src = '';
      this.audio = null;
    }
    this.ytSource.destroy();
  }
}
