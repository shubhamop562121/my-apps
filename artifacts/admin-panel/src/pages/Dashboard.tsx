import { Users, HardHat, Grid3x3, MapPin, Star, Megaphone, TrendingUp, UserPlus } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import Layout from "@/components/Layout";
import StatCard from "@/components/StatCard";
import Badge from "@/components/Badge";
import { dashboardStats } from "@/data/mockData";

const PIE_COLORS = ["#1D4ED8","#16A34A","#F59E0B","#EF4444","#8B5CF6","#6B7280"];

export default function Dashboard() {
  return (
    <Layout title="Dashboard">
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatCard title="Total Users" value={dashboardStats.totalUsers} icon={Users} color="text-blue-600" bg="bg-blue-100" change="+2 this week" />
          <StatCard title="Total Workers" value={dashboardStats.totalWorkers} icon={HardHat} color="text-green-600" bg="bg-green-100" change="+3 this week" />
          <StatCard title="Categories" value={dashboardStats.totalCategories} icon={Grid3x3} color="text-purple-600" bg="bg-purple-100" />
          <StatCard title="Cities" value={dashboardStats.totalCities} icon={MapPin} color="text-amber-600" bg="bg-amber-100" />
          <StatCard title="Reviews" value={dashboardStats.totalReviews} icon={Star} color="text-yellow-500" bg="bg-yellow-100" />
          <StatCard title="Active Ads" value={dashboardStats.activeAds} icon={Megaphone} color="text-red-600" bg="bg-red-100" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={16} className="text-primary" />
              <h2 className="font-semibold text-foreground text-sm">Monthly Growth</h2>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={dashboardStats.monthlyGrowth} barSize={14} barCategoryGap="40%">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))", fontSize: "12px" }} />
                <Bar dataKey="users" name="Users" fill="#1D4ED8" radius={[4,4,0,0]} />
                <Bar dataKey="workers" name="Workers" fill="#16A34A" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Grid3x3 size={16} className="text-primary" />
              <h2 className="font-semibold text-foreground text-sm">Workers by Category</h2>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={dashboardStats.workersByCategory} dataKey="count" nameKey="category" cx="50%" cy="50%" outerRadius={75} innerRadius={40}>
                  {dashboardStats.workersByCategory.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Legend iconSize={10} wrapperStyle={{ fontSize: "11px" }} />
                <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))", fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <HardHat size={16} className="text-primary" />
                <h2 className="font-semibold text-foreground text-sm">Recent Workers</h2>
              </div>
            </div>
            <div className="divide-y divide-border">
              {dashboardStats.recentWorkers.map((w) => (
                <div key={w.id} className="flex items-center justify-between px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold flex-shrink-0">
                      {w.name.split(" ").map((n) => n[0]).join("").slice(0,2)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{w.name}</p>
                      <p className="text-xs text-muted-foreground">{w.category} · {w.city}</p>
                    </div>
                  </div>
                  <Badge label={w.status} variant={w.status === "active" ? "success" : "neutral"} />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <UserPlus size={16} className="text-primary" />
                <h2 className="font-semibold text-foreground text-sm">Recent Users</h2>
              </div>
            </div>
            <div className="divide-y divide-border">
              {dashboardStats.recentUsers.map((u) => (
                <div key={u.id} className="flex items-center justify-between px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-xs font-bold flex-shrink-0">
                      {u.name.split(" ").map((n) => n[0]).join("").slice(0,2)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{u.name}</p>
                      <p className="text-xs text-muted-foreground">{u.city} · {u.registeredAt}</p>
                    </div>
                  </div>
                  <Badge label={u.status} variant={u.status === "active" ? "success" : "danger"} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
