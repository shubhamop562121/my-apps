import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, ClipboardList, Calendar, HardHat } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import StatusBadge from "@/components/StatusBadge";
import EmptyState from "@/components/EmptyState";
import { useAppointments } from "@/context/AppointmentsContext";

const categoryIcons: Record<string, string> = {
  Plumber: "💧", Electrician: "⚡", "AC Repair": "❄️", "AC Technician": "❄️",
  Painter: "🎨", "CCTV Installer": "📷", Carpenter: "🪚", Mason: "🧱",
  "Cleaning Worker": "🧹", Welder: "🔧", "RO Technician": "💦", Labour: "👷",
};

export default function RequestsPage() {
  const [, setLocation] = useLocation();
  const { appointments } = useAppointments();

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      <div className="bg-white border-b border-border px-5 pt-14 pb-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.history.back()}
              className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center"
              data-testid="btn-back"
            >
              <ArrowLeft size={20} className="text-foreground" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-foreground">My Appointments</h1>
              <p className="text-xs text-muted-foreground mt-0.5">{appointments.length} total</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 pt-5 flex-1">
        {appointments.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No Appointments Yet"
            subtitle="Browse workers and book your first appointment."
            ctaLabel="Find Workers"
            ctaHref="/home"
          />
        ) : (
          <div className="flex flex-col gap-3">
            {appointments.map((apt, i) => (
              <motion.div
                key={apt.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                onClick={() => setLocation(`/requests/${apt.id}`)}
                className="bg-white rounded-2xl border border-border p-4 cursor-pointer active:scale-[0.99] transition-transform shadow-sm"
                data-testid={`card-request-${apt.id}`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                    {categoryIcons[apt.category] ?? "🔧"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-sm text-foreground">{apt.category}</p>
                      <StatusBadge status={apt.status} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{apt.description}</p>
                    <div className="flex items-center gap-4 mt-2 flex-wrap">
                      <div className="flex items-center gap-1">
                        <Calendar size={11} className="text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{apt.preferredDate}</span>
                      </div>
                      {apt.assignedWorkerName && (
                        <div className="flex items-center gap-1">
                          <HardHat size={11} className="text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{apt.assignedWorkerName}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
