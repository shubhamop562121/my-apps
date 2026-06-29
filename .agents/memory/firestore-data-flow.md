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

**Categories: admin vs app shape mismatch (was a real bug).** The admin panel and kaam-mitra
app store/expect DIFFERENT category shapes. Admin writes `{ name, icon (emoji), status, workerCount }`;
the app expects `{ slug, label, icon, color }`. The app originally read categories from a
HARDCODED `@/data/mockData.ts` array, so admin-added categories never appeared. Fix:
`useCategories` hook reads the Firestore `categories` collection, deriving `slug =
name.toLowerCase().trim().replace(/\s+/g,'-')` (same derivation as `useWorkers` does for
`worker.category`, so worker↔category matching by slug works), `label = name`, keeps the emoji
in `icon`, filters out `status === "inactive"`, and falls back to the mockData defaults when the
collection is empty. `CategoryIcon` keys its hand-drawn SVGs by `slug`; for custom categories
not in that map it now renders the emoji (passed via an `emoji` prop). When seeding standard
categories, name them so their derived slug matches a built-in SVG key (e.g. "AC Repair" →
`ac-repair`). **Lesson:** any collection the admin manages must be read from Firestore
everywhere it's consumed — NOT just in the user app. The admin Workers page also had a
hardcoded `CATEGORIES` const driving its add/edit + filter dropdowns, so new categories
couldn't be assigned to a worker; fixed by reading `useCollection<Category>("categories")` and
mapping names. When a "changes don't show up" bug appears, grep BOTH apps for hardcoded
category/city/etc lists (`mockData` imports AND inline `const X = [...]` arrays in forms).

**Category icons = admin emoji is source of truth.** Categories store an emoji in `icon`
(admin Categories page has an emoji preset picker + text input). The app's `CategoryIcon` now
renders the emoji FIRST whenever one is present, and only falls back to its built-in hand-drawn
SVG (keyed by slug) when `icon` is empty. **Why:** previously the SVG won over the emoji for
slugs matching a built-in (plumber/electrician/…), so admin icon edits silently did nothing in
the app. So: to let admins fully control icons, emoji must take priority over the SVG.

**Notifications = derived, never stored.** Both apps build notifications by DERIVING them from
real Firestore state with stable, content-based ids — they do NOT write a `notifications`
collection. App: derives from the signed-in user's `appointments` (id = `apt-<id>-<status>`).
Admin: derives from actionable state — Pending appointments, `pending` reviews, `open` messages
(id tied to source doc). Read state lives in localStorage (app key is per-uid `km_read_notifs_<uid>`,
admin key `km_admin_read_notifs`). **Why:** the old mock list reset every login and could
duplicate; deriving + stable ids + persisted read-set means login never repeats or resets
already-seen items, and handled items (status changes / moderation) drop off automatically.

**Date fields are dual-shaped — never render or sort them raw.** Seed docs store dates as ISO
strings; docs written by either app via `addDoc`/`add` use `serverTimestamp()` → a Firestore
Timestamp object `{seconds,nanoseconds}`. So any `createdAt`/`bookedAt`/`time` can be EITHER
form at runtime. Rendering a Timestamp directly in JSX throws "Objects are not valid as a React
child"; calling string methods on it (e.g. `.localeCompare`) throws "is not a function". **Rule:**
render dates through a `formatDate(unknown)` helper (both apps have one in `lib/formatDate.ts`)
and sort by a normalized numeric ms key (see admin `useAdminNotifications.ts` `normTime`), never
by the raw field. This bit twice: admin Reviews/Messages rendered raw `createdAt`, and admin
notifications sorted with `.localeCompare` — both only crashed once the app started writing real
Timestamps.

**Advertisements have 4 positions — render every one or admin edits silently vanish.** The admin
Advertisements page offers positions `Home Top`, `Home Bottom`, `Category Page`, `Worker Detail`.
The app must surface each: shared `components/AdBanner.tsx` (wraps `useAdvertisements(position)`,
shows first active ad) is mounted in `home.tsx` (Home Top + Home Bottom), `category.tsx` (Category
Page), and `worker.tsx` (Worker Detail). `useAdvertisements` filters status active + date window +
position client-side (no composite index). **Lesson:** when an admin field is an enum of slots,
audit that the app renders ALL slot values, not just the obvious ones.

**Client write validation.** App `addReview` (hooks/useReviews.ts) and `sendSupportMessage`
(lib/support.ts) clamp/validate before `addDoc`: rating 1–5 integer, trimmed + length-capped
text, required fields throw. App writes reviews `status:"pending"` and messages `status:"open"`;
admin enums must match (`approved|pending|removed`, `open|resolved`). Until Firestore rules are
deployed these are the only guard against spam/malformed docs.

**Open risk:** Security rules in `firestore.rules` are written but only take effect once the
user deploys them in their Firebase project; until then the DB is still open/permissive.

## Admin worker assignment (Appointments page)

The admin assigns a worker to an Approved appointment via a **searchable worker
picker** (not a plain dropdown): filters active workers by name/category/city and
shows each worker's location (city), category, experience, rating, verified badge.
Results are sorted nearby-first by checking if the worker's `city` appears in the
appointment `address` string, then by rating.

**Gotcha:** the picker's `assignWorker` selection is component-level state shared
across appointments — it MUST be reset when the selected appointment changes
(effect on `selectedId`), otherwise a leftover pick can be assigned to the wrong
appointment. Same applies to reject-note state.

Assignment writes `assignedWorkerName` + `assignedWorkerId` via `updateAppointment`;
the details panel re-derives the assigned worker's city/phone by looking up
`assignedWorkerId` in the live workers list (not stored on the appointment).

## Reviews moderation policy + verified flow

Reviews use **post-moderation**: the user app writes new reviews with
`status:"approved"` so they appear on the worker profile immediately
(`useReviews` only renders approved). Admins remove abusive ones from the admin
Reviews page (update/delete). `firestore.rules` reviews block allows signed-in
`create` (validates rating 1-5 + status=="approved"), admin-only update/delete.

**Gotcha:** `firestore.rules` is NOT auto-deployed — it must be published manually
(Firebase console → Firestore → Rules, or `firebase deploy --only firestore:rules`).
Any rule change here (e.g. allowing user review creation) is inert until published.

Worker `verified` is set by the admin via a "Mark as verified" checkbox in the
Add/Edit Worker modal (admin Workers page) → drives the Verified badge in the
admin table and the main app worker profile. Default false on new workers.
