import { useEffect, useRef, useState } from "react";
import { Menu, Bell, CalendarClock, Star, MessageSquare, Check } from "lucide-react";
import Sidebar from "./Sidebar";
import { useAdminNotifications, type AdminNotification } from "@/hooks/useAdminNotifications";

const kindIcons = {
  appointment: CalendarClock,
  review: Star,
  message: MessageSquare,
};

const kindColors = {
  appointment: "bg-blue-100 text-blue-600",
  review: "bg-amber-100 text-amber-600",
  message: "bg-green-100 text-green-600",
};

export default function Layout({ children, title }: { children: React.ReactNode; title: string }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const { notifs, unreadCount, markRead, markAllRead } = useAdminNotifications();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-card border-b border-border px-4 lg:px-6 h-14 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <Menu size={20} className="text-foreground" />
            </button>
            <h1 className="text-base font-semibold text-foreground">{title}</h1>
          </div>
          <div className="flex items-center gap-2" ref={panelRef}>
            <div className="relative">
              <button
                onClick={() => setOpen((v) => !v)}
                className="relative p-2 rounded-lg hover:bg-muted transition-colors"
                data-testid="btn-notifications"
              >
                <Bell size={18} className="text-muted-foreground" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 bg-destructive rounded-full flex items-center justify-center text-[9px] font-bold text-white leading-none">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                    <p className="text-sm font-semibold text-foreground">
                      Notifications{unreadCount > 0 ? ` (${unreadCount})` : ""}
                    </p>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-xs text-primary font-semibold flex items-center gap-1"
                        data-testid="btn-mark-all-read"
                      >
                        <Check size={12} /> Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-96 overflow-y-auto">
                    {notifs.length === 0 ? (
                      <div className="px-4 py-10 text-center">
                        <Bell size={28} className="mx-auto text-muted-foreground/40 mb-2" />
                        <p className="text-sm font-medium text-foreground">You're all caught up</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          New booking requests, reviews and messages will show here.
                        </p>
                      </div>
                    ) : (
                      notifs.map((n: AdminNotification) => {
                        const Icon = kindIcons[n.kind];
                        return (
                          <button
                            key={n.id}
                            onClick={() => markRead(n.id)}
                            className={`w-full text-left flex items-start gap-3 px-4 py-3 border-b border-border/60 transition-colors hover:bg-muted/60 ${n.read ? "" : "bg-primary/5"}`}
                            data-testid={`notif-${n.id}`}
                          >
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${kindColors[n.kind]}`}>
                              <Icon size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <p className="text-sm font-semibold text-foreground">{n.title}</p>
                                {!n.read && <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1.5" />}
                              </div>
                              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed truncate">{n.message}</p>
                              {n.time && <p className="text-[10px] text-muted-foreground mt-1">{n.time}</p>}
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
