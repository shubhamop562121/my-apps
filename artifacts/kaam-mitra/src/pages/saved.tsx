import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Bookmark } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import WorkerCard from "@/components/WorkerCard";
import EmptyState from "@/components/EmptyState";
import { workers } from "@/data/mockData";
import { useSaved } from "@/context/SavedContext";

export default function SavedPage() {
  const [, setLocation] = useLocation();
  const { savedIds, toggleSave } = useSaved();

  const savedWorkers = workers.filter((w) => savedIds.has(w.id));

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      <div className="bg-white border-b border-border px-5 pt-14 pb-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLocation(-1 as never)}
            className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center"
            data-testid="btn-back"
          >
            <ArrowLeft size={20} className="text-foreground" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-foreground">Saved Workers</h1>
            <p className="text-xs text-muted-foreground">{savedWorkers.length} saved</p>
          </div>
        </div>
      </div>

      <div className="px-5 pt-5 flex-1">
        {savedWorkers.length === 0 ? (
          <EmptyState
            icon={Bookmark}
            title="No Saved Workers"
            subtitle="Workers you bookmark will appear here for quick access."
            ctaLabel="Browse Workers"
            ctaHref="/home"
          />
        ) : (
          <div className="flex flex-col gap-3">
            {savedWorkers.map((w, i) => (
              <motion.div
                key={w.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                exit={{ opacity: 0, x: -20 }}
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
