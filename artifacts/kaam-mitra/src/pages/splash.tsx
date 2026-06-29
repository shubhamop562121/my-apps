import { useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";

export default function SplashPage() {
  const [, setLocation] = useLocation();
  const { user, loading } = useAuth();

  useEffect(() => {
    // Wait until Firebase has restored any saved session before deciding where
    // to go — a signed-in user goes straight to Home, never the login flow.
    if (loading) return;
    const timer = setTimeout(() => {
      const signedIn = user ?? auth.currentUser;
      setLocation(signedIn ? "/home" : "/welcome", { replace: true });
    }, 2000);
    return () => clearTimeout(timer);
  }, [loading, user, setLocation]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-primary gap-6 relative overflow-hidden">
      <motion.div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 20%, white 1px, transparent 1px), radial-gradient(circle at 70% 60%, white 1px, transparent 1px), radial-gradient(circle at 50% 80%, white 1px, transparent 1px)",
          backgroundSize: "80px 80px, 120px 120px, 60px 60px",
        }}
      />
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col items-center gap-4"
      >
        <div className="w-32 h-32 bg-white rounded-3xl flex items-center justify-center shadow-2xl overflow-hidden">
          <img
            src="/logo.png"
            alt="KaamMitra"
            className="w-full h-full object-contain"
          />
        </div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center"
        >
          <p className="text-white/70 text-sm mt-1 font-medium">सही काम, सही साथी</p>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="absolute bottom-16 flex flex-col items-center gap-3"
      >
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-white/60"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
        <p className="text-white/50 text-xs">Loading...</p>
      </motion.div>
    </div>
  );
}
