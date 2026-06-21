---
name: KaamMitra ↔ Admin Firestore data flow
description: How the user app and admin panel share data; the integration boundary is Firestore collections, not mock data.
---

# Firestore is the integration boundary between the two apps

KaamMitra (user app, `artifacts/kaam-mitra`) and the Admin Panel (`artifacts/admin-panel`)
are separate artifacts that share **no code**. They communicate only through Firestore
collections (`workers`, `appointments`). Both have their own `lib/firebase.ts` pointing at
the same project via `VITE_FIREBASE_*` env vars.

**Rule:** any user-facing entity that must show up in admin must be *written* by the user app
(`addDoc`) and *read* by admin (`onSnapshot`), with field shapes kept aligned by hand (no
shared TS type across apps). When adding a new shared entity, mirror the `useWorkers.ts`
pattern in both apps.

**Why:** the original appointments bug was that the user app only used in-memory React state
(seeded with mock data) and the admin page read from a mock array — so nothing ever reached
Firestore and admin saw nothing.

**Conventions now in place for `appointments`:**
- User app writes with `userId` (= `auth.currentUser.uid`, required — throws if missing),
  `status: "Pending"`, `bookedAt` (date string), `createdAt: serverTimestamp()`.
- User app reads only its own docs: `query(collection, where("userId","==",uid))`,
  re-subscribing inside `onAuthStateChanged` (currentUser may be null on first mount).
- Admin reads ALL docs (no auth filter) and writes status via `updateDoc`.
- Sort newest-first client-side by `createdAt.toMillis()` (avoids composite-index requirement).

**Admin CRUD pattern:** all admin modules (users, categories, cities, reviews,
advertisements, messages) use a single generic real-time hook
(`admin-panel/src/hooks/useCollection.ts`): `onSnapshot` live read + `add/update/remove`
with `serverTimestamp()`, console.logs on every op, throws on failure so pages surface
real errors (modals stay open on failure). Collection names: `users`, `categories`,
`cities`, `reviews`, `advertisements` (NOT `ads`), `messages`. The Seed page seeds every
collection (each only if empty). Dashboard counts read live from these collections.

**Gotcha — Firestore doc-id spread order:** when building an item from a snapshot, write
`{ ...raw, id: d.id }`, never `{ id: d.id, ...raw }`. If a doc stores its own `id` field
(legacy/seeded data), the wrong-order spread lets `raw.id` clobber the real document ID and
later update/delete target the wrong/nonexistent doc. (Per-field-mapped hooks like
`useWorkers` are safe because `id: d.id` is a discrete property, not part of a spread.)

**Admin authentication (real):** admin panel uses Firebase email/password auth + an
allowlist. An account is admin only if a doc exists in the `admins` collection keyed by the
**lowercased email** (`admins/{email}`). Bootstrap is manual: create the Auth user in the
Firebase console AND add the `admins/{email}` doc (security rules forbid client writes to
`admins`). The old hardcoded `admin@kaammitra.in / admin123` login was removed.
`AuthContext` gates on `onAuthStateChanged` + an async allowlist check, so it exposes a
`loading` flag the router MUST honor (otherwise refresh flashes the login page before auth
resolves). Settings page changes password via reauthenticate + `updatePassword` (email is
read-only because it's the allowlist key).

**Security rules:** live in repo-root `firestore.rules` (NOT auto-deployed — paste in console
or `firebase deploy --only firestore:rules`). Model: catalog (workers/categories/cities/
advertisements) public-read+admin-write; appointments create-if-signed-in with
`userId==auth.uid`, read own or admin; users own-doc or admin; messages create-public +
admin-read; `isAdmin()` checks `exists(admins/$(email.lower()))`. Rules match the app's real
query shapes (kaam-mitra only writes appointments tagged with userId, reads workers).

**Capacitor mobile build:** kaam-mitra wraps as Android via Capacitor (`capacitor.config.ts`,
appId `in.kaammitra.app`, webDir `dist/public`). Gotcha: `vite.config.ts` throws unless PORT
AND BASE_PATH are set even for `build`, so the `build:mobile` script sets them inline
(`BASE_PATH=/ PORT=3000`) — base must be `/` for the WebView. APK/AAB build + signing CANNOT
run in Replit (no Android SDK); see `KaamMitra-Deployment-Guide.md`. Phone/OTP auth uses
reCAPTCHA which fails in Android WebView — needs `@capacitor-firebase/authentication` native
plugin or SHA fingerprints for production.

**Open risk:** Security rules in `firestore.rules` are written but only take effect once the
user deploys them in their Firebase project; until then the DB is still open/permissive.
