import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { doc, onSnapshot, setDoc, serverTimestamp } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { db, auth } from "@/lib/firebase";
import { useAuth } from "./AuthContext";

type ProfileContextValue = {
  name: string;
  photoURL: string;
  loading: boolean;
  /** Persist name and/or photo to the signed-in user's own Firestore profile. */
  saveProfile: (data: { name?: string; photoURL?: string }) => Promise<void>;
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [loading, setLoading] = useState(true);

  // Source of truth is the per-user Firestore doc `users/{uid}` — owner-only by
  // security rules, so only the user can change it and it persists across
  // devices and refreshes until they change it.
  useEffect(() => {
    if (!user) {
      setName("");
      setPhotoURL("");
      setLoading(false);
      return;
    }
    setLoading(true);
    const ref = doc(db, "users", user.uid);
    const unsub = onSnapshot(
      ref,
      (snap) => {
        const data = snap.data() as { name?: string; photoURL?: string } | undefined;
        setName(data?.name ?? user.displayName ?? "");
        setPhotoURL(data?.photoURL ?? "");
        setLoading(false);
      },
      (err) => {
        console.error("Firestore user profile onSnapshot error:", err);
        setLoading(false);
      },
    );
    return () => unsub();
  }, [user]);

  const saveProfile = async (data: { name?: string; photoURL?: string }) => {
    if (!user) throw new Error("You must be signed in to update your profile.");
    const payload: Record<string, unknown> = { updatedAt: serverTimestamp() };
    if (data.name !== undefined) payload.name = data.name;
    if (data.photoURL !== undefined) payload.photoURL = data.photoURL;
    await setDoc(doc(db, "users", user.uid), payload, { merge: true });

    // Mirror the display name to the Firebase Auth account so other features
    // (reviews, support form) pick it up too. Best-effort; ignore failures.
    if (data.name !== undefined && auth.currentUser) {
      try {
        await updateProfile(auth.currentUser, { displayName: data.name });
      } catch {
        /* non-fatal */
      }
    }
  };

  return (
    <ProfileContext.Provider value={{ name, photoURL, loading, saveProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within a ProfileProvider");
  return ctx;
}
