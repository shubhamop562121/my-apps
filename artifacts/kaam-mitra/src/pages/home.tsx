import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { MapPin, Bell, Search, ChevronRight } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import WorkerCard from "@/components/WorkerCard";
import CategoryIcon from "@/components/CategoryIcon";
import { workers, categories, savedWorkerIds } from "@/data/mockData";

const popularWorkers = workers.slice(0, 5);
const recentWorkers = workers.slice(5, 9);

export default function HomePage() {
  const [, setLocation] = useLocation();
  const [saved, setSaved] = useState<Set<string>>(new Set(savedWorkerIds));

  const toggleSave = (id: string) => {
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      <div className="bg-primary px-5 pt-14 pb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5">
            <MapPin size={14} className="text-white/70" />
            <span className="text-white/80 text-xs font-medium">New Delhi</span>
          </div>
          <button
            onClick={() => setLocation("/notifications")}
            className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center relative"
            data-testid="btn-notifications"
          >
            <Bell size={18} className="text-white" />
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-400 rounded-full border border-primary" />
          </button>
        </div>
        <div>
          <p className="text-white/70 text-sm">Good Morning,</p>
          <h1 className="text-white text-2xl font-bold">Rahul Sharma</h1>
        </div>

        <div
          className="mt-4 flex items-center gap-3 bg-white rounded-2xl px-4 py-3 cursor-pointer shadow-md"
          onClick={() => setLocation("/search")}
          data-testid="btn-search"
        >
          <Search size={18} className="text-muted-foreground" />
          <span className="text-muted-foreground text-sm">Search for workers, services...</span>
        </div>
      </div>

      <div className="px-5 pt-6">
        <h2 className="text-base font-bold text-foreground mb-4">Categories</h2>
        <motion.div
          className="grid grid-cols-4 gap-y-5 gap-x-2"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.05 } }, hidden: {} }}
        >
          {categories.map((cat) => (
            <motion.div
              key={cat.slug}
              variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
            >
              <CategoryIcon {...cat} />
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="px-5 pt-7">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-foreground">Popular Workers</h2>
          <button
            onClick={() => setLocation("/search")}
            className="flex items-center gap-1 text-primary text-xs font-semibold"
            data-testid="btn-view-all-popular"
          >
            View All <ChevronRight size={14} />
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-none">
          {popularWorkers.map((w, i) => (
            <motion.div
              key={w.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <WorkerCard worker={w} horizontal />
            </motion.div>
          ))}
        </div>
      </div>

      <div className="px-5 pt-7 pb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-foreground">Recently Added</h2>
          <button
            onClick={() => setLocation("/search")}
            className="flex items-center gap-1 text-primary text-xs font-semibold"
            data-testid="btn-view-all-recent"
          >
            View All <ChevronRight size={14} />
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {recentWorkers.map((w, i) => (
            <motion.div
              key={w.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
            >
              <WorkerCard worker={w} saved={saved.has(w.id)} onToggleSave={toggleSave} />
            </motion.div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
