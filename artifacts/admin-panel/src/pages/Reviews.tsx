import { useState } from "react";
import { Search, CheckCircle2, XCircle, Trash2, Loader2 } from "lucide-react";
import Layout from "@/components/Layout";
import Badge from "@/components/Badge";
import { Review } from "@/data/mockData";
import { useCollection } from "@/hooks/useCollection";

const Stars = ({ n }: { n: number }) => (
  <span className="text-amber-400 text-sm">{"★".repeat(n)}{"☆".repeat(5 - n)}</span>
);

export default function ReviewsPage() {
  const { items: reviews, loading, error, update, remove } = useCollection<Review>("reviews");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = reviews.filter((r) => {
    const matchSearch = r.workerName.toLowerCase().includes(search.toLowerCase()) || r.userName.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || r.status === filter;
    return matchSearch && matchFilter;
  });

  const updateStatus = async (id: string, status: Review["status"]) => {
    try { await update(id, { status }); } catch (err) { alert(`Failed to update review: ${(err as Error).message}`); }
  };
  const handleDelete = async (id: string) => {
    if (!confirm("Delete review?")) return;
    try { await remove(id); } catch (err) { alert(`Failed to delete review: ${(err as Error).message}`); }
  };

  return (
    <Layout title="Reviews">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input placeholder="Search reviews..." className="w-full pl-9 pr-3 py-2.5 text-sm border border-border rounded-xl bg-card focus:outline-none focus:ring-2 focus:ring-primary/30" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2">
            {["all","approved","pending","removed"].map((s) => (
              <button key={s} onClick={() => setFilter(s)} className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize transition ${filter === s ? "bg-primary text-white" : "bg-card border border-border text-muted-foreground hover:text-foreground"}`}>{s}</button>
            ))}
          </div>
        </div>

        {loading && <div className="flex items-center gap-2 text-muted-foreground text-sm py-8 justify-center"><Loader2 size={16} className="animate-spin" />Loading reviews…</div>}
        {error && !loading && <div className="text-center text-red-500 py-8 text-sm bg-card border border-border rounded-xl">Failed to load reviews: {error}</div>}

        <div className="flex flex-col gap-3">
          {filtered.map((r) => (
            <div key={r.id} className="bg-card border border-border rounded-xl p-4 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-sm text-foreground">{r.userName}</p>
                    <span className="text-muted-foreground text-xs">→</span>
                    <p className="text-sm text-primary font-medium">{r.workerName}</p>
                    <Stars n={r.rating} />
                    <span className="text-xs text-muted-foreground">{r.createdAt}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{r.comment}</p>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <Badge label={r.status} variant={r.status === "approved" ? "success" : r.status === "pending" ? "warning" : "danger"} />
                  <div className="flex gap-1">
                    {r.status !== "approved" && (
                      <button onClick={() => updateStatus(r.id, "approved")} title="Approve" className="p-1.5 rounded-lg hover:bg-green-50 text-green-600 transition"><CheckCircle2 size={14} /></button>
                    )}
                    {r.status !== "removed" && (
                      <button onClick={() => updateStatus(r.id, "removed")} title="Remove" className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-500 transition"><XCircle size={14} /></button>
                    )}
                    <button onClick={() => handleDelete(r.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition"><Trash2 size={14} /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div className="text-center text-muted-foreground py-8 text-sm bg-card border border-border rounded-xl">No reviews found</div>}
        </div>
      </div>
    </Layout>
  );
}
