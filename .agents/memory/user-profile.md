---
name: Editable user profile (name + photo)
description: How KaamMitra stores/edits the signed-in user's display name and avatar, and the stale-snapshot pitfall when editing.
---

# Profile storage

The signed-in user's editable profile (display name + avatar) lives in the Firestore
doc `users/{uid}`. `ProfileContext` subscribes via `onSnapshot` and exposes
`{ name, photoURL, loading, saveProfile }`. `saveProfile` does `setDoc(..., { merge: true })`
and best-effort mirrors `name` to Firebase Auth `displayName` (so worker reviews / help
forms can reuse it). Owner-only access is modeled in `firestore.rules`
(`users/{id}` requires `request.auth.uid == id`).

**Photo is stored inline as a compressed JPEG data URL** (`lib/image.ts compressImage`,
~320px / quality 0.82, ~20-50KB) directly in the Firestore doc. **Why:** avoids needing
Firebase Storage setup; stays well under the 1MB doc limit. Do not switch to Storage unless
photos must get large.

# Pitfall: hydrating an edit form from an async snapshot

Edit forms must NOT seed local `useState` directly from context values that load
asynchronously (the snapshot resolves after first render). Two rules that prevent
**silently wiping saved data**:
- Hydrate form state in a `useEffect` once `loading` is false, guarded by a `hydrated` ref
  (and gate the form UI on `loading && !hydrated`), so empty initial values never stick.
- On save, only include a field (e.g. `photoURL`) when the user actually changed it
  (track a `photoChanged` flag) — a name-only edit must never send an empty photo.

**Why:** the first implementation initialized `useState(savedPhoto)` (empty before snapshot)
and always sent `photoURL: photo`, so saving a name change could erase an existing photo —
violating the "profile must not be removed / persist" requirement.

# Caveat

Owner-only enforcement only holds once `firestore.rules` is actually published in the
Firebase Console. With rules undeployed (DB open), the app UI still only lets a user edit
their own doc, but the DB itself isn't enforcing it.
