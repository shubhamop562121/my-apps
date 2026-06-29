---
name: Auth persistence & admin password reset
description: How "stay logged in per device" and admin forgot-password work across KaamMitra app + admin panel
---

# Login persistence (both apps)
- Both `artifacts/kaam-mitra/src/lib/firebase.ts` and `artifacts/admin-panel/src/lib/firebase.ts` call `setPersistence(auth, browserLocalPersistence)`.
- **Effect:** Firebase keeps the session across refresh/browser-restart until explicit logout or cleared storage. This already satisfies "log in once per device, never ask again" — no extra code needed.
- **Why:** browserLocalPersistence is the correct Firebase web mechanism; sessionPersistence/inMemory would re-prompt.

# Admin guard must not sign out on transient errors
- Admin access = a doc exists at `admins/{lowercased-email}` (allowlist). `isAuthorizedAdmin` returns false (resolved) for "not admin" but THROWS for network/rules read failures.
- `onAuthStateChanged` catch block must NOT `signOut` on a thrown (transient) error — that forces a valid admin to re-login after a blip, defeating persistence. It now keeps the session (`setAdmin(prev=>prev)`), and `isAuthorizedAdmin` retries 3x with backoff.
- Only sign out on the explicit "not admin" branch (allowlist read succeeded and doc missing).

# Admin forgot-password
- Implemented via Firebase `sendPasswordResetEmail(auth, email)` (in admin AuthContext `resetPassword`). Login page has a "Forgot password?" → reset view → success message.
- **Why email-link, not in-app new-password field:** letting anyone set a new password without proving inbox control is insecure. New password is set on Firebase's hosted reset page reached via the email link.
- **Console requirement:** Firebase Auth Email/Password provider must be enabled and reset email template/action domain configured for links to deliver/open correctly.
- App (kaam-mitra) is phone-OTP only (no password), so password reset is admin-only by design.
