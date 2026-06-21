import { useState } from "react";
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, Loader2 } from "lucide-react";
import Layout from "@/components/Layout";
import Badge from "@/components/Badge";
import { Ad } from "@/data/mockData";
import { useCollection } from "@/hooks/useCollection";

export default function AdsPage() {
  const { items: ads, loading, error, add, update, remove } = useCollection<Ad>("advertisements");
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Ad | null>(null);
  const [form, setForm] = useState({ title:"",imageUrl:"",linkUrl:"",position:"Home Top",status:"active" as "active"|"inactive",startDate:"",endDate:"" });

  const inputCls = "w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30";

  const openAdd = () => { setEditing(null); setForm({ title:"",imageUrl:"",linkUrl:"",position:"Home Top",status:"active",startDate:"",endDate:"" }); setShowModal(true); };
  const openEdit = (a: Ad) => { setEditing(a); setForm({ title:a.title,imageUrl:a.imageUrl,linkUrl:a.linkUrl,position:a.position,status:a.status,startDate:a.startDate,endDate:a.endDate }); setShowModal(true); };
  const handleDelete = async (id: string) => {
    if (!confirm("Delete ad?")) return;
    try { await remove(id); } catch (err) { alert(`Failed to delete ad: ${(err as Error).message}`); }
  };
  const toggleStatus = async (a: Ad) => {
    try { await update(a.id, { status: a.status === "active" ? "inactive" : "active" }); } catch (err) { alert(`Failed to update ad: ${(err as Error).message}`); }
  };
  const handleSave = async () => {
    if (!form.title) return;
    setSaving(true);
    try {
      if (editing) await update(editing.id, form);
      else await add({ ...form });
      setShowModal(false);
    } catch (err) {
      alert(`Failed to save ad: ${(err as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout title="Advertisements">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">{ads.filter((a) => a.status === "active").length} active · {ads.filter((a) => a.status === "inactive").length} inactive</p>
          <button onClick={openAdd} className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition">
            <Plus size={15} /> Add Ad
          </button>
        </div>

        {loading && <div className="flex items-center gap-2 text-muted-foreground text-sm py-8 justify-center"><Loader2 size={16} className="animate-spin" />Loading ads…</div>}
        {error && !loading && <div className="text-center text-red-500 py-8 text-sm bg-card border border-border rounded-xl">Failed to load ads: {error}</div>}
        {!loading && !error && ads.length === 0 && <div className="text-center text-muted-foreground py-8 text-sm bg-card border border-border rounded-xl">No ads yet. Click "Add Ad" to create one.</div>}

        <div className="flex flex-col gap-4">
          {ads.map((a) => (
            <div key={a.id} className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
              <img src={a.imageUrl} alt={a.title} className="w-full h-28 object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).src = "https://placehold.co/800x200/e2e8f0/94a3b8?text=Ad+Image"; }} />
              <div className="p-4 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-foreground text-sm">{a.title}</p>
                    <Badge label={a.status} variant={a.status === "active" ? "success" : "neutral"} />
                  </div>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <p className="text-xs text-muted-foreground">📌 {a.position}</p>
                    <p className="text-xs text-muted-foreground">📅 {a.startDate} → {a.endDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => toggleStatus(a)} className={`p-1.5 rounded-lg transition ${a.status === "active" ? "hover:bg-green-50 text-green-600" : "hover:bg-gray-100 text-gray-500"}`}>
                    {a.status === "active" ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                  </button>
                  <button onClick={() => openEdit(a)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition"><Edit2 size={14} /></button>
                  <button onClick={() => handleDelete(a.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="font-semibold">{editing ? "Edit Ad" : "Add Ad"}</h2>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground text-xl">×</button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div><label className="text-xs font-semibold mb-1 block">Title</label><input className={inputCls} value={form.title} onChange={(e) => setForm({...form,title:e.target.value})} placeholder="Ad title" /></div>
              <div><label className="text-xs font-semibold mb-1 block">Image URL</label><input className={inputCls} value={form.imageUrl} onChange={(e) => setForm({...form,imageUrl:e.target.value})} placeholder="https://..." /></div>
              <div><label className="text-xs font-semibold mb-1 block">Link URL</label><input className={inputCls} value={form.linkUrl} onChange={(e) => setForm({...form,linkUrl:e.target.value})} placeholder="https://..." /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-semibold mb-1 block">Position</label><select className={inputCls} value={form.position} onChange={(e) => setForm({...form,position:e.target.value})}>{["Home Top","Home Bottom","Category Page","Worker Detail"].map((p) => <option key={p}>{p}</option>)}</select></div>
                <div><label className="text-xs font-semibold mb-1 block">Status</label><select className={inputCls} value={form.status} onChange={(e) => setForm({...form,status:e.target.value as "active"|"inactive"})}><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
                <div><label className="text-xs font-semibold mb-1 block">Start Date</label><input type="date" className={inputCls} value={form.startDate} onChange={(e) => setForm({...form,startDate:e.target.value})} /></div>
                <div><label className="text-xs font-semibold mb-1 block">End Date</label><input type="date" className={inputCls} value={form.endDate} onChange={(e) => setForm({...form,endDate:e.target.value})} /></div>
              </div>
            </div>
            <div className="flex gap-3 px-6 pb-6">
              <button onClick={() => setShowModal(false)} disabled={saving} className="flex-1 border border-border py-2.5 rounded-xl text-sm hover:bg-muted transition disabled:opacity-50">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 flex items-center justify-center gap-2 bg-primary text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition disabled:opacity-50">{saving && <Loader2 size={14} className="animate-spin" />}Save</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
