import { useState } from "react";
import { Search, CheckCircle2, Trash2, MessageSquare, Loader2 } from "lucide-react";
import Layout from "@/components/Layout";
import Badge from "@/components/Badge";
import { Message } from "@/data/mockData";
import { useCollection } from "@/hooks/useCollection";
import { formatDate } from "@/lib/formatDate";

export default function MessagesPage() {
  const { items: messages, loading, error, update, remove } = useCollection<Message>("messages");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = messages.find((m) => m.id === selectedId) ?? null;

  const filtered = messages.filter((m) => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.subject.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || m.status === filter;
    return matchSearch && matchFilter;
  });

  const markResolved = async (id: string) => {
    try { await update(id, { status: "resolved" }); } catch (err) { alert(`Failed to update message: ${(err as Error).message}`); }
  };
  const handleDelete = async (id: string) => {
    if (!confirm("Delete message?")) return;
    try {
      await remove(id);
      if (selectedId === id) setSelectedId(null);
    } catch (err) {
      alert(`Failed to delete message: ${(err as Error).message}`);
    }
  };

  return (
    <Layout title="Messages">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input placeholder="Search messages..." className="w-full pl-9 pr-3 py-2.5 text-sm border border-border rounded-xl bg-card focus:outline-none focus:ring-2 focus:ring-primary/30" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2">
            {["all","open","resolved"].map((s) => (
              <button key={s} onClick={() => setFilter(s)} className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize transition ${filter === s ? "bg-primary text-white" : "bg-card border border-border text-muted-foreground hover:text-foreground"}`}>{s}</button>
            ))}
          </div>
          <span className="text-xs text-muted-foreground ml-auto">
            {messages.filter((m) => m.status === "open").length} open
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            {loading && <div className="flex items-center gap-2 text-muted-foreground text-sm py-8 justify-center"><Loader2 size={16} className="animate-spin" />Loading messages…</div>}
            {error && !loading && <div className="text-center text-red-500 py-8 text-sm bg-card border border-border rounded-xl">Failed to load messages: {error}</div>}
            {filtered.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedId(m.id)}
                className={`w-full text-left bg-card border rounded-xl p-4 transition shadow-sm ${selected?.id === m.id ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/40"}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-xs font-bold flex-shrink-0">
                      {m.name.split(" ").map((n) => n[0]).join("").slice(0,2)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{m.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{m.subject}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <Badge label={m.status} variant={m.status === "open" ? "warning" : "success"} />
                    <span className="text-[10px] text-muted-foreground">{formatDate(m.createdAt)}</span>
                  </div>
                </div>
              </button>
            ))}
            {filtered.length === 0 && <div className="text-center text-muted-foreground py-8 text-sm bg-card border border-border rounded-xl">No messages</div>}
          </div>

          <div>
            {selected ? (
              <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <p className="font-semibold text-foreground">{selected.subject}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">From: {selected.name} · {selected.phone}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(selected.createdAt)}</p>
                  </div>
                  <Badge label={selected.status} variant={selected.status === "open" ? "warning" : "success"} />
                </div>
                <div className="bg-muted/50 rounded-xl p-4 text-sm text-foreground leading-relaxed mb-4">
                  {selected.message}
                </div>
                <div className="flex gap-2">
                  {selected.status === "open" && (
                    <button onClick={() => markResolved(selected.id)} className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-green-700 transition">
                      <CheckCircle2 size={15} /> Mark Resolved
                    </button>
                  )}
                  <button onClick={() => handleDelete(selected.id)} className="flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-100 transition">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-card border border-border rounded-xl p-8 flex flex-col items-center justify-center gap-3 text-center shadow-sm h-[200px]">
                <MessageSquare size={32} className="text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">Select a message to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
