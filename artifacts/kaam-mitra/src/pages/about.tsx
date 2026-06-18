import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Shield, Users, Star, Zap } from "lucide-react";

const features = [
  { icon: Users, title: "Connect with Workers", desc: "Find verified, skilled workers in your city within minutes.", color: "bg-blue-100 text-blue-600" },
  { icon: Shield, title: "Verified Profiles", desc: "Every worker is manually verified for your safety and trust.", color: "bg-green-100 text-green-600" },
  { icon: Star, title: "Rated & Reviewed", desc: "Read real reviews from people in your neighbourhood.", color: "bg-amber-100 text-amber-600" },
  { icon: Zap, title: "Quick Matching", desc: "Post a request and get matched with the right worker fast.", color: "bg-purple-100 text-purple-600" },
];

export default function AboutPage() {
  const [, setLocation] = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="bg-primary px-5 pt-14 pb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLocation(-1 as never)}
            className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center"
            data-testid="btn-back"
          >
            <ArrowLeft size={20} className="text-white" />
          </button>
          <h1 className="text-xl font-bold text-white">About KaamMitra</h1>
        </div>
      </div>

      <div className="px-5 pt-6 pb-10 flex-1">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-border p-6 text-center mb-5 shadow-sm"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">KM</span>
          </div>
          <h2 className="text-xl font-bold text-foreground">KaamMitra</h2>
          <p className="text-xs text-muted-foreground mt-1">Version 1.0.0</p>
          <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
            KaamMitra connects households and businesses with trusted local skilled workers — plumbers, electricians, carpenters, and more — across India.
          </p>
        </motion.div>

        <h3 className="text-sm font-bold text-foreground mb-3 px-1">What We Offer</h3>
        <div className="flex flex-col gap-3 mb-6">
          {features.map(({ icon: Icon, title, desc, color }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="bg-white rounded-2xl border border-border p-4 flex items-start gap-3 shadow-sm"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                <Icon size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{title}</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="bg-muted rounded-2xl p-4 text-center">
          <p className="text-xs text-muted-foreground">Made with ❤️ in India</p>
          <p className="text-xs text-muted-foreground mt-1">© 2024 KaamMitra. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
