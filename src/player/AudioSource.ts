import { PlaybackStatus, Track } from '@/player/playerTypes';

export interface AudioSourceEvents {
  onStatusChange: (status: PlaybackStatus) => void;
  onTimeUpdate: (currentTime: number, duration: number) => void;
  onTrackEnd: () => void;
  onError: (code?: number | string) => void;
  onMetadataUpdate?: (videoId: string, title: string, author: string, duration: number) => void;
}

export interface IAudioSource {
  init(containerId: string, initialTrack: Track, playlistId?: string): void;
  play(): void;
  pause(): void;
  loadTrack(track: Track, autoplay: boolean): void;
  seek(seconds: number): void;
  setVolume(volume: number): void;
  setMuted(muted: boolean): void;
  getCurrentTime(): number;
  getDuration(): number;
  destroy(): void;
}
