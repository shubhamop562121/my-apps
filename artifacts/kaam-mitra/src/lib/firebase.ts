import { initializeApp, getApps } from "firebase/app";
import { getFirestore, enableNetwork } from "firebase/firestore";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app);
export const auth = getAuth(app);

// Runtime diagnostic: confirm which Firebase project the app is actually wired to.
console.log(
  "[Firebase] runtime config →",
  "projectId:", auth.app.options.projectId,
  "| authDomain:", auth.app.options.authDomain,
);

// Keep the user signed in across refreshes and browser restarts.
setPersistence(auth, browserLocalPersistence).catch(() => {
  console.warn("Auth: could not set local persistence — using default.");
});

enableNetwork(db).catch(() => {
  console.warn("Firestore: could not enable network — will use cache.");
});
