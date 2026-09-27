import { Station, Track, UserPreferences } from '@/player/playerTypes';

export const INITIAL_YOUTUBE_PLAYLIST_ID = 'PL-vB0QZpsqn5GOYHr3N2YG5qEdj07wFzk';
export const INITIAL_VIDEO_ID = 'B-8EORB783c';

export const STATIONS: Station[] = [
  {
    id: 'palm-fm',
    frequency: '95.7',
    numericFreq: 95.7,
    name: 'PALM FM',
    shortName: 'PALM',
    tagline: 'SLOW NIGHTS. WARM LIGHTS.',
    mood: 'soft rock / romantic / slower music',
    genre: 'SOFT',
    channelCode: 'CH 01',
    accentColor: '#FFB347',
    trackIds: ['vw-05', 'vw-10', 'vw-15'],
  },
  {
    id: 'vicewave-fm',
    frequency: '98.3',
    numericFreq: 98.3,
    name: 'VICEWAVE FM',
    shortName: 'VICEWAVE',
    tagline: 'NIGHT NEVER ENDS',
    mood: 'iconic 80s / night drive / pop',
    genre: 'POP',
    channelCode: 'CH 02',
    accentColor: '#FF2DAA',
    trackIds: ['vw-04', 'vw-01', 'vw-02', 'vw-03', 'vw-05', 'vw-06', 'vw-11'],
  },
  {
    id: 'neon-fm',
    frequency: '103.1',
    numericFreq: 103.1,
    name: 'NEON FM',
    shortName: 'NEON',
    tagline: 'ELECTRIC AFTER DARK',
    mood: 'synth / electronic / new wave',
    genre: 'SYNTH',
    channelCode: 'CH 03',
    accentColor: '#27E5FF',
    trackIds: ['vw-01', 'vw-03', 'vw-07', 'vw-12', 'vw-16'],
  },
  {
    id: 'sunset-fm',
    frequency: '105.5',
    numericFreq: 105.5,
    name: 'SUNSET FM',
    shortName: 'SUNSET',
    tagline: 'FOREVER GOLDEN',
    mood: 'funk / dance / upbeat',
    genre: 'FUNK',
    channelCode: 'CH 04',
    accentColor: '#FF7849',
    trackIds: ['vw-02', 'vw-08', 'vw-13', 'vw-17'],
  },
  {
    id: 'midnight-rock',
    frequency: '107.7',
    numericFreq: 107.7,
    name: 'MIDNIGHT ROCK',
    shortName: 'MIDNIGHT',
    tagline: 'LOUD AFTER DARK',
    mood: 'rock / guitar',
    genre: 'ROCK',
    channelCode: 'CH 05',
    accentColor: '#FF3DCE',
    trackIds: ['vw-04', 'vw-09', 'vw-14', 'vw-18'],
  },
];

export const INITIAL_TRACKS: Track[] = [
  {
    id: 'vw-04',
    youtubeVideoId: 'B-8EORB783c',
    playlistIndex: 3,
    title: 'Midnight Ocean Drive (98.3 Broadcast)',
    artist: 'ViceWave 80s Rotation • Track 04',
    thumbnail: 'https://i.ytimg.com/vi/B-8EORB783c/hqdefault.jpg',
    duration: 248,
    stationId: 'vicewave-fm',
    genre: 'POP',
    favorite: false,
    sourceType: 'youtube',
    downloadAllowed: false,
  },
  {
    id: 'vw-01',
    youtubeVideoId: 'Up2qr5K6zc4',
    playlistIndex: 0,
    title: 'Neon Boulevard Horizon (Opening Broadcast)',
    artist: 'ViceWave 80s Rotation • Track 01',
    thumbnail: 'https://i.ytimg.com/vi/Up2qr5K6zc4/hqdefault.jpg',
    duration: 235,
    stationId: 'vicewave-fm',
    genre: 'SYNTH',
    favorite: false,
    sourceType: 'youtube',
    downloadAllowed: false,
  },
  {
    id: 'vw-02',
    youtubeVideoId: 'utK2tcVdDu0',
    playlistIndex: 1,
    title: 'Starlight Bay Express',
    artist: 'ViceWave 80s Rotation • Track 02',
    thumbnail: 'https://i.ytimg.com/vi/utK2tcVdDu0/hqdefault.jpg',
    duration: 252,
    stationId: 'sunset-fm',
    genre: 'FUNK',
    favorite: false,
    sourceType: 'youtube',
    downloadAllowed: false,
  },
  {
    id: 'vw-03',
    youtubeVideoId: '1vU4BF5-kvQ',
    playlistIndex: 2,
    title: 'Electric Flamingo Afterglow',
    artist: 'ViceWave 80s Rotation • Track 03',
    thumbnail: 'https://i.ytimg.com/vi/1vU4BF5-kvQ/hqdefault.jpg',
    duration: 229,
    stationId: 'neon-fm',
    genre: 'SYNTH',
    favorite: false,
    sourceType: 'youtube',
    downloadAllowed: false,
  },
  {
    id: 'vw-05',
    youtubeVideoId: 'icbXPB5vqCs',
    playlistIndex: 4,
    title: 'Biscayne Harbor Velvet',
    artist: 'ViceWave 80s Rotation • Track 05',
    thumbnail: 'https://i.ytimg.com/vi/icbXPB5vqCs/hqdefault.jpg',
    duration: 264,
    stationId: 'palm-fm',
    genre: 'SOFT',
    favorite: false,
    sourceType: 'youtube',
    downloadAllowed: false,
  },
  {
    id: 'vw-06',
    youtubeVideoId: 'B-8EORB783c',
    playlistIndex: 3,
    title: 'Out On Collins Avenue',
    artist: 'The Coastal Chromatics',
    thumbnail: 'https://i.ytimg.com/vi/B-8EORB783c/hqdefault.jpg',
    duration: 245,
    stationId: 'vicewave-fm',
    genre: 'POP',
    favorite: false,
    sourceType: 'youtube',
    downloadAllowed: false,
  },
  {
    id: 'vw-07',
    youtubeVideoId: '1vU4BF5-kvQ',
    playlistIndex: 2,
    title: 'Analog Heartbeat 1986',
    artist: 'DX7 Syndicate',
    thumbnail: 'https://i.ytimg.com/vi/1vU4BF5-kvQ/hqdefault.jpg',
    duration: 230,
    stationId: 'neon-fm',
    genre: 'SYNTH',
    favorite: false,
    sourceType: 'youtube',
    downloadAllowed: false,
  },
  {
    id: 'vw-08',
    youtubeVideoId: 'utK2tcVdDu0',
    playlistIndex: 1,
    title: 'Gold Chain Marina Groove',
    artist: 'Sunset Brass & Keys',
    thumbnail: 'https://i.ytimg.com/vi/utK2tcVdDu0/hqdefault.jpg',
    duration: 258,
    stationId: 'sunset-fm',
    genre: 'FUNK',
    favorite: false,
    sourceType: 'youtube',
    downloadAllowed: false,
  },
  {
    id: 'vw-09',
    youtubeVideoId: 'Up2qr5K6zc4',
    playlistIndex: 0,
    title: 'Thunder On Causeway 107.7',
    artist: 'Night Viper Overdrive',
    thumbnail: 'https://i.ytimg.com/vi/Up2qr5K6zc4/hqdefault.jpg',
    duration: 241,
    stationId: 'midnight-rock',
    genre: 'ROCK',
    favorite: false,
    sourceType: 'youtube',
    downloadAllowed: false,
  },
  {
    id: 'vw-10',
    youtubeVideoId: 'icbXPB5vqCs',
    playlistIndex: 4,
    title: 'Warm Trade Winds (2:00 AM)',
    artist: 'Coral Gables Saxophone Club',
    thumbnail: 'https://i.ytimg.com/vi/icbXPB5vqCs/hqdefault.jpg',
    duration: 272,
    stationId: 'palm-fm',
    genre: 'SOFT',
    favorite: false,
    sourceType: 'youtube',
    downloadAllowed: false,
  },
  {
    id: 'vw-11',
    youtubeVideoId: 'Up2qr5K6zc4',
    playlistIndex: 0,
    title: 'Pink Motel Neon Reflections',
    artist: 'Mirage & The Palmettos',
    thumbnail: 'https://i.ytimg.com/vi/Up2qr5K6zc4/hqdefault.jpg',
    duration: 238,
    stationId: 'vicewave-fm',
    genre: 'POP',
    favorite: false,
    sourceType: 'youtube',
    downloadAllowed: false,
  },
  {
    id: 'vw-12',
    youtubeVideoId: '1vU4BF5-kvQ',
    playlistIndex: 2,
    title: 'Cybernetic Coastline Run',
    artist: 'Arpeggio Zero',
    thumbnail: 'https://i.ytimg.com/vi/1vU4BF5-kvQ/hqdefault.jpg',
    duration: 218,
    stationId: 'neon-fm',
    genre: 'SYNTH',
    favorite: false,
    sourceType: 'youtube',
    downloadAllowed: false,
  },
  {
    id: 'vw-13',
    youtubeVideoId: 'utK2tcVdDu0',
    playlistIndex: 1,
    title: 'Convertible Boogie Tonight',
    artist: 'South Beach Funk System',
    thumbnail: 'https://i.ytimg.com/vi/utK2tcVdDu0/hqdefault.jpg',
    duration: 249,
    stationId: 'sunset-fm',
    genre: 'FUNK',
    favorite: false,
    sourceType: 'youtube',
    downloadAllowed: false,
  },
  {
    id: 'vw-14',
    youtubeVideoId: 'B-8EORB783c',
    playlistIndex: 3,
    title: 'Chrome Tailpipe Highway',
    artist: 'Blacktop Reverb',
    thumbnail: 'https://i.ytimg.com/vi/B-8EORB783c/hqdefault.jpg',
    duration: 254,
    stationId: 'midnight-rock',
    genre: 'ROCK',
    favorite: false,
    sourceType: 'youtube',
    downloadAllowed: false,
  },
  {
    id: 'vw-15',
    youtubeVideoId: 'icbXPB5vqCs',
    playlistIndex: 4,
    title: 'Last Ferry From Key Biscayne',
    artist: 'Velvet Horizon',
    thumbnail: 'https://i.ytimg.com/vi/icbXPB5vqCs/hqdefault.jpg',
    duration: 268,
    stationId: 'palm-fm',
    genre: 'SOFT',
    favorite: false,
    sourceType: 'youtube',
    downloadAllowed: false,
  },
];

export const DEFAULT_PREFERENCES: UserPreferences = {
  volume: 85,
  muted: false,
  autoplay: true,
  resumeLastStation: true,
  rememberVolume: true,
  defaultStationId: 'vicewave-fm',
  tuningEffects: true,
  stationTransition: true,
  crtEnabled: true,
  neonGlow: true,
  backgroundAnimation: true,
  reducedMotion: false,
  nightDrive: false,
  keepScreenAwake: true,
  simplifiedControls: false,
  repeatMode: 'ALL',
  shuffle: false,
  cassetteMode: false,
};

/**
 * Isolated Playback Progress Store
 * Prevents full-tree React re-renders every second when audio time advances.
 */
interface ProgressSnapshot {
  currentTime: number;
  duration: number;
}

class PlaybackProgressStore {
  private state: ProgressSnapshot = { currentTime: 0, duration: 248 };
  private listeners = new Set<() => void>();

  getSnapshot = (): ProgressSnapshot => this.state;

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  setProgress(currentTime: number, duration: number) {
    const roundedCurrent = Math.max(0, Math.floor(currentTime));
    const roundedDuration = duration > 0 ? Math.floor(duration) : this.state.duration;
    if (
      roundedCurrent !== this.state.currentTime ||
      roundedDuration !== this.state.duration
    ) {
      this.state = { currentTime: roundedCurrent, duration: roundedDuration };
      this.listeners.forEach((l) => l());
    }
  }
}

export const progressStore = new PlaybackProgressStore();
