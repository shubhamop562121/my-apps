import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Bell, UserPlus, CheckCircle2, UserCheck, RefreshCw } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import EmptyState from "@/components/EmptyState";
import { useNotifications } from "@/hooks/useNotifications";

const typeIcons = {
  new_worker: UserPlus,
  request_approved: CheckCircle2,
  worker_assigned: UserCheck,
  status_updated: RefreshCw,
};

const typeColors = {
  new_worker: "bg-blue-100 text-blue-600",
  request_approved: "bg-green-100 text-green-600",
  worker_assigned: "bg-primary/10 text-primary",
  status_updated: "bg-amber-100 text-amber-600",
};

export default function NotificationsPage() {
  const [, setLocation] = useLocation();
  const { notifs, unreadCount, markRead, markAllRead } = useNotifications();

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      <div className="bg-white border-b border-border px-5 pt-14 pb-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLocation("/home")}
              className="text-foreground"
              data-testid="btn-back"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-foreground">Notifications</h1>
              {unreadCount > 0 && (
                <p className="text-xs text-muted-foreground mt-0.5">{unreadCount} unread</p>
              )}
            </div>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-xs text-primary font-semibold"
              data-testid="btn-mark-all-read"
            >
              Mark all read
            </button>
          )}
        </div>
      </div>

      <div className="px-5 pt-4 flex-1">
        {notifs.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="No Notifications Yet"
            subtitle="Updates about your service requests will appear here."
          />
        ) : (
          <div className="flex flex-col gap-2">
            {notifs.map((n, i) => {
              const Icon = typeIcons[n.type];
              const colorClass = typeColors[n.type];
              return (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => markRead(n.id)}
                  className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-colors ${n.read ? "bg-white border-border" : "bg-primary/5 border-primary/20"}`}
                  data-testid={`notif-${n.id}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-foreground">{n.title}</p>
                      {!n.read && (
                        <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{n.message}</p>
                    {n.time && <p className="text-[10px] text-muted-foreground mt-1.5">{n.time}</p>}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
