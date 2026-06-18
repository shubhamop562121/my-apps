import { useLocation, useRoute } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Phone, MessageCircle, CheckCircle2, Circle, Clock } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import { serviceRequests } from "@/data/mockData";

type TimelineStep = {
  label: string;
  done: boolean;
  active: boolean;
};

function getTimeline(status: string): TimelineStep[] {
  const steps = ["Submitted", "Approved", "Worker Assigned", "In Progress", "Completed"];
  const idx = {
    Pending: 0,
    Approved: 1,
    "In Progress": 3,
    Completed: 4,
    Cancelled: -1,
  }[status] ?? 0;

  return steps.map((label, i) => ({
    label,
    done: i < idx,
    active: i === idx,
  }));
}

const categoryIcons: Record<string, string> = {
  Plumber: "💧", Electrician: "⚡", "AC Repair": "❄️",
  Painter: "🎨", CCTV: "📷", Carpenter: "🪚", Mason: "🧱", Cleaning: "🧹",
};

export default function RequestDetailPage() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/requests/:id");
  const req = serviceRequests.find((r) => r.id === params?.id);

  if (!req) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Request not found.</p>
      </div>
    );
  }

  const timeline = getTimeline(req.status);

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
            <h1 className="text-lg font-bold text-foreground">Request Details</h1>
            <p className="text-xs text-muted-foreground">#{req.id}</p>
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
                <StatusBadge status={req.status} />
              </div>
              <p className="text-sm text-muted-foreground mt-1">{req.description}</p>
              <p className="text-xs text-muted-foreground mt-2">Date: {req.date}</p>
            </div>
          </div>
        </motion.div>

        {req.workerName ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="bg-white rounded-2xl border border-border p-4"
          >
            <h2 className="font-semibold text-sm text-foreground mb-3">Assigned Worker</h2>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                {req.workerName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground">{req.workerName}</p>
                <p className="text-xs text-muted-foreground">{req.category} Specialist</p>
              </div>
            </div>
            <div className="flex gap-2">
              <a
                href={`tel:${req.workerPhone}`}
                className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-xl text-xs font-semibold"
                data-testid="btn-call-worker"
              >
                <Phone size={14} /> Call
              </a>
              <a
                href={`https://wa.me/${(req.workerPhone ?? "").replace(/\D/g, "")}`}
                className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-xl text-xs font-semibold"
                data-testid="btn-whatsapp-worker"
              >
                <MessageCircle size={14} /> WhatsApp
              </a>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="bg-muted rounded-2xl p-4 flex items-center gap-3"
          >
            <Clock size={20} className="text-muted-foreground" />
            <div>
              <p className="font-medium text-sm text-foreground">Awaiting Assignment</p>
              <p className="text-xs text-muted-foreground">A worker will be assigned soon.</p>
            </div>
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
                  {step.active && req.status !== "Cancelled" && (
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
