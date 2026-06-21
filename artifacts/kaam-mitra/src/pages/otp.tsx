import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Shield, Loader2, AlertCircle } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useAuth, authErrorMessage } from "@/context/AuthContext";

export default function OtpPage() {
  const [, setLocation] = useLocation();
  const { sendOTP, verifyOTP, otpSent } = useAuth();
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(30);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");

  const phone = typeof window !== "undefined" ? sessionStorage.getItem("km_phone") ?? "" : "";

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleVerify = async () => {
    if (loading) return;
    if (!otpSent) {
      setError("Please tap “Send OTP” first to receive a code.");
      return;
    }
    if (otp.length < 6) return;
    setLoading(true);
    setError("");
    try {
      await verifyOTP(otp);
      setLocation("/home");
    } catch (err) {
      setError(authErrorMessage(err));
      setOtp("");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!phone || resending) return;
    setResending(true);
    setError("");
    try {
      await sendOTP("+91" + phone);
      setCountdown(30);
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background px-6">
      <div className="flex items-center pt-14 pb-6">
        <button
          onClick={() => setLocation("/login")}
          className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center"
          data-testid="btn-back"
        >
          <ArrowLeft size={20} className="text-foreground" />
        </button>
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex-1"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
            <Shield size={32} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Verify OTP</h1>
          <p className="text-muted-foreground text-sm mt-1 text-center">
            Enter the 6-digit code sent to{" "}
            <span className="font-semibold text-foreground">{phone ? `+91 ${phone}` : "your number"}</span>
          </p>
        </div>

        {!otpSent && (
          <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6">
            <AlertCircle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-700">
              No code has been sent yet. Please request an OTP from the login screen first.
            </p>
          </div>
        )}

        <div className="flex flex-col items-center gap-6 mb-8">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={(v) => {
              setOtp(v);
              if (error) setError("");
            }}
            data-testid="input-otp"
          >
            <InputOTPGroup className="gap-2">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <InputOTPSlot
                  key={i}
                  index={i}
                  className="w-12 h-14 text-lg font-bold border-2 border-border rounded-xl focus:border-primary"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>

          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 w-full">
              <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="text-center">
            {countdown > 0 ? (
              <p className="text-sm text-muted-foreground">
                Resend OTP in <span className="text-primary font-semibold">{countdown}s</span>
              </p>
            ) : (
              <button
                onClick={handleResend}
                disabled={resending}
                className="text-sm text-primary font-semibold flex items-center gap-1.5 disabled:opacity-50"
                data-testid="btn-resend"
              >
                {resending && <Loader2 size={14} className="animate-spin" />}
                {resending ? "Resending…" : "Resend OTP"}
              </button>
            )}
          </div>
        </div>

        <button
          onClick={handleVerify}
          disabled={!otpSent || otp.length < 6 || loading}
          className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          data-testid="btn-verify"
        >
          {loading && <Loader2 size={18} className="animate-spin" />}
          {loading ? "Verifying…" : "Verify & Continue"}
        </button>

        <p className="text-xs text-muted-foreground text-center mt-4">
          Didn't receive it? Wait for the timer, then resend.
        </p>
      </motion.div>
    </div>
  );
}
