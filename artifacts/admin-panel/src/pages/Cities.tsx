import { useState } from "react";
import { Plus, Edit2, Trash2, Loader2 } from "lucide-react";
import Layout from "@/components/Layout";
import Badge from "@/components/Badge";
import { City } from "@/data/mockData";
import { useCollection } from "@/hooks/useCollection";

export default function CitiesPage() {
  const { items: cities, loading, error, add, update, remove } = useCollection<City>("cities");
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<City | null>(null);
  const [form, setForm] = useState({ name: "", state: "", status: "active" as "active"|"inactive" });

  const inputCls = "w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30";

  const openAdd = () => { setEditing(null); setForm({ name:"",state:"",status:"active" }); setShowModal(true); };
  const openEdit = (c: City) => { setEditing(c); setForm({ name:c.name,state:c.state,status:c.status }); setShowModal(true); };
  const handleDelete = async (id: string) => {
    if (!confirm("Delete city?")) return;
    try { await remove(id); } catch (err) { alert(`Failed to delete city: ${(err as Error).message}`); }
  };
  const handleSave = async () => {
    if (!form.name) return;
    setSaving(true);
    try {
      if (editing) await update(editing.id, form);
      else await add({ ...form, workerCount: 0 });
      setShowModal(false);
    } catch (err) {
      alert(`Failed to save city: ${(err as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout title="Cities">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">{cities.length} cities total · {cities.filter((c) => c.status === "active").length} active</p>
          <button onClick={openAdd} className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition">
            <Plus size={15} /> Add City
          </button>
        </div>

        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  {["City","State","Workers","Status","Actions"].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading && <tr><td colSpan={5} className="text-center text-muted-foreground py-8 text-sm"><Loader2 size={16} className="animate-spin inline mr-2" />Loading cities…</td></tr>}
                {error && !loading && <tr><td colSpan={5} className="text-center text-red-500 py-8 text-sm">Failed to load cities: {error}</td></tr>}
                {!loading && !error && cities.length === 0 && <tr><td colSpan={5} className="text-center text-muted-foreground py-8 text-sm">No cities yet. Click "Add City" to create one.</td></tr>}
                {cities.map((c) => (
                  <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 text-sm flex-shrink-0">📍</div>
                        <p className="font-medium text-foreground">{c.name}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{c.state}</td>
                    <td className="px-4 py-3 text-muted-foreground">{c.workerCount}</td>
                    <td className="px-4 py-3"><Badge label={c.status} variant={c.status === "active" ? "success" : "neutral"} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition"><Edit2 size={14} /></button>
                        <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-sm shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="font-semibold">{editing ? "Edit City" : "Add City"}</h2>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground text-xl">×</button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div><label className="text-xs font-semibold mb-1 block">City Name</label><input className={inputCls} value={form.name} onChange={(e) => setForm({...form,name:e.target.value})} placeholder="e.g. New Delhi" /></div>
              <div><label className="text-xs font-semibold mb-1 block">State</label><input className={inputCls} value={form.state} onChange={(e) => setForm({...form,state:e.target.value})} placeholder="e.g. Delhi" /></div>
              <div><label className="text-xs font-semibold mb-1 block">Status</label><select className={inputCls} value={form.status} onChange={(e) => setForm({...form,status:e.target.value as "active"|"inactive"})}><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
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
