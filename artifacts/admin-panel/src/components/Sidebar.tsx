import { useLocation } from "wouter";
import {
  LayoutDashboard, Users, HardHat, Grid3x3, MapPin,
  Star, Megaphone, MessageSquare, Settings, LogOut, ChevronRight,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: HardHat, label: "Workers", href: "/workers" },
  { icon: Users, label: "Users", href: "/users" },
  { icon: Grid3x3, label: "Categories", href: "/categories" },
  { icon: MapPin, label: "Cities", href: "/cities" },
  { icon: Star, label: "Reviews", href: "/reviews" },
  { icon: Megaphone, label: "Advertisements", href: "/ads" },
  { icon: MessageSquare, label: "Messages", href: "/messages" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export default function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [location, setLocation] = useLocation();
  const { logout, admin } = useAuth();

  const handleNav = (href: string) => {
    setLocation(href);
    onClose();
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed top-0 left-0 h-full w-64 z-30 flex flex-col transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:z-auto`}
        style={{ backgroundColor: "hsl(var(--sidebar))" }}
      >
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">KM</span>
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">KaamMitra</p>
            <p className="text-white/50 text-xs">Admin Panel</p>
          </div>
        </div>

        <div className="px-3 py-3 flex-1 overflow-y-auto scrollbar-thin">
          <p className="text-white/30 text-[10px] font-semibold uppercase tracking-wider px-3 mb-2">Main Menu</p>
          <nav className="flex flex-col gap-0.5">
            {navItems.map(({ icon: Icon, label, href }) => {
              const active = location === href || (href !== "/" && location.startsWith(href));
              return (
                <button
                  key={href}
                  onClick={() => handleNav(href)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors w-full text-left group ${
                    active
                      ? "bg-primary text-white"
                      : "text-white/60 hover:text-white hover:bg-white/8"
                  }`}
                >
                  <Icon size={16} className={active ? "text-white" : "text-white/50 group-hover:text-white"} />
                  <span className="flex-1">{label}</span>
                  {active && <ChevronRight size={14} className="text-white/60" />}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="px-3 py-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {admin?.name[0] ?? "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-semibold truncate">{admin?.name ?? "Admin"}</p>
              <p className="text-white/40 text-[11px] truncate">{admin?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-colors w-full"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
