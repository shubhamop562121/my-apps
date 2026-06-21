import {
  createContext, useContext, useEffect, useRef, useState, type ReactNode,
} from "react";
import {
  RecaptchaVerifier, signInWithPhoneNumber, onAuthStateChanged, signOut,
  type ConfirmationResult, type User,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  otpSent: boolean;
  sendOTP: (phoneNumber: string) => Promise<void>;
  verifyOTP: (otp: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function authErrorMessage(err: unknown): string {
  const code = (err as { code?: string })?.code ?? "";
  switch (code) {
    case "auth/invalid-phone-number":
      return "Please enter a valid phone number.";
    case "auth/missing-phone-number":
      return "Please enter your phone number.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a while and try again.";
    case "auth/quota-exceeded":
      return "SMS limit reached. Please try again later.";
    case "auth/captcha-check-failed":
      return "reCAPTCHA verification failed. Please retry.";
    case "auth/invalid-verification-code":
      return "Incorrect OTP. Please check the code and try again.";
    case "auth/code-expired":
      return "This OTP has expired. Please request a new one.";
    case "auth/operation-not-allowed":
      return "Phone sign-in is not enabled for this project yet.";
    case "auth/no-confirmation":
      return "Your verification session expired. Please request a new OTP.";
    default:
      return "Something went wrong. Please try again.";
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [otpSent, setOtpSent] = useState(false);
  const confirmationRef = useRef<ConfirmationResult | null>(null);
  const recaptchaRef = useRef<RecaptchaVerifier | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const resetRecaptcha = () => {
    if (recaptchaRef.current) {
      recaptchaRef.current.clear();
      recaptchaRef.current = null;
    }
  };

  const getRecaptcha = () => {
    if (!recaptchaRef.current) {
      recaptchaRef.current = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
      });
    }
    return recaptchaRef.current;
  };

  const sendOTP = async (phoneNumber: string) => {
    const verifier = getRecaptcha();
    try {
      confirmationRef.current = await signInWithPhoneNumber(auth, phoneNumber, verifier);
      setOtpSent(true);
      console.log("OTP sent successfully");
    } catch (err) {
      resetRecaptcha();
      setOtpSent(false);
      confirmationRef.current = null;
      throw err;
    }
  };

  const verifyOTP = async (otp: string) => {
    console.log("OTP verification started");
    // Hard guard: login is impossible unless Send OTP succeeded and Firebase
    // returned a confirmationResult to confirm against.
    if (!confirmationRef.current) {
      console.log("Firebase verification failed");
      throw Object.assign(new Error("No verification in progress."), {
        code: "auth/no-confirmation",
      });
    }
    try {
      await confirmationRef.current.confirm(otp);
      console.log("Firebase verification success");
      confirmationRef.current = null;
      setOtpSent(false);
      resetRecaptcha();
    } catch (err) {
      console.log("Firebase verification failed");
      throw err;
    }
  };

  const logout = async () => {
    confirmationRef.current = null;
    setOtpSent(false);
    resetRecaptcha();
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, otpSent, sendOTP, verifyOTP, logout }}>
      {children}
      <div id="recaptcha-container" />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
