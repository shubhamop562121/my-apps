import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Shield } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

export default function OtpPage() {
  const [, setLocation] = useLocation();
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [countdown]);

  const handleVerify = () => {
    if (otp.length === 6) {
      setLocation("/home");
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
            Enter the 6-digit code sent to your number
          </p>
        </div>

        <div className="flex flex-col items-center gap-6 mb-8">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={setOtp}
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

          <div className="text-center">
            {countdown > 0 ? (
              <p className="text-sm text-muted-foreground">
                Resend OTP in <span className="text-primary font-semibold">{countdown}s</span>
              </p>
            ) : (
              <button
                onClick={() => setCountdown(30)}
                className="text-sm text-primary font-semibold"
                data-testid="btn-resend"
              >
                Resend OTP
              </button>
            )}
          </div>
        </div>

        <button
          onClick={handleVerify}
          disabled={otp.length < 6}
          className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all"
          data-testid="btn-verify"
        >
          Verify & Continue
        </button>

        <p className="text-xs text-muted-foreground text-center mt-4">
          Didn't receive it? Check your spam or try a different number.
        </p>
      </motion.div>
    </div>
  );
}
