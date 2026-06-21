---
name: Firebase Phone OTP auth (kaam-mitra)
description: Non-obvious requirements and gotchas for Firebase phone-number OTP login in the Replit env
---

# Firebase Phone OTP auth

The kaam-mitra app uses Firebase modular SDK phone auth (RecaptchaVerifier + signInWithPhoneNumber).

## Console actions the user MUST do (SMS won't send otherwise)
Real SMS delivery is blocked until the project owner does these in the Firebase Console — they cannot be done from code:
- Authentication → Sign-in method → enable **Phone** provider.
- Authentication → Settings → **Authorized domains** → add the Replit dev domain (the `*.replit.dev` host) AND any published deploy domain. Without this, reCAPTCHA throws `auth/argument-error` / domain-not-authorized.
- For local testing without burning SMS quota: add **test phone numbers** (Authentication → Sign-in method → Phone → "Phone numbers for testing"), e.g. a number + fixed code like `123456`.

**Why:** these are server-side project settings; the code is correct but inert until they're enabled.

## "Any OTP works" is usually NOT an OTP bug
`confirmationResult.confirm(otp)` is server-validated by Firebase and rejects wrong codes — the crypto is fine. A reported "any OTP logs in / bypass login" almost always means **protected routes aren't gated on auth state**: anyone navigating by URL (or a guest "Explore without account" button linking straight to /home) enters the app without ever verifying. Fix = a route guard (`AuthGate`) that checks `onAuthStateChanged` user before rendering protected pages, plus removing guest-bypass entry points.
- Guard race: after a correct `confirm(otp)`, navigating to the protected page can evaluate before the `user` React state propagates → false redirect to /welcome. Fall back to `auth.currentUser` (set synchronously once confirm resolves) in the guard to avoid the flash.
- **Client route guards are NOT an authorization boundary** — Firestore Security Rules must also require auth, or data is exposed regardless of client gating.

## Code gotchas
- Firebase v12 `RecaptchaVerifier` signature is `new RecaptchaVerifier(auth, containerIdOrEl, params)` — **auth is the FIRST arg** (changed from older v9 order). Use `{ size: "invisible" }`.
- On `signInWithPhoneNumber` failure, call `recaptcha.clear()` and null the ref so a retry builds a fresh verifier; a stale/used verifier fails silently.
- `confirmationResult` is in-memory only (held in a ref in AuthProvider). A hard refresh on `/otp` loses it → must resend. Detect via `auth/no-confirmation` custom code.
