import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

type Admin = { uid: string; email: string; name: string };

type AuthContextType = {
  admin: Admin | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

/**
 * An account is an admin only if a document keyed by its (lowercased) email
 * exists in the `admins` collection. This collection is managed manually in the
 * Firebase console / locked by security rules, so it is the single source of
 * truth for who may access the admin panel.
 */
async function isAuthorizedAdmin(email: string, attempts = 3): Promise<boolean> {
  const key = email.trim().toLowerCase();
  console.log("[AdminAuth] checking admin allowlist for:", key);
  let lastErr: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      const snap = await getDoc(doc(db, "admins", key));
      console.log("[AdminAuth] admin allowlist match:", snap.exists());
      return snap.exists();
    } catch (err) {
      // A thrown error means a transient read failure (network/rules), NOT a
      // definitive "not an admin". Retry a few times before giving up so a blip
      // doesn't force a valid admin to sign in again.
      lastErr = err;
      console.warn(`[AdminAuth] allowlist read failed (attempt ${i + 1}/${attempts})`, err);
      await new Promise((r) => setTimeout(r, 400 * (i + 1)));
    }
  }
  throw lastErr;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  // React to Firebase auth state so refreshes keep the admin signed in
  // (and so a revoked/non-admin account is rejected immediately).
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user || !user.email) {
        setAdmin(null);
        setLoading(false);
        return;
      }
      try {
        const ok = await isAuthorizedAdmin(user.email);
        if (ok) {
          setAdmin({
            uid: user.uid,
            email: user.email,
            name: user.displayName || "Admin",
          });
        } else {
          console.warn("[AdminAuth] signed-in account is not an admin — signing out");
          await signOut(auth);
          setAdmin(null);
        }
      } catch (err) {
        // Transient verification failure (e.g. offline). Do NOT sign out — that
        // would force a valid admin to log in again after a network blip, which
        // defeats "stay signed in on this device". Keep the Firebase session and
        // any existing admin state; access is re-verified on the next auth event.
        console.error("[AdminAuth] admin verification failed (keeping session):", err);
        setAdmin((prev) => prev);
      } finally {
        setLoading(false);
      }
    });
    return unsub;
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    console.log("[AdminAuth] login attempt:", email);
    const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
    const ok = await isAuthorizedAdmin(cred.user.email ?? email);
    if (!ok) {
      await signOut(auth);
      console.warn("[AdminAuth] login rejected — not on admin allowlist:", email);
      throw new Error("not-admin");
    }
    console.log("[AdminAuth] login success:", email);
    // onAuthStateChanged sets the admin state.
  };

  const logout = async () => {
    console.log("[AdminAuth] logging out");
    await signOut(auth);
    setAdmin(null);
  };

  /**
   * Sends a Firebase password-reset email. The link in that email is the only
   * place a new password can be set — this keeps resets secure (an attacker who
   * doesn't control the inbox can't change the password).
   */
  const resetPassword = async (email: string): Promise<void> => {
    const target = email.trim();
    console.log("[AdminAuth] password reset requested for:", target);
    await sendPasswordResetEmail(auth, target);
    console.log("[AdminAuth] password reset email sent");
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
