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
