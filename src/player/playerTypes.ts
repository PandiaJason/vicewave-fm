export type GenreType = 'ALL' | 'POP' | 'ROCK' | 'SYNTH' | 'FUNK' | 'SOFT';

export type SourceType = 'youtube' | 'local';

export interface Track {
  id: string;
  youtubeVideoId: string;
  playlistIndex?: number;
  title: string;
  artist: string;
  thumbnail: string;
  duration: number; // in seconds
  stationId: string;
  genre: Exclude<GenreType, 'ALL'>;
  favorite?: boolean;
  sourceType: SourceType;
  downloadAllowed: boolean;
}

export interface Station {
  id: string;
  frequency: string; // e.g. "98.3"
  numericFreq: number; // e.g. 98.3
  name: string; // e.g. "VICEWAVE FM"
  shortName: string; // e.g. "VICEWAVE"
  tagline: string; // e.g. "NIGHT NEVER ENDS"
  mood: string; // e.g. "iconic 80s / night drive / pop"
  genre: Exclude<GenreType, 'ALL'>;
  channelCode: string; // e.g. "CH 01"
  accentColor: string; // hex
  trackIds: string[];
}

export interface HistoryItem {
  trackId: string;
  playedAt: number;
}

export type RepeatMode = 'OFF' | 'ALL' | 'ONE';

export type SleepTimerOption = 'OFF' | '15' | '30' | '45' | '60' | 'END_OF_TRACK';

export interface SleepTimerState {
  option: SleepTimerOption;
  expiresAt: number | null; // epoch ms
  remainingSeconds: number | null;
}

export type PlaybackStatus = 'IDLE' | 'TUNING' | 'BUFFERING' | 'PLAYING' | 'PAUSED' | 'ERROR' | 'OFFLINE';

export interface UserPreferences {
  volume: number; // 0-100
  muted: boolean;
  autoplay: boolean;
  resumeLastStation: boolean;
  rememberVolume: boolean;
  defaultStationId: string;
  tuningEffects: boolean;
  stationTransition: boolean;
  crtEnabled: boolean;
  neonGlow: boolean;
  backgroundAnimation: boolean;
  reducedMotion: boolean;
  nightDrive: boolean;
  keepScreenAwake: boolean;
  simplifiedControls: boolean;
  repeatMode: RepeatMode;
  shuffle: boolean;
  cassetteMode: boolean;
}
