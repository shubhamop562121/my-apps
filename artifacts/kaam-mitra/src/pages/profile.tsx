import { useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  Bookmark, ClipboardList, HelpCircle, Info, LogOut,
  ChevronRight, Phone, MapPin, Edit3, PenLine,
} from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/context/AuthContext";
import { loadAddress, shortLocation } from "@/lib/address";

const menuItems = [
  { icon: Bookmark, label: "Saved Workers", href: "/saved", color: "text-primary" },
  { icon: ClipboardList, label: "My Requests", href: "/requests", color: "text-blue-500" },
  { icon: HelpCircle, label: "Help & Support", href: "/help", color: "text-amber-500" },
  { icon: Info, label: "About KaamMitra", href: "/about", color: "text-muted-foreground" },
];

export default function ProfilePage() {
  const [, setLocation] = useLocation();
  const { user, logout } = useAuth();

  const phoneNumber = user?.phoneNumber ?? "+91 98765 43210";
  const displayName = user?.displayName ?? "KaamMitra User";
  const location = shortLocation(loadAddress()) || "Add your address";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // ignore — navigate away regardless
    }
    setLocation("/welcome");
  };

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      <div className="bg-primary px-5 pt-14 pb-8">
        <div className="flex items-start justify-between mb-4">
          <h1 className="text-xl font-bold text-white">Profile</h1>
          <button
            onClick={() => setLocation("/edit-address")}
            className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center"
            data-testid="btn-edit-profile"
          >
            <Edit3 size={16} className="text-white" />
          </button>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-white text-2xl font-bold">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-white text-lg font-bold">{displayName}</h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Phone size={12} className="text-white/70" />
              <span className="text-white/70 text-xs">{phoneNumber}</span>
            </div>
            <button
              onClick={() => setLocation("/edit-address")}
              className="flex items-center gap-1.5 mt-0.5 group"
              data-testid="btn-edit-address"
            >
              <MapPin size={12} className="text-white/70" />
              <span className="text-white/70 text-xs group-hover:text-white transition-colors" data-testid="text-profile-location">{location}</span>
              <PenLine size={10} className="text-white/50 group-hover:text-white/80 transition-colors" />
            </button>
          </div>
        </div>
      </div>

      <div className="px-5 pt-5 flex-1">
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "Requests", value: "5" },
            { label: "Saved", value: "3" },
            { label: "Completed", value: "1" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl border border-border p-3 text-center">
              <p className="text-xl font-bold text-foreground">{stat.value}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-border overflow-hidden mb-4"
        >
          {menuItems.map(({ icon: Icon, label, href, color }, i) => (
            <button
              key={label}
              onClick={() => setLocation(href)}
              className={`w-full flex items-center gap-3 px-4 py-4 text-left hover:bg-muted transition-colors ${i !== menuItems.length - 1 ? "border-b border-border" : ""}`}
              data-testid={`menu-${label.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                <Icon size={18} className={color} />
              </div>
              <span className="flex-1 text-sm font-medium text-foreground">{label}</span>
              <ChevronRight size={16} className="text-muted-foreground" />
            </button>
          ))}
        </motion.div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-4 bg-red-50 rounded-2xl border border-red-100"
          data-testid="btn-logout"
        >
          <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
            <LogOut size={18} className="text-red-500" />
          </div>
          <span className="flex-1 text-sm font-medium text-red-500">Logout</span>
        </button>

        <p className="text-center text-xs text-muted-foreground mt-6">KaamMitra v1.0.0</p>
      </div>

      <BottomNav />
    </div>
  );
}
