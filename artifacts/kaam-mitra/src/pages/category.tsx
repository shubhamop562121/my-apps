import { useState } from "react";
import { useLocation, useRoute } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Search, SlidersHorizontal, Users, Loader2 } from "lucide-react";
import WorkerCard from "@/components/WorkerCard";
import EmptyState from "@/components/EmptyState";
import { useSaved } from "@/context/SavedContext";
import { useWorkers } from "@/hooks/useWorkers";
import { useCategories } from "@/hooks/useCategories";

export default function CategoryPage() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/category/:slug");
  const slug = params?.slug ?? "";
  const [query, setQuery] = useState("");
  const { savedIds, toggleSave } = useSaved();
  const { workers, loading } = useWorkers();
  const { categories } = useCategories();

  const cat = categories.find((c) => c.slug === slug);
  const allCatWorkers = workers.filter((w) => w.category === slug);
  const filtered = allCatWorkers.filter(
    (w) =>
      w.name.toLowerCase().includes(query.toLowerCase()) ||
      w.city.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-background pb-8">
      <div className="bg-white border-b border-border px-5 pt-14 pb-4 sticky top-0 z-10">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => setLocation("/home")}
            className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0"
            data-testid="btn-back"
          >
            <ArrowLeft size={20} className="text-foreground" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-foreground">{cat?.label ?? "Category"}</h1>
            <p className="text-xs text-muted-foreground">
              {loading ? "Loading…" : `${allCatWorkers.length} workers available`}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="flex-1 flex items-center gap-2 bg-muted rounded-xl px-3 py-2.5">
            <Search size={15} className="text-muted-foreground" />
            <input
              type="search"
              placeholder="Search by name or city..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              data-testid="input-search-category"
            />
          </div>
          <button
            onClick={() => setLocation("/filters")}
            className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center flex-shrink-0"
            data-testid="btn-filter"
          >
            <SlidersHorizontal size={18} className="text-white" />
          </button>
        </div>
      </div>

      <div className="px-5 pt-5">
        {loading ? (
          <div className="flex items-center justify-center py-16 gap-2 text-muted-foreground">
            <Loader2 size={18} className="animate-spin" />
            <span className="text-sm">Loading workers…</span>
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Users}
            title={allCatWorkers.length === 0 ? "No Workers Yet" : "No Workers Found"}
            subtitle={
              allCatWorkers.length === 0
                ? `No ${cat?.label ?? "matching"} workers have registered in your area yet.`
                : "Try adjusting your search or check back later."
            }
            ctaLabel={allCatWorkers.length === 0 ? "Explore Other Categories" : "Go Back"}
            ctaHref="/home"
          />
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((w, i) => (
              <motion.div
                key={w.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <WorkerCard worker={w} saved={savedIds.has(w.id)} onToggleSave={toggleSave} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
