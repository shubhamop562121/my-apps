import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Search, X, Clock } from "lucide-react";
import WorkerCard from "@/components/WorkerCard";
import EmptyState from "@/components/EmptyState";
import { workers } from "@/data/mockData";

const recentSearches = ["Plumber Delhi", "Electrician", "AC Repair Mumbai", "Carpenter"];

export default function SearchPage() {
  const [, setLocation] = useLocation();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const filtered = query.trim()
    ? workers.filter(
        (w) =>
          w.name.toLowerCase().includes(query.toLowerCase()) ||
          w.profession.toLowerCase().includes(query.toLowerCase()) ||
          w.city.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="flex flex-col min-h-screen bg-background pb-6">
      <div className="bg-white border-b border-border px-4 pt-14 pb-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLocation("/home")}
            className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0"
            data-testid="btn-back"
          >
            <ArrowLeft size={20} className="text-foreground" />
          </button>
          <div className="flex-1 flex items-center gap-2 bg-muted rounded-2xl px-4 py-2.5">
            <Search size={16} className="text-muted-foreground flex-shrink-0" />
            <input
              ref={inputRef}
              type="search"
              placeholder="Name, profession, or city..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              data-testid="input-search"
            />
            {query && (
              <button onClick={() => setQuery("")}>
                <X size={16} className="text-muted-foreground" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="px-5 pt-5 flex-1">
        <AnimatePresence mode="wait">
          {!query && (
            <motion.div
              key="recent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Recent Searches</p>
              <div className="flex flex-col gap-2">
                {recentSearches.map((s) => (
                  <button
                    key={s}
                    onClick={() => setQuery(s)}
                    className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-muted transition-colors text-left"
                    data-testid={`btn-recent-${s.replace(/\s+/g, "-").toLowerCase()}`}
                  >
                    <Clock size={15} className="text-muted-foreground flex-shrink-0" />
                    <span className="text-sm text-foreground">{s}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {query && filtered.length > 0 && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                {filtered.length} Result{filtered.length !== 1 ? "s" : ""} found
              </p>
              <div className="flex flex-col gap-3">
                {filtered.map((w, i) => (
                  <motion.div
                    key={w.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <WorkerCard worker={w} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {query && filtered.length === 0 && (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <EmptyState
                icon={Search}
                title="No Workers Found"
                subtitle={`No results for "${query}". Try a different name, profession, or city.`}
                ctaLabel="Browse All"
                ctaHref="/home"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
