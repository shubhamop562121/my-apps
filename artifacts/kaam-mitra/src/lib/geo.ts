/**
 * Location helpers for KaamMitra.
 *
 * 1. detectCity() — asks the browser for the user's GPS position and reverse-
 *    geocodes it to a city + state using BigDataCloud's free client-side API
 *    (no API key, designed for in-browser reverse geocoding).
 * 2. cityMatches() — tolerant comparison so a detected/selected city still
 *    matches worker records that use a different but equivalent spelling
 *    (e.g. "Bengaluru" vs "Bangalore", "New Delhi" vs "Delhi").
 */

export type DetectedLocation = { city: string; state: string };

// Canonical aliases so common Indian city spellings resolve to one key.
const CITY_ALIASES: Record<string, string> = {
  bengaluru: "bangalore",
  bangalore: "bangalore",
  bombay: "mumbai",
  mumbai: "mumbai",
  calcutta: "kolkata",
  kolkata: "kolkata",
  madras: "chennai",
  chennai: "chennai",
  poona: "pune",
  pune: "pune",
  gurugram: "gurgaon",
  gurgaon: "gurgaon",
  delhi: "delhi",
  "new delhi": "delhi",
};

export function canonicalCity(name: string): string {
  const key = name.trim().toLowerCase();
  return CITY_ALIASES[key] ?? key;
}

/** True if two city names refer to the same place (alias- and case-tolerant). */
export function cityMatches(a: string, b: string): boolean {
  if (!a || !b) return false;
  const ca = canonicalCity(a);
  const cb = canonicalCity(b);
  if (ca === cb) return true;
  return ca.includes(cb) || cb.includes(ca);
}

async function reverseGeocode(lat: number, lon: number): Promise<DetectedLocation> {
  const res = await fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`,
  );
  if (!res.ok) throw new Error("Could not look up your location. Please try again.");
  const data = (await res.json()) as {
    city?: string;
    locality?: string;
    principalSubdivision?: string;
  };
  const city = (data.city || data.locality || data.principalSubdivision || "").trim();
  const state = (data.principalSubdivision || "").trim();
  if (!city) throw new Error("Couldn't determine your city. Please pick it manually.");
  return { city, state };
}

/** Resolve the user's current city via GPS. Rejects with a friendly message. */
export function detectCity(): Promise<DetectedLocation> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
      reject(new Error("Location isn't supported on this device."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          resolve(await reverseGeocode(pos.coords.latitude, pos.coords.longitude));
        } catch (err) {
          reject(err instanceof Error ? err : new Error("Location lookup failed."));
        }
      },
      (err) => {
        reject(
          new Error(
            err.code === err.PERMISSION_DENIED
              ? "Location access was blocked. Allow it to auto-detect your city."
              : "Couldn't get your location. Please pick your city manually.",
          ),
        );
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 10 * 60 * 1000 },
    );
  });
}
