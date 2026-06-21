# KaamMitra — Production Deployment Guide

This guide covers the steps that must run **outside Replit** (in your Firebase
console and on a machine with Android Studio) to take KaamMitra to production:

1. Lock down the Firebase database with security rules
2. Create the admin account and authorize it
3. Build the Android app (APK for direct install, AAB for Play Store)
4. Sign the app and publish to Google Play
5. Make Phone/OTP login work inside the mobile app

---

## 1. Deploy Firestore security rules

The rules live in [`firestore.rules`](./firestore.rules). They make the database
production-safe: catalog data (workers, categories, cities, ads) is public-read /
admin-write, users only see their own appointments, and only authorized admins
can read PII or manage data.

**Option A — Firebase console (quickest)**
1. Open <https://console.firebase.google.com> → project **kaammitra-ced99**.
2. Go to **Firestore Database → Rules**.
3. Paste the contents of `firestore.rules` and click **Publish**.

**Option B — Firebase CLI**
```bash
npm i -g firebase-tools
firebase login
firebase use kaammitra-ced99
firebase deploy --only firestore:rules
```

---

## 2. Create the admin account

The admin panel now uses **real Firebase Authentication** plus an allowlist.
An account can sign in to the admin panel only if BOTH are true:
- it exists in Firebase Authentication (email/password), and
- there is a document in the `admins` collection whose **ID is the lowercased email**.

**Steps (one-time):**
1. Firebase console → **Authentication → Users → Add user**. Enter the admin
   email (e.g. `admin@kaammitra.in`) and a strong password.
2. Firebase console → **Firestore Database → Start collection** → collection ID
   `admins`. Add a document whose **Document ID is the exact lowercased email**
   (e.g. `admin@kaammitra.in`). Add any field, e.g. `role: "admin"`.
3. Open the admin panel and sign in with that email + password.

> The old demo login (`admin@kaammitra.in` / `admin123`) no longer works — it was
> removed. Add/remove admins anytime by adding/deleting docs in `admins`.
> Admins can change their own password from the panel's **Settings** page.

---

## 3. Build the Android app (Capacitor)

The kaam-mitra web app is wrapped with [Capacitor](https://capacitorjs.com).
Run these on a machine with **Node.js, Java 17+, and Android Studio** installed
(this cannot be done inside Replit — there is no Android SDK here).

```bash
# from the repo root
pnpm install

# 1. Build web assets + create the native Android project (first time only)
pnpm --filter @workspace/kaam-mitra run build:mobile
pnpm --filter @workspace/kaam-mitra exec cap add android

# 2. After any web code change, rebuild + copy assets into the native project
pnpm --filter @workspace/kaam-mitra run cap:sync

# 3. Open the project in Android Studio
pnpm --filter @workspace/kaam-mitra run cap:open
```

You must add your Firebase web config as environment variables at build time
(the same `VITE_FIREBASE_*` values used in Replit), e.g.:
```bash
VITE_FIREBASE_API_KEY=... VITE_FIREBASE_AUTH_DOMAIN=... \
VITE_FIREBASE_PROJECT_ID=... VITE_FIREBASE_STORAGE_BUCKET=... \
VITE_FIREBASE_MESSAGING_SENDER_ID=... VITE_FIREBASE_APP_ID=... \
pnpm --filter @workspace/kaam-mitra run cap:sync
```

### Build a test APK (installable without Play Store)
In Android Studio: **Build → Build Bundle(s) / APK(s) → Build APK(s)**.
The debug APK is written to
`artifacts/kaam-mitra/android/app/build/outputs/apk/debug/app-debug.apk`.
Copy it to an Android phone (enable "Install from unknown sources") and install.

---

## 4. Sign the app & publish to Google Play

### Generate a signing key (one-time)
```bash
keytool -genkey -v -keystore kaammitra-release.keystore \
  -alias kaammitra -keyalg RSA -keysize 2048 -validity 10000
```
Keep this keystore + passwords safe — you need the same key for every future update.

### Configure signing
Create `artifacts/kaam-mitra/android/keystore.properties` (do **not** commit it):
```
storeFile=/absolute/path/to/kaammitra-release.keystore
storePassword=YOUR_STORE_PASSWORD
keyAlias=kaammitra
keyPassword=YOUR_KEY_PASSWORD
```
Then wire it into `android/app/build.gradle` (`signingConfigs` + `buildTypes.release`)
as shown in the [Capacitor Android signing docs](https://capacitorjs.com/docs/android/deploying-to-google-play).

### Build the release AAB (required by Play Store)
In Android Studio: **Build → Generate Signed Bundle / APK → Android App Bundle**,
select your keystore, choose **release**. Output:
`android/app/build/outputs/bundle/release/app-release.aab`.

### Publish
1. Create a developer account at <https://play.google.com/console> (one-time $25).
2. Create an app → fill store listing, content rating, privacy policy, data safety.
3. Upload the `.aab` to a release track (Internal testing → Production).
4. Submit for review.

---

## 5. Phone/OTP login inside the mobile app (important)

KaamMitra uses Firebase **Phone Auth**, which relies on reCAPTCHA. reCAPTCHA does
**not** work reliably inside an Android WebView, so OTP may fail in the packaged
APK even though it works in the browser. To fix this for production:

- Add the **`@capacitor-firebase/authentication`** plugin and use its native
  phone sign-in (it uses Google Play Integrity instead of reCAPTCHA), **or**
- Register your app's **SHA-1 / SHA-256** fingerprints in the Firebase console
  (Project settings → Your apps → Android) and download `google-services.json`.

Get the SHA fingerprints with:
```bash
keytool -list -v -keystore kaammitra-release.keystore -alias kaammitra
```

Test OTP on a **real device** (emulators often can't receive SMS).

---

## Quick reference

| Task | Where it runs |
|------|---------------|
| Firestore CRUD + real-time sync (app & admin) | ✅ Already live |
| Real admin login + role check | ✅ Already live (needs steps 1–2 to activate) |
| Security rules | Firebase console / CLI |
| Build & sign APK / AAB | Android Studio (your machine) |
| Play Store publishing | Google Play Console |
