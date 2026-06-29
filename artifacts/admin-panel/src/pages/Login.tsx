import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff, LogIn, ArrowLeft, MailCheck, Send } from "lucide-react";

function messageForError(err: unknown): string {
  const code = (err as { code?: string; message?: string })?.code ?? "";
  const msg = (err as { message?: string })?.message ?? "";
  if (msg === "not-admin") {
    return "This account is not authorized to access the admin panel.";
  }
  switch (code) {
    case "auth/invalid-email":
      return "That email address looks invalid.";
    case "auth/user-disabled":
      return "This account has been disabled.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Incorrect email or password. Please try again.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a moment and try again.";
    case "auth/network-request-failed":
      return "Network error. Check your connection and try again.";
    case "auth/missing-email":
      return "Please enter your email address.";
    default:
      return "Something went wrong. Please try again.";
  }
}

export default function LoginPage() {
  const { login, resetPassword } = useAuth();
  const [mode, setMode] = useState<"signin" | "reset">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      // On success, AuthProvider updates state and the router redirects.
    } catch (err) {
      console.error("[AdminAuth] login error:", err);
      setError(messageForError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    setLoading(true);
    try {
      await resetPassword(email);
      setInfo(
        `We've sent a password reset link to ${email.trim()}. Open it to choose a new password.`,
      );
    } catch (err) {
      console.error("[AdminAuth] reset error:", err);
      const code = (err as { code?: string })?.code ?? "";
      setError(
        code === "auth/user-not-found"
          ? "No admin account found with that email."
          : messageForError(err),
      );
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (next: "signin" | "reset") => {
    setMode(next);
    setError("");
    setInfo("");
    setPassword("");
  };

  const inputCls = "w-full bg-white border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white text-xl font-bold">KM</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">KaamMitra Admin</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {mode === "signin" ? "Sign in to manage your platform" : "Reset your admin password"}
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl shadow-sm p-6">
          {mode === "signin" ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold text-foreground mb-1.5 block">Email Address</label>
                <input
                  type="email"
                  autoComplete="username"
                  className={inputCls}
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-foreground">Password</label>
                  <button
                    type="button"
                    onClick={() => switchMode("reset")}
                    className="text-xs text-primary font-semibold hover:underline"
                    data-testid="link-forgot-password"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    autoComplete="current-password"
                    className={inputCls + " pr-11"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-xs text-destructive bg-destructive/5 border border-destructive/20 rounded-lg px-3 py-2">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-primary/90 transition disabled:opacity-60"
              >
                <LogIn size={16} />
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleReset} className="flex flex-col gap-4">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Enter your admin email and we'll send you a secure link to set a new password.
              </p>
              <div>
                <label className="text-xs font-semibold text-foreground mb-1.5 block">Email Address</label>
                <input
                  type="email"
                  autoComplete="username"
                  className={inputCls}
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {error && (
                <p className="text-xs text-destructive bg-destructive/5 border border-destructive/20 rounded-lg px-3 py-2">{error}</p>
              )}
              {info && (
                <p className="text-xs text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2 flex items-start gap-2">
                  <MailCheck size={14} className="mt-0.5 flex-shrink-0" />
                  <span>{info}</span>
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-primary/90 transition disabled:opacity-60"
              >
                <Send size={16} />
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
              <button
                type="button"
                onClick={() => switchMode("signin")}
                className="text-xs text-muted-foreground font-semibold flex items-center justify-center gap-1 hover:text-foreground"
                data-testid="link-back-to-signin"
              >
                <ArrowLeft size={12} /> Back to sign in
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
