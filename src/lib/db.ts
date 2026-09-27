import { HistoryItem, Track, UserPreferences } from '@/player/playerTypes';

const DB_NAME = 'vicewave_fm_db';
const DB_VERSION = 1;

const STORES = {
  FAVORITES: 'favorites',
  HISTORY: 'history',
  PREFERENCES: 'preferences',
  TRACK_METADATA: 'track_metadata',
  STATION_STATE: 'station_state',
} as const;

function openDatabase(): Promise<IDBDatabase | null> {
  if (typeof window === 'undefined' || !('indexedDB' in window)) {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    try {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORES.FAVORITES)) {
          db.createObjectStore(STORES.FAVORITES, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORES.HISTORY)) {
          db.createObjectStore(STORES.HISTORY, { keyPath: 'trackId' });
        }
        if (!db.objectStoreNames.contains(STORES.PREFERENCES)) {
          db.createObjectStore(STORES.PREFERENCES, { keyPath: 'key' });
        }
        if (!db.objectStoreNames.contains(STORES.TRACK_METADATA)) {
          db.createObjectStore(STORES.TRACK_METADATA, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORES.STATION_STATE)) {
          db.createObjectStore(STORES.STATION_STATE, { keyPath: 'key' });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

export async function getSavedFavorites(): Promise<string[]> {
  const db = await openDatabase();
  if (!db) return [];
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORES.FAVORITES, 'readonly');
      const store = tx.objectStore(STORES.FAVORITES);
      const req = store.getAll();
      req.onsuccess = () => {
        const items = (req.result || []) as Array<{ id: string }>;
        resolve(items.map((item) => item.id));
      };
      req.onerror = () => resolve([]);
    } catch {
      resolve([]);
    }
  });
}

export async function toggleSavedFavorite(trackId: string, isFavorite: boolean): Promise<void> {
  const db = await openDatabase();
  if (!db) return;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORES.FAVORITES, 'readwrite');
      const store = tx.objectStore(STORES.FAVORITES);
      if (isFavorite) {
        store.put({ id: trackId, savedAt: Date.now() });
      } else {
        store.delete(trackId);
      }
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

export async function clearSavedFavorites(): Promise<void> {
  const db = await openDatabase();
  if (!db) return;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORES.FAVORITES, 'readwrite');
      tx.objectStore(STORES.FAVORITES).clear();
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

export async function getSavedHistory(): Promise<HistoryItem[]> {
  const db = await openDatabase();
  if (!db) return [];
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORES.HISTORY, 'readonly');
      const req = tx.objectStore(STORES.HISTORY).getAll();
      req.onsuccess = () => {
        const list = (req.result || []) as HistoryItem[];
        list.sort((a, b) => b.playedAt - a.playedAt);
        resolve(list.slice(0, 20));
      };
      req.onerror = () => resolve([]);
    } catch {
      resolve([]);
    }
  });
}

export async function saveHistoryEntry(trackId: string): Promise<HistoryItem[]> {
  const db = await openDatabase();
  const current = await getSavedHistory();
  const filtered = current.filter((item) => item.trackId !== trackId);
  const updated: HistoryItem[] = [{ trackId, playedAt: Date.now() }, ...filtered].slice(0, 20);

  if (!db) return updated;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORES.HISTORY, 'readwrite');
      const store = tx.objectStore(STORES.HISTORY);
      store.clear();
      for (const entry of updated) {
        store.put(entry);
      }
      tx.oncomplete = () => resolve(updated);
      tx.onerror = () => resolve(updated);
    } catch {
      resolve(updated);
    }
  });
}

export async function clearSavedHistory(): Promise<void> {
  const db = await openDatabase();
  if (!db) return;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORES.HISTORY, 'readwrite');
      tx.objectStore(STORES.HISTORY).clear();
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

export async function getSavedPreferences(): Promise<Partial<UserPreferences> | null> {
  const db = await openDatabase();
  if (!db) return null;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORES.PREFERENCES, 'readonly');
      const req = tx.objectStore(STORES.PREFERENCES).get('user_prefs');
      req.onsuccess = () => {
        resolve(req.result ? (req.result.value as Partial<UserPreferences>) : null);
      };
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

export async function saveUserPreferences(prefs: UserPreferences): Promise<void> {
  const db = await openDatabase();
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem('vw_ui_prefs', JSON.stringify({
        crtEnabled: prefs.crtEnabled,
        reducedMotion: prefs.reducedMotion,
        defaultStationId: prefs.defaultStationId,
      }));
    } catch {
      // ignore localStorage errors
    }
  }
  if (!db) return;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORES.PREFERENCES, 'readwrite');
      tx.objectStore(STORES.PREFERENCES).put({ key: 'user_prefs', value: prefs });
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

export async function saveStationState(stationId: string, trackId: string): Promise<void> {
  const db = await openDatabase();
  if (!db) return;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORES.STATION_STATE, 'readwrite');
      tx.objectStore(STORES.STATION_STATE).put({
        key: 'last_session',
        stationId,
        trackId,
        updatedAt: Date.now(),
      });
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

export async function getSavedStationState(): Promise<{ stationId: string; trackId: string } | null> {
  const db = await openDatabase();
  if (!db) return null;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORES.STATION_STATE, 'readonly');
      const req = tx.objectStore(STORES.STATION_STATE).get('last_session');
      req.onsuccess = () => {
        if (req.result && req.result.stationId) {
          resolve({ stationId: req.result.stationId, trackId: req.result.trackId });
        } else {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

export async function cacheTrackMetadata(tracks: Track[]): Promise<void> {
  const db = await openDatabase();
  if (!db) return;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORES.TRACK_METADATA, 'readwrite');
      const store = tx.objectStore(STORES.TRACK_METADATA);
      for (const track of tracks) {
        store.put(track);
      }
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}
