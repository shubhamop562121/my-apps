import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Phone } from "lucide-react";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const [phone, setPhone] = useState("");

  const handleSendOtp = () => {
    if (phone.length >= 10) {
      setLocation("/otp");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background px-6">
      <div className="flex items-center pt-14 pb-6">
        <button
          onClick={() => setLocation("/welcome")}
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
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Welcome Back</h1>
          <p className="text-muted-foreground text-sm mt-1">Enter your phone number to continue</p>
        </div>

        <div className="mb-6">
          <label className="text-sm font-medium text-foreground block mb-2">Phone Number</label>
          <div className="flex items-center gap-3 bg-white border-2 border-border rounded-2xl px-4 py-3.5 focus-within:border-primary transition-colors">
            <div className="flex items-center gap-2 pr-3 border-r border-border">
              <span className="text-lg">🇮🇳</span>
              <span className="text-sm font-semibold text-foreground">+91</span>
            </div>
            <input
              type="tel"
              placeholder="Enter 10-digit number"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
              className="flex-1 bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground"
              data-testid="input-phone"
            />
            <Phone size={16} className="text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground mt-2 ml-1">We'll send an OTP to verify your number</p>
        </div>

        <button
          onClick={handleSendOtp}
          disabled={phone.length < 10}
          className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all"
          data-testid="btn-send-otp"
        >
          Send OTP
        </button>

        <div className="mt-8 p-4 bg-muted rounded-2xl">
          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            By continuing, you agree to KaamMitra's{" "}
            <span className="text-primary font-medium">Terms of Service</span> and{" "}
            <span className="text-primary font-medium">Privacy Policy</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
