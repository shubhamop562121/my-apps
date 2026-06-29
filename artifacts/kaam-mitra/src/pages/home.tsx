import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { MapPin, Bell, Search, ChevronRight, Loader2 } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import WorkerCard from "@/components/WorkerCard";
import CategoryIcon from "@/components/CategoryIcon";
import { useSaved } from "@/context/SavedContext";
import { useWorkers } from "@/hooks/useWorkers";
import { useCategories } from "@/hooks/useCategories";
import { useNotifications } from "@/hooks/useNotifications";

export default function HomePage() {
  const [, setLocation] = useLocation();
  const { savedIds, toggleSave } = useSaved();
  const { workers, loading } = useWorkers();
  const { categories } = useCategories();
  const { unreadCount } = useNotifications();

  const popularWorkers = workers.slice(0, 5);
  const recentWorkers = workers.slice(5, 9);

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
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-red-500 rounded-full border border-primary flex items-center justify-center text-[9px] font-bold text-white leading-none">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
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
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }}
          className="grid grid-cols-4 gap-3"
        >
          {categories.map((cat) => (
            <motion.div
              key={cat.slug}
              variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
              onClick={() => setLocation(`/category/${cat.slug}`)}
              className="flex flex-col items-center gap-1.5 cursor-pointer"
              data-testid={`cat-${cat.slug}`}
            >
              <div className="shadow-sm border border-border/40 rounded-2xl overflow-hidden">
                <CategoryIcon slug={cat.slug} emoji={cat.icon} size={26} />
              </div>
              <span className="text-[10px] font-medium text-muted-foreground text-center leading-tight">{cat.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="px-5 pt-7">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-foreground">Popular Workers</h2>
          <button
            onClick={() => setLocation("/search")}
            className="flex items-center gap-0.5 text-xs text-primary font-semibold"
          >
            See all <ChevronRight size={14} />
          </button>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-8 gap-2 text-muted-foreground">
            <Loader2 size={18} className="animate-spin" />
            <span className="text-sm">Loading workers…</span>
          </div>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none -mx-5 px-5">
            {popularWorkers.map((w) => (
              <div key={w.id} className="flex-shrink-0 w-[200px]">
                <WorkerCard worker={w} horizontal saved={savedIds.has(w.id)} onToggleSave={toggleSave} />
              </div>
            ))}
            {popularWorkers.length === 0 && (
              <p className="text-sm text-muted-foreground py-4">No workers yet. Check back soon!</p>
            )}
          </div>
        )}
      </div>

      <div className="px-5 pt-7 pb-2">
        <h2 className="text-base font-bold text-foreground mb-4">Recently Added</h2>
        {!loading && (
          <div className="flex flex-col gap-3">
            {recentWorkers.map((w, i) => (
              <motion.div
                key={w.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <WorkerCard worker={w} saved={savedIds.has(w.id)} onToggleSave={toggleSave} />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
