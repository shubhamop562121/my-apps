import { Link } from "wouter";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const features = [
  "Find verified local workers instantly",
  "Book appointments — no direct calls needed",
  "Plumbers, Electricians, Carpenters & more",
];

export default function WelcomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-8">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-3 mb-10"
        >
          <div className="w-28 h-28 bg-white rounded-3xl shadow-lg overflow-hidden border border-border">
            <img
              src="/logo.png"
              alt="KaamMitra"
              className="w-full h-full object-contain"
            />
          </div>
          <p className="text-muted-foreground text-sm text-center max-w-[260px]">
            सही काम, सही साथी
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl font-bold text-foreground leading-tight">
            Find Skilled Workers
            <br />
            <span className="text-primary">Near You</span>
          </h2>
          <p className="text-muted-foreground text-sm mt-3 leading-relaxed max-w-[300px]">
            Connect with trusted local professionals for all your home and business needs.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-col gap-3 w-full mb-10"
        >
          {features.map((f, i) => (
            <div key={i} className="flex items-center gap-3">
              <CheckCircle2 size={18} className="text-primary flex-shrink-0" />
              <span className="text-sm text-foreground">{f}</span>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="px-6 pb-10 flex flex-col gap-3"
      >
        <Link href="/login">
          <button
            className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-semibold text-base shadow-lg active:scale-[0.98] transition-transform"
            data-testid="btn-get-started"
          >
            Get Started
          </button>
        </Link>
        <Link href="/home">
          <button
            className="w-full text-muted-foreground py-3 text-sm font-medium"
            data-testid="btn-skip"
          >
            Explore without account
          </button>
        </Link>
      </motion.div>
    </div>
  );
}
