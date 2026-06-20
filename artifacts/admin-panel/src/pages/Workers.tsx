import { useState } from "react";
import { Search, Plus, Edit2, Trash2, Filter, BadgeCheck } from "lucide-react";
import Layout from "@/components/Layout";
import Badge from "@/components/Badge";
import { workers as initialWorkers, Worker } from "@/data/mockData";

export default function WorkersPage() {
  const [workers, setWorkers] = useState(initialWorkers);
  const [search, setSearch] = useState("");
  const [filterCity, setFilterCity] = useState("All");
  const [filterCat, setFilterCat] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Worker | null>(null);
  const [form, setForm] = useState({ name:"",phone:"",category:"Plumber",city:"New Delhi",experience:"1",description:"",status:"active" as "active"|"inactive" });

  const cities = ["All", ...Array.from(new Set(workers.map((w) => w.city)))];
  const cats = ["All", ...Array.from(new Set(workers.map((w) => w.category)))];

  const filtered = workers.filter((w) => {
    const matchSearch = w.name.toLowerCase().includes(search.toLowerCase()) || w.phone.includes(search);
    const matchCity = filterCity === "All" || w.city === filterCity;
    const matchCat = filterCat === "All" || w.category === filterCat;
    return matchSearch && matchCity && matchCat;
  });

  const openAdd = () => {
    setEditing(null);
    setForm({ name:"",phone:"",category:"Plumber",city:"New Delhi",experience:"1",description:"",status:"active" });
    setShowModal(true);
  };

  const openEdit = (w: Worker) => {
    setEditing(w);
    setForm({ name:w.name,phone:w.phone,category:w.category,city:w.city,experience:String(w.experience),description:w.description,status:w.status });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this worker?")) setWorkers((prev) => prev.filter((w) => w.id !== id));
  };

  const handleSave = () => {
    if (!form.name || !form.phone) return;
    if (editing) {
      setWorkers((prev) => prev.map((w) => w.id === editing.id ? { ...w, ...form, experience: Number(form.experience) } : w));
    } else {
      const newW: Worker = { id: `w${Date.now()}`, ...form, experience: Number(form.experience), rating: 4.0, reviewCount: 0, verified: false, joinedAt: new Date().toISOString().split("T")[0] };
      setWorkers((prev) => [newW, ...prev]);
    }
    setShowModal(false);
  };

  const inputCls = "w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary";

  return (
    <Layout title="Workers">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex flex-wrap gap-2 flex-1">
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input placeholder="Search workers..." className="w-full pl-9 pr-3 py-2.5 text-sm border border-border rounded-xl bg-card focus:outline-none focus:ring-2 focus:ring-primary/30" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <select className="border border-border rounded-xl px-3 py-2.5 text-sm bg-card focus:outline-none" value={filterCat} onChange={(e) => setFilterCat(e.target.value)}>
              {cats.map((c) => <option key={c}>{c}</option>)}
            </select>
            <select className="border border-border rounded-xl px-3 py-2.5 text-sm bg-card focus:outline-none" value={filterCity} onChange={(e) => setFilterCity(e.target.value)}>
              {cities.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <button onClick={openAdd} className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition flex-shrink-0">
            <Plus size={15} /> Add Worker
          </button>
        </div>

        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  {["Worker","Category","City","Exp","Rating","Status","Actions"].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((w) => (
                  <tr key={w.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold flex-shrink-0">
                          {w.name.split(" ").map((n) => n[0]).join("").slice(0,2)}
                        </div>
                        <div>
                          <p className="font-medium text-foreground flex items-center gap-1">
                            {w.name}
                            {w.verified && <BadgeCheck size={13} className="text-primary" />}
                          </p>
                          <p className="text-xs text-muted-foreground">{w.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{w.category}</td>
                    <td className="px-4 py-3 text-muted-foreground">{w.city}</td>
                    <td className="px-4 py-3 text-muted-foreground">{w.experience}y</td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1 text-amber-500 font-semibold text-xs">⭐ {w.rating}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge label={w.status} variant={w.status === "active" ? "success" : "neutral"} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(w)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition"><Edit2 size={14} /></button>
                        <button onClick={() => handleDelete(w.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={7} className="text-center text-muted-foreground py-8 text-sm">No workers found</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-border text-xs text-muted-foreground">
            Showing {filtered.length} of {workers.length} workers
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="font-semibold text-foreground">{editing ? "Edit Worker" : "Add Worker"}</h2>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground text-xl leading-none">×</button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-semibold text-foreground mb-1 block">Full Name</label><input className={inputCls} value={form.name} onChange={(e) => setForm({...form,name:e.target.value})} placeholder="Worker name" /></div>
                <div><label className="text-xs font-semibold text-foreground mb-1 block">Phone</label><input className={inputCls} value={form.phone} onChange={(e) => setForm({...form,phone:e.target.value})} placeholder="+91 XXXXX XXXXX" /></div>
                <div><label className="text-xs font-semibold text-foreground mb-1 block">Category</label><select className={inputCls} value={form.category} onChange={(e) => setForm({...form,category:e.target.value})}>{["Plumber","Electrician","Carpenter","Painter","Mason","AC Repair","Welder","Labour","CCTV","RO Repair","Cleaning"].map((c) => <option key={c}>{c}</option>)}</select></div>
                <div><label className="text-xs font-semibold text-foreground mb-1 block">City</label><input className={inputCls} value={form.city} onChange={(e) => setForm({...form,city:e.target.value})} placeholder="City" /></div>
                <div><label className="text-xs font-semibold text-foreground mb-1 block">Experience (yrs)</label><input type="number" className={inputCls} value={form.experience} onChange={(e) => setForm({...form,experience:e.target.value})} min="0" /></div>
                <div><label className="text-xs font-semibold text-foreground mb-1 block">Status</label><select className={inputCls} value={form.status} onChange={(e) => setForm({...form,status:e.target.value as "active"|"inactive"})}><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
              </div>
              <div><label className="text-xs font-semibold text-foreground mb-1 block">Description</label><textarea className={inputCls} rows={3} value={form.description} onChange={(e) => setForm({...form,description:e.target.value})} placeholder="Brief description..." /></div>
            </div>
            <div className="flex gap-3 px-6 pb-6">
              <button onClick={() => setShowModal(false)} className="flex-1 border border-border py-2.5 rounded-xl text-sm font-medium hover:bg-muted transition">Cancel</button>
              <button onClick={handleSave} className="flex-1 bg-primary text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition">Save</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
