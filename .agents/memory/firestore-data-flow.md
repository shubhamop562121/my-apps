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

**Open risk:** Firestore security rules are still open/permissive. Admin panel is NOT
Firebase-authenticated, yet reads PII (phone/address). Locking rules down will require giving
admin a Firebase-auth path or it will break admin reads/writes.
