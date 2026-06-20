import { createContext, useContext, useState, ReactNode } from "react";

type Admin = { email: string; name: string };

type AuthContextType = {
  admin: Admin | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const CREDS_KEY = "km_admin_creds";
const DEFAULT_EMAIL = "admin@kaammitra.in";
const DEFAULT_PASSWORD = "admin123";

export function getAdminCreds(): { email: string; password: string } {
  try {
    const raw = localStorage.getItem(CREDS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { email: DEFAULT_EMAIL, password: DEFAULT_PASSWORD };
}

export function saveAdminCreds(email: string, password: string) {
  localStorage.setItem(CREDS_KEY, JSON.stringify({ email, password }));
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(() => {
    const stored = sessionStorage.getItem("km_admin");
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    const creds = getAdminCreds();
    if (email === creds.email && password === creds.password) {
      const user = { email, name: "Admin" };
      setAdmin(user);
      sessionStorage.setItem("km_admin", JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setAdmin(null);
    sessionStorage.removeItem("km_admin");
  };

  return <AuthContext.Provider value={{ admin, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
