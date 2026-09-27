'use client';

import React, { useState } from 'react';
import { usePlayer } from '@/player/PlayerProvider';
import { GlassPanel } from '@/components/Atmosphere';
import { ViceWaveLogo } from '@/components/ViceWaveLogo';
import { Check, RotateCcw, Trash2 } from 'lucide-react';

interface ToggleRowProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}

const ToggleRow: React.FC<ToggleRowProps> = ({
  label,
  description,
  checked,
  onChange,
}) => (
  <div className="flex items-center justify-between gap-3 py-2.5 border-b border-white/[0.06] last:border-b-0">
    <div>
      <div className="text-xs font-semibold text-white">{label}</div>
      {description && (
        <div className="text-[11px] text-white/55 mt-0.5">{description}</div>
      )}
    </div>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`min-w-[52px] h-7 rounded-full p-1 transition-colors flex items-center ${
        checked
          ? 'bg-gradient-to-r from-[#FF2DAA] to-[#27E5FF] justify-end shadow-neon-cyan'
          : 'bg-white/10 border border-white/15 justify-start'
      }`}
    >
      <span className="w-5 h-5 rounded-full bg-white shadow" />
    </button>
  </div>
);

export default function SettingsPage() {
  const {
    preferences,
    updatePreferences,
    stations,
    clearAllFavorites,
    clearAllHistory,
    resetAllPreferences,
  } = usePlayer();

  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  const flashNotice = (msg: string) => {
    setStatusNotice(msg);
    setTimeout(() => setStatusNotice(null), 2400);
  };

  return (
    <div className="w-full flex flex-col pt-3 space-y-4">
      {/* Page Header */}
      <header className="px-1">
        <div className="text-[10px] font-mono tracking-[0.28em] text-[#27E5FF] uppercase">
          RECEIVER CONFIGURATION
        </div>
        <h1 className="text-2xl sm:text-3xl font-display font-black italic tracking-[0.18em] text-white uppercase mt-0.5">
          CONTROL ROOM
        </h1>
      </header>

      {statusNotice && (
        <div
          role="status"
          className="p-3 rounded-xl bg-[#27E5FF]/15 border border-[#27E5FF] text-xs font-mono text-[#27E5FF] flex items-center gap-2"
        >
          <Check className="w-4 h-4" />
          <span>{statusNotice}</span>
        </div>
      )}

      {/* PLAYBACK SECTION */}
      <GlassPanel crt={preferences.crtEnabled} className="p-4">
        <h2 className="text-[11px] font-mono font-bold tracking-[0.24em] text-[#27E5FF] uppercase mb-2">
          PLAYBACK
        </h2>
        <ToggleRow
          label="Autoplay"
          description="Automatically start broadcast when selecting tracks or stations"
          checked={preferences.autoplay}
          onChange={(val) => updatePreferences({ autoplay: val })}
        />
        <ToggleRow
          label="Resume last station"
          description="Tune back into your most recent frequency on startup"
          checked={preferences.resumeLastStation}
          onChange={(val) => updatePreferences({ resumeLastStation: val })}
        />
        <ToggleRow
          label="Remember volume"
          description="Persist preferred receiver output gain on this device"
          checked={preferences.rememberVolume}
          onChange={(val) => updatePreferences({ rememberVolume: val })}
        />
      </GlassPanel>

      {/* RADIO SECTION */}
      <GlassPanel crt={preferences.crtEnabled} className="p-4">
        <h2 className="text-[11px] font-mono font-bold tracking-[0.24em] text-[#FF2DAA] uppercase mb-2">
          RADIO
        </h2>

        <div className="py-2.5 border-b border-white/[0.06] flex items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold text-white">Default station</div>
            <div className="text-[11px] text-white/55 mt-0.5">
              Primary frequency locked on cold boot
            </div>
          </div>
          <select
            value={preferences.defaultStationId}
            onChange={(e) =>
              updatePreferences({ defaultStationId: e.target.value })
            }
            aria-label="Default station"
            className="min-h-[40px] px-3 rounded-xl bg-[#090514] border border-white/20 text-xs font-mono text-[#27E5FF] focus:outline-none focus:border-[#27E5FF]"
          >
            {stations.map((st) => (
              <option key={st.id} value={st.id}>
                {st.frequency} — {st.shortName}
              </option>
            ))}
          </select>
        </div>

        <ToggleRow
          label="Tuning effects"
          description="Show physical rotary knob and tactile frequency stepping"
          checked={preferences.tuningEffects}
          onChange={(val) => updatePreferences({ tuningEffects: val })}
        />
        <ToggleRow
          label="Station transition"
          description="Animate digital frequency roll when switching stations"
          checked={preferences.stationTransition}
          onChange={(val) => updatePreferences({ stationTransition: val })}
        />
      </GlassPanel>

      {/* VISUALS SECTION */}
      <GlassPanel crt={preferences.crtEnabled} className="p-4">
        <h2 className="text-[11px] font-mono font-bold tracking-[0.24em] text-[#27E5FF] uppercase mb-2">
          VISUALS
        </h2>
        <ToggleRow
          label="CRT scan lines"
          description="Subtle 3% smoked-glass scan lines on receiver panels"
          checked={preferences.crtEnabled}
          onChange={(val) => updatePreferences({ crtEnabled: val })}
        />
        <ToggleRow
          label="Neon glow"
          description="Atmospheric pink and cyan dashboard ambient luminescence"
          checked={preferences.neonGlow}
          onChange={(val) => updatePreferences({ neonGlow: val })}
        />
        <ToggleRow
          label="Background animation"
          description="Gentle horizon pulse and coastal skyline atmosphere"
          checked={preferences.backgroundAnimation}
          onChange={(val) => updatePreferences({ backgroundAnimation: val })}
        />
        <ToggleRow
          label="Reduced motion"
          description="Minimize transitions and skip startup tuning sequence"
          checked={preferences.reducedMotion}
          onChange={(val) => updatePreferences({ reducedMotion: val })}
        />
      </GlassPanel>

      {/* NIGHT DRIVE SECTION */}
      <GlassPanel crt={preferences.crtEnabled} className="p-4">
        <h2 className="text-[11px] font-mono font-bold tracking-[0.24em] text-[#FF7849] uppercase mb-2">
          NIGHT DRIVE
        </h2>
        <ToggleRow
          label="Keep screen awake where supported"
          description="Request Screen Wake Lock while Night Drive mode is active"
          checked={preferences.keepScreenAwake}
          onChange={(val) => updatePreferences({ keepScreenAwake: val })}
        />
        <ToggleRow
          label="Simplified controls"
          description="Prioritize oversized dashboard buttons for car mounts"
          checked={preferences.simplifiedControls}
          onChange={(val) => updatePreferences({ simplifiedControls: val })}
        />
      </GlassPanel>

      {/* STORAGE SECTION */}
      <GlassPanel crt={preferences.crtEnabled} className="p-4">
        <h2 className="text-[11px] font-mono font-bold tracking-[0.24em] text-[#FF2DAA] uppercase mb-3">
          STORAGE
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <button
            type="button"
            onClick={async () => {
              await clearAllFavorites();
              flashNotice('FAVORITES CLEARED FROM DEVICE');
            }}
            className="min-h-[44px] px-3 rounded-xl bg-white/5 hover:bg-[#FF2DAA]/15 border border-white/10 hover:border-[#FF2DAA] text-xs font-mono text-white/80 flex items-center justify-center gap-2 transition"
          >
            <Trash2 className="w-3.5 h-3.5 text-[#FF2DAA]" />
            <span>Clear favorites</span>
          </button>

          <button
            type="button"
            onClick={async () => {
              await clearAllHistory();
              flashNotice('LISTENING HISTORY CLEARED');
            }}
            className="min-h-[44px] px-3 rounded-xl bg-white/5 hover:bg-[#27E5FF]/15 border border-white/10 hover:border-[#27E5FF] text-xs font-mono text-white/80 flex items-center justify-center gap-2 transition"
          >
            <Trash2 className="w-3.5 h-3.5 text-[#27E5FF]" />
            <span>Clear listening history</span>
          </button>

          <button
            type="button"
            onClick={async () => {
              await resetAllPreferences();
              flashNotice('PREFERENCES RESET TO FACTORY');
            }}
            className="min-h-[44px] px-3 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-xs font-mono text-white/80 flex items-center justify-center gap-2 transition"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#FFB347]" />
            <span>Reset preferences</span>
          </button>
        </div>
      </GlassPanel>

      {/* ABOUT SECTION */}
      <GlassPanel crt={preferences.crtEnabled} className="p-5 text-center">
        <div className="text-[10px] font-mono tracking-[0.24em] text-white/45 uppercase mb-3">
          ABOUT
        </div>
        <ViceWaveLogo size="md" showTagline showPromise />
        <div className="mt-3 inline-block px-3 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-white/70">
          Version 1.0
        </div>

        <div className="mt-4 pt-4 border-t border-white/10 text-[11px] text-white/55 leading-relaxed space-y-2 text-left">
          <p>
            ViceWave FM is an independent music interface and is not affiliated with or endorsed by Rockstar Games, Grand Theft Auto, or other third-party game publishers.
          </p>
          <p>
            Music playback may be provided by external services and remains subject to their respective terms and availability.
          </p>
        </div>
      </GlassPanel>
    </div>
  );
}
