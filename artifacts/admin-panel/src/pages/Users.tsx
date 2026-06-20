import { useState } from "react";
import { Search, Trash2, Ban, CheckCircle2 } from "lucide-react";
import Layout from "@/components/Layout";
import Badge from "@/components/Badge";
import { users as initialUsers, User } from "@/data/mockData";

export default function UsersPage() {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) || u.phone.includes(search)
  );

  const toggleBlock = (id: string) => {
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, status: u.status === "active" ? "blocked" : "active" } as User : u));
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this user?")) setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <Layout title="Users">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input placeholder="Search users..." className="w-full pl-9 pr-3 py-2.5 text-sm border border-border rounded-xl bg-card focus:outline-none focus:ring-2 focus:ring-primary/30" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="bg-card border border-border rounded-xl px-4 py-2.5 text-sm font-medium text-foreground">
            {users.filter((u) => u.status === "active").length} Active · {users.filter((u) => u.status === "blocked").length} Blocked
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  {["User","Phone","City","Requests","Registered","Status","Actions"].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-xs font-bold flex-shrink-0">
                          {u.name.split(" ").map((n) => n[0]).join("").slice(0,2)}
                        </div>
                        <p className="font-medium text-foreground">{u.name}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{u.phone}</td>
                    <td className="px-4 py-3 text-muted-foreground">{u.city}</td>
                    <td className="px-4 py-3 text-muted-foreground">{u.totalRequests}</td>
                    <td className="px-4 py-3 text-muted-foreground">{u.registeredAt}</td>
                    <td className="px-4 py-3"><Badge label={u.status} variant={u.status === "active" ? "success" : "danger"} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => toggleBlock(u.id)} title={u.status === "active" ? "Block" : "Unblock"} className={`p-1.5 rounded-lg transition ${u.status === "active" ? "hover:bg-amber-50 text-amber-500" : "hover:bg-green-50 text-green-600"}`}>
                          {u.status === "active" ? <Ban size={14} /> : <CheckCircle2 size={14} />}
                        </button>
                        <button onClick={() => handleDelete(u.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan={7} className="text-center text-muted-foreground py-8 text-sm">No users found</td></tr>}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-border text-xs text-muted-foreground">Showing {filtered.length} of {users.length} users</div>
        </div>
      </div>
    </Layout>
  );
}
