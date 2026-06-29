---
name: Live address (India-wide)
description: How the KaamMitra app resolves and stores user addresses across all of India.
---

# Live address lookup

The app's address feature is PIN-code driven, not a hardcoded city list.

- **Lookup**: `lib/pincode.ts` calls the free India Post public API
  `https://api.postalpincode.in/pincode/{PIN}` (no key). A valid 6-digit PIN
  returns `{ state, district, areas[] }` where `areas` = every post office /
  village / locality for that PIN — this is how "all cities, states, villages in
  India" is covered without bundling any dataset.
- **Persistence**: `lib/address.ts` stores a structured `SavedAddress` in
  localStorage key `km_address` (NOT Firestore). Helpers: `loadAddress`,
  `saveAddress`, `formatAddress`, `shortLocation`. Consumed by profile header and
  pre-fills the booking form.

**Why localStorage, not Firestore:** address is per-device user convenience, not
shared with admin; keeps it offline-friendly and avoids extra Firestore writes.

**How to apply / gotcha:** the edit-address page must never save stale location.
Track a `resolvedPin` that equals the current PIN only after a successful lookup;
clear `city/state/area` on invalid/notfound/error PIN; gate Save on
`resolvedPin === current pin`. Setting `CityContext.selectedCity` from the
district is display-only (home filters by category, not city).

## Auto-detect location & city-based worker filtering

The home page filters workers by the selected city via `cityMatches()` in
`lib/geo.ts`. **Gotcha:** worker `city` values and the city-picker list use
different spellings (seed data is `Bengaluru`, the list says `Bangalore`), so
filtering MUST go through `canonicalCity()`/`cityMatches()` (alias map +
case-insensitive + substring), never raw `===`. Add new aliases there when data
introduces new spelling variants.

**Why filtering exists at all:** home originally did `workers.slice(...)` and
ignored the selected city entirely — selecting a city did nothing. Any new
worker-listing surface should filter by `useCity().selectedCity` the same way.

**Empty-home rule:** if the selected city has zero workers, fall back to showing
all workers with a visible note — never strand the user with a blank list.

Location auto-detect (`detectCity()`): `navigator.geolocation` →
BigDataCloud free client-side reverse-geocode (`reverse-geocode-client`, no API
key). `CityContext` auto-detects only on first launch when no `km_selected_city`
is stored; a separate effect defaults to the first available city if detection
fails or is denied (guarded by `detecting` + `autoTried` ref to avoid loops).
