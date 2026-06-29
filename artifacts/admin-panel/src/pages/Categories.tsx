import { useState } from "react";
import { Plus, Edit2, Trash2, Loader2 } from "lucide-react";
import Layout from "@/components/Layout";
import Badge from "@/components/Badge";
import { Category } from "@/data/mockData";
import { useCollection } from "@/hooks/useCollection";

const ICON_PRESETS = ["🔧","⚡","🪚","🧱","🎨","❄️","🔥","👷","📹","💧","✨","🚰","🔨","🛠️","🧹","🪛","🪜","🧰","🚿","🪠","💡","📺","🚗","🌿","🐜","🔩","🏠","🪟"];

export default function CategoriesPage() {
  const { items: cats, loading, error, add, update, remove } = useCollection<Category>("categories");
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: "", icon: "🔧", status: "active" as "active"|"inactive" });

  const inputCls = "w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30";

  const openAdd = () => { setEditing(null); setForm({ name:"",icon:"🔧",status:"active" }); setShowModal(true); };
  const openEdit = (c: Category) => { setEditing(c); setForm({ name:c.name,icon:c.icon,status:c.status }); setShowModal(true); };
  const handleDelete = async (id: string) => {
    if (!confirm("Delete category?")) return;
    try { await remove(id); } catch (err) { alert(`Failed to delete category: ${(err as Error).message}`); }
  };
  const handleSave = async () => {
    if (!form.name) return;
    setSaving(true);
    const clean = { ...form, name: form.name.trim(), icon: form.icon.trim() };
    try {
      if (editing) await update(editing.id, clean);
      else await add({ ...clean, workerCount: 0 });
      setShowModal(false);
    } catch (err) {
      alert(`Failed to save category: ${(err as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout title="Categories">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">{cats.length} categories total</p>
          <button onClick={openAdd} className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition">
            <Plus size={15} /> Add Category
          </button>
        </div>

        {loading && <div className="flex items-center gap-2 text-muted-foreground text-sm py-8 justify-center"><Loader2 size={16} className="animate-spin" />Loading categories…</div>}
        {error && !loading && <div className="text-center text-red-500 py-8 text-sm bg-card border border-border rounded-xl">Failed to load categories: {error}</div>}
        {!loading && !error && cats.length === 0 && <div className="text-center text-muted-foreground py-8 text-sm bg-card border border-border rounded-xl">No categories yet. Click "Add Category" to create one.</div>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cats.map((c) => (
            <div key={c.id} className="bg-card border border-border rounded-xl p-4 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-xl flex-shrink-0">{c.icon}</div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{c.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{c.workerCount} workers</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge label={c.status} variant={c.status === "active" ? "success" : "neutral"} />
                <div className="flex gap-1">
                  <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition"><Edit2 size={13} /></button>
                  <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition"><Trash2 size={13} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-sm shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="font-semibold">{editing ? "Edit Category" : "Add Category"}</h2>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground text-xl">×</button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div><label className="text-xs font-semibold mb-1 block">Category Name</label><input className={inputCls} value={form.name} onChange={(e) => setForm({...form,name:e.target.value})} placeholder="e.g. Plumber" /></div>
              <div>
                <label className="text-xs font-semibold mb-1 block">Icon</label>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl flex-shrink-0">{form.icon || "❓"}</div>
                  <input className={inputCls} value={form.icon} onChange={(e) => setForm({...form,icon:e.target.value})} placeholder="Pick below or type/paste an emoji" />
                </div>
                <div className="grid grid-cols-9 gap-1.5">
                  {ICON_PRESETS.map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setForm({...form, icon: em})}
                      className={`w-9 h-9 rounded-lg text-xl flex items-center justify-center transition hover:bg-blue-50 ${form.icon === em ? "bg-blue-100 ring-2 ring-primary" : "bg-muted"}`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>
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
