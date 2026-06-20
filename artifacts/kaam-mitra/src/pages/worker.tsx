import { useLocation, useRoute } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowLeft, MapPin, Star, BadgeCheck,
  Bookmark, Briefcase, Shield, CalendarDays,
} from "lucide-react";
import { workers } from "@/data/mockData";
import { useSaved } from "@/context/SavedContext";

export default function WorkerDetailPage() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/worker/:id");
  const worker = workers.find((w) => w.id === params?.id);
  const { isSaved, toggleSave } = useSaved();

  if (!worker) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Worker not found.</p>
      </div>
    );
  }

  const saved = isSaved(worker.id);
  const initials = worker.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const bgColors = ["bg-orange-100 text-orange-700", "bg-blue-100 text-blue-700", "bg-amber-100 text-amber-700", "bg-purple-100 text-purple-700", "bg-rose-100 text-rose-700"];
  const colorClass = bgColors[worker.id.charCodeAt(1) % bgColors.length];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="relative bg-primary pt-14 pb-20 px-5">
        <div className="flex items-center justify-between">
          <button
            onClick={() => window.history.back()}
            className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center"
            data-testid="btn-back"
          >
            <ArrowLeft size={20} className="text-white" />
          </button>
          <button
            onClick={() => toggleSave(worker.id)}
            className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center"
            data-testid="btn-save"
          >
            <Bookmark size={20} className={saved ? "text-white fill-white" : "text-white"} />
          </button>
        </div>
      </div>

      <div className="px-5 -mt-14">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-3xl shadow-lg p-5"
        >
          <div className="flex items-start gap-4">
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold flex-shrink-0 ${colorClass}`}>
              {initials}
            </div>
            <div className="flex-1 min-w-0 pt-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-foreground">{worker.name}</h1>
                {worker.verified && (
                  <div className="flex items-center gap-1 bg-primary/10 px-2 py-0.5 rounded-full">
                    <BadgeCheck size={12} className="text-primary" />
                    <span className="text-[10px] font-semibold text-primary">Verified</span>
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">{worker.profession}</p>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <div className="flex items-center gap-1">
                  <MapPin size={12} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{worker.city}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star size={12} className="text-amber-400 fill-amber-400" />
                  <span className="text-xs font-semibold text-foreground">{worker.rating}</span>
                  <span className="text-xs text-muted-foreground">({worker.reviewCount} reviews)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <div className="flex-1 bg-muted rounded-2xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 mb-0.5">
                <Briefcase size={14} className="text-primary" />
              </div>
              <p className="text-lg font-bold text-foreground">{worker.experience}+</p>
              <p className="text-[10px] text-muted-foreground">Years Exp.</p>
            </div>
            <div className="flex-1 bg-muted rounded-2xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 mb-0.5">
                <Star size={14} className="text-amber-400" />
              </div>
              <p className="text-lg font-bold text-foreground">{worker.rating}</p>
              <p className="text-[10px] text-muted-foreground">Rating</p>
            </div>
            <div className="flex-1 bg-muted rounded-2xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 mb-0.5">
                <Shield size={14} className="text-primary" />
              </div>
              <p className="text-lg font-bold text-foreground">{worker.verified ? "Yes" : "No"}</p>
              <p className="text-[10px] text-muted-foreground">Verified</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mt-5 bg-white rounded-3xl shadow-sm border border-border p-5"
        >
          <h2 className="font-bold text-sm text-foreground mb-2">About</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{worker.about}</p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="mt-4 bg-white rounded-3xl shadow-sm border border-border p-5"
        >
          <h2 className="font-bold text-sm text-foreground mb-3">Services Offered</h2>
          <div className="flex flex-wrap gap-2">
            {worker.services.map((s) => (
              <span
                key={s}
                className="bg-primary/10 text-primary px-3 py-1.5 rounded-xl text-xs font-medium"
              >
                {s}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-4 bg-amber-50 border border-amber-200 rounded-3xl p-4 flex items-start gap-3"
        >
          <div className="w-8 h-8 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Shield size={16} className="text-amber-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-amber-800">Secure Booking</p>
            <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
              Book your appointment through KaamMitra. Our team will verify and assign the right worker for your job.
            </p>
          </div>
        </motion.div>

        <div className="mt-5 pb-8">
          <button
            onClick={() => setLocation(`/book/${worker.id}`)}
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-4 rounded-2xl font-bold text-sm shadow-md"
            data-testid="btn-book"
          >
            <CalendarDays size={18} />
            Book Appointment
          </button>
        </div>
      </div>
    </div>
  );
}
