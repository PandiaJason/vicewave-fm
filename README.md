# ViceWave FM

**80s • MIAMI • ALL NIGHT**

**NO ADS. JUST MUSIC.**

---

## Overview

**ViceWave FM** is a mobile-first Progressive Web Application (PWA) built around the nocturnal atmosphere of driving down a neon-lit coastal boulevard in the 1980s. Rather than resembling a generic playlist dashboard, ViceWave FM is designed as a smoked-glass digital automobile FM receiver first and a track catalog second.

When you open ViceWave FM, you immediately tune into an active frequency (`98.3 FM — VICEWAVE FM`) with zero onboarding forms, zero user accounts, and zero app-inserted advertisements.

---

## Screenshots Placeholder

```text
┌─────────────────────────────────────────────┐
│                VICEWAVE FM                  │
│          80s • MIAMI • ALL NIGHT            │
│                                             │
│   ● LIVE FROM THE COAST      ▂ ▄ ▆ █ SIGNAL │
│  ┌───────────────────────────────────────┐  │
│  │ FM  STEREO  MEM        CH 02  ● ON AIR│  │
│  │                 98.3 MHz              │  │
│  │              VICEWAVE FM              │  │
│  │           NIGHT NEVER ENDS            │  │
│  │  88  90  92  94  96  98 100 102 104   │  │
│  │  ────────────────────▲──────────────  │  │
│  └───────────────────────────────────────┘  │
│  ┌───────────────────────────────────────┐  │
│  │       [ NOW PLAYING / CASSETTE ]      │  │
│  │     Midnight Ocean Drive (98.3)       │  │
│  │   01:42 ━━━━━━━━━●━━━━━━━━━━━ 04:08   │  │
│  │        🔀    ⏮    ⏯    ⏭    🔁        │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

---

## Features

- **5 Original Fictional 80s Stations**:
  - `98.3 — VICEWAVE FM` (*NIGHT NEVER ENDS* • Iconic 80s / Night Drive / Pop)
  - `103.1 — NEON FM` (*ELECTRIC AFTER DARK* • Synth / Electronic / New Wave)
  - `105.5 — SUNSET FM` (*FOREVER GOLDEN* • Funk / Dance / Upbeat)
  - `107.7 — MIDNIGHT ROCK` (*LOUD AFTER DARK* • Rock / Guitar)
  - `95.7 — PALM FM` (*SLOW NIGHTS. WARM LIGHTS.* • Soft Rock / Late Night)
- **Interactive FM Tuner & Rotary Hardware Knob**: Swipe the horizontal frequency dial, tap station markers, or turn the rotary tuning knob (`navigator.vibrate()` haptic feedback where supported).
- **Cinematic 1.3s Startup Airwave Lock**: Rapidly sweeps `88.1 → 91.7 → 94.5 → 96.9 → 98.3` before locking onto `VICEWAVE FM`. Respects `prefers-reduced-motion`.
- **Night Drive Mode**: Dedicated car-dashboard mode with oversized minimal controls (`>= 64px`), high-contrast frequency readout, perspective road grid, palm silhouettes, mobile landscape support, and Screen Wake Lock API integration.
- **Cassette Deck Mode**: Toggleable stylized 80s chrome cassette deck (`VICEWAVE • SIDE A • 98.3`) with dual rotating reels synced to playback state.
- **Global Persistent Playback**: Navigating between `/` (Radio), `/tracks` (The Airwaves), `/favorites` (Favorite Frequencies), and `/settings` (Control Room) never resets or interrupts audio playback.
- **Sleep Timer**: Supports `OFF`, `15 MIN`, `30 MIN`, `45 MIN`, `60 MIN`, and `END OF TRACK` with live countdown (`SLEEP IN 23:42`).
- **No App Ads**: Zero banner ads, zero popups, zero interstitials, and zero tracking SDKs.

---

## Technology

- **Framework**: Next.js 14 (App Router) + React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom CSS Variables & SVG Atmosphere
- **Motion**: Framer Motion
- **Icons**: Lucide React
- **Audio Engine**: Official YouTube IFrame Player API (`IAudioSource` abstraction)
- **Persistence**: IndexedDB (`favorites`, `history`, `preferences`, `station_state`, `track_metadata`)
- **PWA**: `manifest.webmanifest` + Custom App Shell Service Worker (`public/sw.js`)

---

## Architecture

```text
src/
├── app/
│   ├── layout.tsx          # Root layout with fonts, PWA metadata, PlayerProvider & AppShell
│   ├── page.tsx            # / (Primary Radio Console)
│   ├── tracks/page.tsx     # /tracks (The Airwaves search & genre filter catalog)
│   ├── favorites/page.tsx  # /favorites (Favorite Frequencies persisted in IndexedDB)
│   ├── settings/page.tsx   # /settings (Control Room receiver configuration)
│   └── night-drive/page.tsx# /night-drive (Direct Night Drive mode launcher)
├── components/
│   ├── Atmosphere.tsx      # SunsetBackground, PalmSilhouetteSVG, RetroGrid, GlassPanel
│   ├── ViceWaveLogo.tsx    # Original VICEWAVE FM chrome-neon brand mark
│   ├── StartupOverlay.tsx  # 1.3s airwave frequency lock sequence
│   ├── RadioConsole.tsx    # SignalMeter, RadioDisplay, FrequencyTuner, RadioKnob, StationSelector
│   ├── NowPlayingCard.tsx  # Artwork, CassetteDeckGraphic, isolated ProgressBar, PlayerControls
│   ├── NightDriveOverlay.tsx # Car-mounted portrait & landscape dashboard mode
│   ├── TrackComponents.tsx # Equalizer, TrackCard, RecentlyOnAirCarousel
│   └── NavigationAndModals.tsx # AppShell, MiniPlayer, BottomNavigation, SleepTimer, QueueDrawer
├── lib/
│   └── db.ts               # IndexedDB storage wrapper
└── player/
    ├── AudioSource.ts      # Provider-agnostic IAudioSource interface
    ├── YouTubeAudioSource.ts # Official YouTube IFrame Player API implementation
    ├── YouTubePlayer.tsx   # Persistent embed container & SHOW VIDEO / RETURN TO RADIO console
    ├── PlayerProvider.tsx  # Global playback state & station tuning engine
    ├── playerStore.ts      # Stations, initial playlist tracks, and isolated progressStore
    └── playerTypes.ts      # Core TypeScript interfaces
```

---

## YouTube Integration

ViceWave FM uses the official **YouTube IFrame Player API** initialized with playlist `PL-vB0QZpsqn5GOYHr3N2YG5qEdj07wFzk` and default broadcast track `B-8EORB783c`.
- **Video Mode**: Selecting `SHOW VIDEO` reveals the unobscured YouTube embedded player inside a dedicated broadcast overlay with a `RETURN TO RADIO` action.
- **Zero Stream Ripping**: ViceWave FM strictly uses official embedded playback and does not implement downloading, stream extraction, or ad/restriction bypassing.

---

## Local Storage & IndexedDB

All personal state remains locally on your device (`vicewave_fm_db` in IndexedDB):
- **Favorites**: Instant heart/unheart persistence.
- **Recently On Air**: Rolling log of the 20 most recently played tracks without duplicates.
- **Preferences**: Volume, mute, default station, CRT scan lines, neon glow, reduced motion, and Night Drive preferences.

---

## PWA & Offline Behavior

- **Installable**: Includes `public/manifest.webmanifest` and original SVG icons (`192x192`, `512x512`, `maskable`, `apple-touch-icon`).
- **Offline App Shell**: `public/sw.js` caches the application shell, routes, styles, and SVG graphics so ViceWave FM opens offline and displays `YOU'RE OFF THE AIR` while keeping Favorites and Listening History accessible. YouTube media is never cached offline.

---

## Development & Production Build

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

---

## Deployment

Optimized for zero-configuration deployment on **Vercel**:
1. Push the repository to GitHub/GitLab/Bitbucket.
2. Import the project into Vercel (`Framework Preset: Next.js`).
3. Deploy.

---

## Future Audio Providers

The player module is decoupled via `IAudioSource` (`src/player/AudioSource.ts`). Each `Track` includes `sourceType: 'youtube' | 'local'` and `downloadAllowed: boolean`, enabling future licensed or self-hosted audio streams to plug into `PlayerProvider` without altering the Radio UI.

---

## Legal Notice

ViceWave FM is an independent music interface and is not affiliated with or endorsed by Rockstar Games, Grand Theft Auto, or other third-party game publishers.

Music playback may be provided by external services and remains subject to their respective terms and availability.
