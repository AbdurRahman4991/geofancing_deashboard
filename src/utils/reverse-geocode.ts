const CACHE_KEY = 'reverse-geocode-cache-v1';
const GEOCODER_BASE_URL = import.meta.env.VITE_NOMINATIM_BASE_URL || 'https://nominatim.openstreetmap.org';
const addressCache = new Map<string, string>();
let nextRequestAt = 0;
let requestQueue: Promise<void> = Promise.resolve();

function coordinateKey(latitude: number, longitude: number) {
  return `${GEOCODER_BASE_URL}|${latitude.toFixed(6)},${longitude.toFixed(6)}`;
}

function readCachedAddress(key: string): string | undefined {
  const memoryValue = addressCache.get(key);
  if (memoryValue) return memoryValue;

  try {
    const stored = localStorage.getItem(CACHE_KEY);
    const parsed: Record<string, string> = stored ? JSON.parse(stored) : {};
    const value = parsed[key];
    if (value) addressCache.set(key, value);
    return value;
  } catch {
    return undefined;
  }
}

function cacheAddress(key: string, value: string) {
  addressCache.set(key, value);
  try {
    const stored = localStorage.getItem(CACHE_KEY);
    const parsed: Record<string, string> = stored ? JSON.parse(stored) : {};
    parsed[key] = value;
    localStorage.setItem(CACHE_KEY, JSON.stringify(parsed));
  } catch {
    // Geocoding still works if browser storage is unavailable.
  }
}

export function reverseGeocode(latitude: number, longitude: number): Promise<string> {
  const key = coordinateKey(latitude, longitude);
  const cachedAddress = readCachedAddress(key);
  if (cachedAddress) return Promise.resolve(cachedAddress);

  let resolveResult!: (address: string) => void;
  let rejectResult!: (reason: unknown) => void;
  const result = new Promise<string>((resolve, reject) => {
    resolveResult = resolve;
    rejectResult = reject;
  });

  requestQueue = requestQueue.then(async () => {
    try {
      const cached = readCachedAddress(key);
      if (cached) {
        resolveResult(cached);
        return;
      }

      const waitMs = Math.max(0, nextRequestAt - Date.now());
      if (waitMs) await new Promise((resolve) => window.setTimeout(resolve, waitMs));
      nextRequestAt = Date.now() + 1100;

      const params = new URLSearchParams({
        format: 'jsonv2',
        lat: String(latitude),
        lon: String(longitude),
        zoom: '18',
        addressdetails: '1',
      });
      const response = await fetch(`${GEOCODER_BASE_URL.replace(/\/$/, "")}/reverse?${params.toString()}`);
      if (!response.ok) throw new Error(`Reverse geocoding failed (${response.status})`);

      const place: { display_name?: string } = await response.json();
      if (!place.display_name) throw new Error('No address found for these coordinates');
      cacheAddress(key, place.display_name);
      resolveResult(place.display_name);
    } catch (error) {
      rejectResult(error);
    }
  });

  return result;
}


