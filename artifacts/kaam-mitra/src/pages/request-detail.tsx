import { useLocation, useRoute } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Circle, Clock, HardHat, CalendarDays, MapPin, FileText } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import { useAppointments } from "@/context/AppointmentsContext";

type TimelineStep = { label: string; done: boolean; active: boolean };

function getTimeline(status: string): TimelineStep[] {
  const steps = ["Submitted", "Approved", "Worker Assigned", "In Progress", "Completed"];
  const idx: Record<string, number> = {
    Pending: 0, Approved: 1, Assigned: 2, "In Progress": 3, Completed: 4,
  };
  const cur = idx[status] ?? 0;
  return steps.map((label, i) => ({ label, done: i < cur, active: i === cur }));
}

const categoryIcons: Record<string, string> = {
  Plumber: "💧", Electrician: "⚡", "AC Repair": "❄️", "AC Technician": "❄️",
  Painter: "🎨", "CCTV Installer": "📷", Carpenter: "🪚", Mason: "🧱",
  "Cleaning Worker": "🧹", Welder: "🔧", "RO Technician": "💦", Labour: "👷",
};

export default function RequestDetailPage() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/requests/:id");
  const { appointments } = useAppointments();
  const req = appointments.find((a) => a.id === params?.id);

  if (!req) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Appointment not found.</p>
      </div>
    );
  }

  const timeline = getTimeline(req.status === "Rejected" ? "Pending" : req.status);

  return (
    <div className="flex flex-col min-h-screen bg-background pb-8">
      <div className="bg-white border-b border-border px-5 pt-14 pb-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLocation("/requests")}
            className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center"
            data-testid="btn-back"
          >
            <ArrowLeft size={20} className="text-foreground" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-foreground">Appointment Details</h1>
            <p className="text-xs text-muted-foreground font-mono">#{req.id.toUpperCase()}</p>
          </div>
        </div>
      </div>

      <div className="px-5 pt-5 flex flex-col gap-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-border p-4"
        >
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center text-xl flex-shrink-0">
              {categoryIcons[req.category] ?? "🔧"}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-foreground">{req.category}</p>
                <StatusBadge status={req.status as string} />
              </div>
              <div className="flex items-center gap-1 mt-1">
                <CalendarDays size={11} className="text-muted-foreground" />
                <p className="text-xs text-muted-foreground">{req.preferredDate} · {req.preferredTime}</p>
              </div>
              <div className="flex items-start gap-1 mt-1">
                <MapPin size={11} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                <p className="text-xs text-muted-foreground line-clamp-1">{req.address}</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white rounded-2xl border border-border p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <FileText size={14} className="text-primary" />
            <h2 className="font-semibold text-sm text-foreground">Work Description</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{req.description}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="bg-white rounded-2xl border border-border p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <HardHat size={14} className="text-primary" />
            <h2 className="font-semibold text-sm text-foreground">Assigned Worker</h2>
          </div>
          {req.assignedWorkerName ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                {req.assignedWorkerName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground">{req.assignedWorkerName}</p>
                <p className="text-xs text-muted-foreground">{req.category} Specialist · KaamMitra Verified</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 bg-muted rounded-xl p-3">
              <Clock size={18} className="text-muted-foreground" />
              <div>
                <p className="font-medium text-sm text-foreground">Awaiting Assignment</p>
                <p className="text-xs text-muted-foreground">Our team will assign a worker soon</p>
              </div>
            </div>
          )}
        </motion.div>

        {req.status === "Rejected" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-red-50 border border-red-200 rounded-2xl p-4"
          >
            <p className="text-sm font-semibold text-red-700 mb-1">Appointment Rejected</p>
            <p className="text-xs text-red-600">This appointment was not accepted. Please book a new appointment or contact support.</p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl border border-border p-4"
        >
          <h2 className="font-semibold text-sm text-foreground mb-4">Status Timeline</h2>
          <div className="flex flex-col gap-0">
            {timeline.map((step, i) => (
              <div key={step.label} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${step.done ? "bg-primary" : step.active ? "bg-primary/20 border-2 border-primary" : "bg-muted"}`}>
                    {step.done ? (
                      <CheckCircle2 size={14} className="text-white" />
                    ) : step.active ? (
                      <Circle size={10} className="text-primary fill-primary" />
                    ) : (
                      <Circle size={10} className="text-muted-foreground" />
                    )}
                  </div>
                  {i < timeline.length - 1 && (
                    <div className={`w-0.5 h-8 ${step.done ? "bg-primary" : "bg-muted"}`} />
                  )}
                </div>
                <div className="pb-6">
                  <p className={`text-sm font-medium ${step.done || step.active ? "text-foreground" : "text-muted-foreground"}`}>
                    {step.label}
                  </p>
                  {step.active && req.status !== "Rejected" && (
                    <p className="text-xs text-primary font-medium mt-0.5">Current status</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
