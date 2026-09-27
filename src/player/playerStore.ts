import { GenreType, Station, Track, UserPreferences } from '@/player/playerTypes';

export const INITIAL_YOUTUBE_PLAYLIST_ID = 'PL-vB0QZpsqn5GOYHr3N2YG5qEdj07wFzk';
export const INITIAL_VIDEO_ID = 'B-8EORB783c';

export const STATION_AUDIO_STREAMS = {
  'vicewave-fm': 'https://archive.org/download/flash-fm-gta-vice-city_202203/flash-fm-gta-vice-city.mp3',
  'neon-fm': 'https://archive.org/download/gtavc_radiofull/WAVE.mp3',
  'sunset-fm': 'https://archive.org/download/gtavc_radiofull/FEVER.mp3',
  'midnight-rock': 'https://archive.org/download/GTAViceCityVRockFullRadioStation/GTA%20Vice%20City%20V-Rock%20Full%20Radio%20Station.mp3',
  'palm-fm': 'https://archive.org/download/gtavc_radiofull/EMOTION.mp3',
} as const;

export function parseTimestampToSeconds(ts: string): number {
  const parts = ts.trim().split(':').map(Number);
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  return Number(ts) || 0;
}

interface RawChapter {
  title: string;
  artist: string;
  start: string;
  end: string;
}

// 1. 98.3 — VICEWAVE FM (POP • Video: B-8EORB783c)
const VICEWAVE_983_RAW: RawChapter[] = [
  { title: 'Out of Touch', artist: 'Daryl Hall & John Oates', start: '00:08', end: '03:19' },
  { title: 'Dance Hall Days', artist: 'Wang Chung', start: '04:15', end: '07:15' },
  { title: 'Billie Jean', artist: 'Michael Jackson', start: '07:30', end: '11:36' },
  { title: 'Self Control', artist: 'Laura Branigan', start: '11:39', end: '15:16' },
  { title: 'Call Me', artist: 'Go West', start: '16:19', end: '19:45' },
  { title: 'Kiss the Dirt (Falling Down the Mountain)', artist: 'INXS', start: '19:46', end: '23:11' },
  { title: 'Run to You', artist: 'Bryan Adams', start: '24:32', end: '27:41' },
  { title: 'Four Little Diamonds', artist: 'Electric Light Orchestra', start: '28:01', end: '31:55' },
  { title: 'Owner of a Lonely Heart', artist: 'Yes', start: '31:56', end: '35:25' },
  { title: 'Video Killed the Radio Star', artist: 'The Buggles', start: '36:10', end: '39:27' },
  { title: 'Japanese Boy', artist: 'Aneka', start: '39:29', end: '43:13' },
  { title: "Life's What You Make It", artist: 'Talk Talk', start: '44:32', end: '48:04' },
  { title: 'Your Love', artist: 'The Outfield', start: '48:05', end: '50:56' },
  { title: "Steppin' Out", artist: 'Joe Jackson', start: '52:54', end: '55:54' },
  { title: 'One Thing Leads to Another', artist: 'The Fixx', start: '56:10', end: '59:05' },
  { title: 'Running with the Night', artist: 'Lionel Richie', start: '59:48', end: '1:02:52' },
];

// 2. 103.1 — NEON FM (SYNTH • Video: utK2tcVdDu0)
const NEON_1031_RAW: RawChapter[] = [
  { title: 'Two Tribes', artist: 'Frankie Goes to Hollywood', start: '00:01', end: '03:54' },
  { title: 'Love Missile F1-11', artist: 'Sigue Sigue Sputnik', start: '04:45', end: '08:19' },
  { title: 'Cars', artist: 'Gary Numan', start: '08:20', end: '11:27' },
  { title: '(Keep Feeling) Fascination', artist: 'The Human League', start: '11:28', end: '15:10' },
  { title: 'Atomic', artist: 'Blondie', start: '17:00', end: '20:59' },
  { title: 'Kids in America', artist: 'Kim Wilde', start: '21:00', end: '24:18' },
  { title: 'Pale Shelter', artist: 'Tears for Fears', start: '24:19', end: '28:43' },
  { title: 'Sunglasses at Night', artist: 'Corey Hart', start: '29:15', end: '32:57' },
  { title: 'Poison Arrow', artist: 'ABC', start: '32:58', end: '36:22' },
  { title: 'I Ran (So Far Away)', artist: 'A Flock of Seagulls', start: '36:34', end: '40:14' },
  { title: 'Love My Way', artist: 'The Psychedelic Furs', start: '41:53', end: '45:05' },
  { title: 'Obsession', artist: 'Animotion', start: '45:06', end: '49:04' },
  { title: 'Gold', artist: 'Spandau Ballet', start: '50:02', end: '53:50' },
  { title: 'Hyperactive!', artist: 'Thomas Dolby', start: '53:53', end: '58:03' },
];

// 3. 105.5 — SUNSET FM (FUNK • Video: icbXPB5vqCs)
const SUNSET_1055_RAW: RawChapter[] = [
  { title: 'And the Beat Goes On', artist: 'The Whispers', start: '00:04', end: '04:30' },
  { title: 'Act Like You Know', artist: "Fat Larry's Band", start: '04:32', end: '08:45' },
  { title: 'Get Down Saturday Night', artist: 'Oliver Cheatham', start: '09:19', end: '14:49' },
  { title: 'Automatic', artist: 'The Pointer Sisters', start: '16:03', end: '20:40' },
  { title: "I'll Be Good", artist: 'René & Angela', start: '20:41', end: '24:43' },
  { title: 'All Night Long', artist: 'Mary Jane Girls', start: '24:46', end: '29:24' },
  { title: 'Ghetto Life', artist: 'Rick James', start: '30:22', end: '34:40' },
  { title: "Wanna Be Startin' Somethin'", artist: 'Michael Jackson', start: '34:38', end: '40:35' },
  { title: 'Shame', artist: 'Evelyn "Champagne" King', start: '40:36', end: '45:01' },
  { title: 'Behind the Groove', artist: 'Teena Marie', start: '45:46', end: '49:10' },
  { title: 'Juicy Fruit', artist: 'Mtume', start: '49:19', end: '53:46' },
  { title: 'Summer Madness', artist: 'Kool & the Gang', start: '53:43', end: '57:56' },
  { title: 'Last Night a D.J. Saved My Life', artist: 'Indeep', start: '58:58', end: '1:03:06' },
];

// 4. 107.7 — MIDNIGHT ROCK (ROCK • Video: Up2qr5K6zc4)
const MIDNIGHT_1077_RAW: RawChapter[] = [
  { title: 'I Wanna Rock', artist: 'Twisted Sister', start: '00:07', end: '02:58' },
  { title: 'Too Young to Fall in Love', artist: 'Mötley Crüe', start: '03:06', end: '06:17' },
  { title: 'Cum On Feel the Noize', artist: 'Quiet Riot', start: '08:29', end: '12:34' },
  { title: 'She Sells Sanctuary', artist: 'The Cult', start: '14:25', end: '18:18' },
  { title: 'Dangerous Bastard', artist: 'Love Fist', start: '21:31', end: '24:31' },
  { title: '2 Minutes to Midnight', artist: 'Iron Maiden', start: '25:32', end: '31:21' },
  { title: 'Working for the Weekend', artist: 'Loverboy', start: '33:12', end: '36:49' },
  { title: 'God Blessed Video', artist: 'Alcatrazz', start: '37:47', end: '41:11' },
  { title: "Cumin' Atcha Live", artist: 'Tesla', start: '41:20', end: '44:51' },
  { title: 'Turn Up the Radio', artist: 'Autograph', start: '45:01', end: '49:25' },
  { title: 'Peace Sells', artist: 'Megadeth', start: '49:26', end: '53:25' },
  { title: 'Madhouse', artist: 'Anthrax', start: '54:19', end: '58:19' },
  { title: 'Raining Blood', artist: 'Slayer', start: '58:20', end: '1:01:17' },
  { title: "You've Got Another Thing Comin'", artist: 'Judas Priest', start: '1:01:42', end: '1:06:01' },
  { title: 'Fist Fury', artist: 'Love Fist', start: '1:06:11', end: '1:09:18' },
];

// 5. 95.7 — PALM FM (SOFT • Video: 1vU4BF5-kvQ)
const PALM_957_RAW: RawChapter[] = [
  { title: 'Waiting for a Girl Like You', artist: 'Foreigner', start: '00:08', end: '04:18' },
  { title: 'Wow', artist: 'Kate Bush', start: '05:30', end: '09:08' },
  { title: 'Tempted', artist: 'Squeeze', start: '10:23', end: '14:05' },
  { title: 'Keep On Loving You', artist: 'REO Speedwagon', start: '14:07', end: '17:13' },
  { title: '(I Just) Died in Your Arms', artist: 'Cutting Crew', start: '17:21', end: '21:29' },
  { title: 'More Than This', artist: 'Roxy Music', start: '21:31', end: '25:30' },
  { title: 'Africa', artist: 'Toto', start: '27:45', end: '31:49' },
  { title: 'Broken Wings', artist: 'Mr. Mister', start: '32:01', end: '36:48' },
  { title: 'Missing You', artist: 'John Waite', start: '36:59', end: '40:39' },
  { title: "Crockett's Theme", artist: 'Jan Hammer', start: '41:59', end: '45:11' },
  { title: 'Sister Christian', artist: 'Night Ranger', start: '46:16', end: '51:12' },
  { title: 'Never Too Much', artist: 'Luther Vandross', start: '52:57', end: '56:37' },
];

function buildStationTracks(
  prefix: string,
  stationId: keyof typeof STATION_AUDIO_STREAMS,
  youtubeVideoId: string,
  playlistIndex: number,
  genre: Exclude<GenreType, 'ALL'>,
  chapters: RawChapter[]
): Track[] {
  const audioStreamUrl = STATION_AUDIO_STREAMS[stationId];
  return chapters.map((ch, idx) => {
    const startSeconds = parseTimestampToSeconds(ch.start);
    const endSeconds = parseTimestampToSeconds(ch.end);
    const duration = Math.max(30, endSeconds - startSeconds);
    return {
      id: `${prefix}-${String(idx + 1).padStart(2, '0')}`,
      youtubeVideoId,
      audioStreamUrl,
      playlistIndex,
      title: ch.title,
      artist: ch.artist,
      thumbnail: `https://i.ytimg.com/vi/${youtubeVideoId}/hqdefault.jpg`,
      startSeconds,
      endSeconds,
      startTimeLabel: ch.start,
      endTimeLabel: ch.end,
      duration,
      stationId,
      genre,
      favorite: false,
      sourceType: 'youtube',
      downloadAllowed: false,
    };
  });
}

const vicewaveTracks = buildStationTracks(
  'vw-983',
  'vicewave-fm',
  'B-8EORB783c',
  3,
  'POP',
  VICEWAVE_983_RAW
);

const neonTracks = buildStationTracks(
  'vw-1031',
  'neon-fm',
  'utK2tcVdDu0',
  1,
  'SYNTH',
  NEON_1031_RAW
);

const sunsetTracks = buildStationTracks(
  'vw-1055',
  'sunset-fm',
  'icbXPB5vqCs',
  4,
  'FUNK',
  SUNSET_1055_RAW
);

const midnightTracks = buildStationTracks(
  'vw-1077',
  'midnight-rock',
  'Up2qr5K6zc4',
  0,
  'ROCK',
  MIDNIGHT_1077_RAW
);

const palmTracks = buildStationTracks(
  'vw-957',
  'palm-fm',
  '1vU4BF5-kvQ',
  2,
  'SOFT',
  PALM_957_RAW
);

export const INITIAL_TRACKS: Track[] = [
  ...vicewaveTracks,
  ...neonTracks,
  ...sunsetTracks,
  ...midnightTracks,
  ...palmTracks,
];

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
    youtubeVideoId: '1vU4BF5-kvQ',
    audioStreamUrl: STATION_AUDIO_STREAMS['palm-fm'],
    trackIds: palmTracks.map((t) => t.id),
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
    youtubeVideoId: 'B-8EORB783c',
    audioStreamUrl: STATION_AUDIO_STREAMS['vicewave-fm'],
    trackIds: vicewaveTracks.map((t) => t.id),
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
    youtubeVideoId: 'utK2tcVdDu0',
    audioStreamUrl: STATION_AUDIO_STREAMS['neon-fm'],
    trackIds: neonTracks.map((t) => t.id),
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
    youtubeVideoId: 'icbXPB5vqCs',
    audioStreamUrl: STATION_AUDIO_STREAMS['sunset-fm'],
    trackIds: sunsetTracks.map((t) => t.id),
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
    youtubeVideoId: 'Up2qr5K6zc4',
    audioStreamUrl: STATION_AUDIO_STREAMS['midnight-rock'],
    trackIds: midnightTracks.map((t) => t.id),
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

interface ProgressSnapshot {
  currentTime: number;
  duration: number;
}

class PlaybackProgressStore {
  private state: ProgressSnapshot = { currentTime: 0, duration: 191 };
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
