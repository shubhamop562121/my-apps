import { useEffect, useMemo, useState } from "react";
import { Search, CheckCircle2, XCircle, UserCheck, Play, Trophy, MapPin, Star, BadgeCheck } from "lucide-react";
import Layout from "@/components/Layout";
import Badge from "@/components/Badge";
import type { Appointment } from "@/data/mockData";
import { useWorkers } from "@/hooks/useWorkers";
import { useAppointments } from "@/hooks/useAppointments";

type BadgeVariant = "success" | "danger" | "warning" | "info" | "neutral";

const statusVariant: Record<string, BadgeVariant> = {
  Pending: "warning",
  Approved: "info",
  Assigned: "info",
  "In Progress": "info",
  Completed: "success",
  Rejected: "danger",
};

const categoryIcons: Record<string, string> = {
  Plumber: "💧", Electrician: "⚡", "AC Repair": "❄️", Painter: "🎨",
  CCTV: "📷", Carpenter: "🪚", Mason: "🧱", Cleaning: "🧹",
  Welder: "🔧", "RO Repair": "💦", Labour: "👷",
};

export default function AppointmentsPage() {
  const { workers } = useWorkers();
  const { appointments: apts, updateAppointment } = useAppointments();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [assignWorker, setAssignWorker] = useState("");
  const [workerSearch, setWorkerSearch] = useState("");
  const [rejectNote, setRejectNote] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);

  const selected = apts.find((a) => a.id === selectedId) ?? null;

  // Clear any in-progress worker pick when switching appointments so a leftover
  // selection can't be assigned to the wrong appointment.
  useEffect(() => {
    setAssignWorker("");
    setWorkerSearch("");
    setShowRejectInput(false);
    setRejectNote("");
  }, [selectedId]);

  const statuses = ["All", "Pending", "Approved", "Assigned", "In Progress", "Completed", "Rejected"];
  const pendingCount = apts.filter((a) => a.status === "Pending").length;

  const filtered = apts.filter((a) => {
    const matchSearch =
      a.userName.toLowerCase().includes(search.toLowerCase()) ||
      a.category.toLowerCase().includes(search.toLowerCase()) ||
      a.id.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || a.status === filter;
    return matchSearch && matchFilter;
  });

  const activeWorkers = useMemo(() => workers.filter((w) => w.status === "active"), [workers]);

  // Workers matching the assign-search box, prioritising the same city as the
  // appointment so the admin sees nearby workers first.
  const workerResults = useMemo(() => {
    const q = workerSearch.trim().toLowerCase();
    const list = activeWorkers.filter((w) => {
      if (!q) return true;
      return (
        w.name.toLowerCase().includes(q) ||
        w.category.toLowerCase().includes(q) ||
        w.city.toLowerCase().includes(q)
      );
    });
    const apptCity = (selected?.address ?? "").toLowerCase();
    return [...list].sort((a, b) => {
      const aNear = apptCity && a.city && apptCity.includes(a.city.toLowerCase()) ? 1 : 0;
      const bNear = apptCity && b.city && apptCity.includes(b.city.toLowerCase()) ? 1 : 0;
      if (aNear !== bNear) return bNear - aNear;
      return b.rating - a.rating;
    });
  }, [activeWorkers, workerSearch, selected]);

  const update = (id: string, patch: Partial<Appointment>) => {
    void updateAppointment(id, patch);
  };

  const handleApprove = (a: Appointment) => update(a.id, { status: "Approved" });
  const handleAssign = (a: Appointment) => {
    if (!assignWorker) return;
    const w = workers.find((w) => w.id === assignWorker);
    if (!w) return;
    update(a.id, { status: "Assigned", assignedWorkerName: w.name, assignedWorkerId: w.id });
    setAssignWorker("");
    setWorkerSearch("");
  };
  const handleStart = (a: Appointment) => update(a.id, { status: "In Progress" });
  const handleComplete = (a: Appointment) => update(a.id, { status: "Completed" });
  const handleReject = (a: Appointment) => {
    update(a.id, { status: "Rejected", note: rejectNote || "Request rejected by admin" });
    setRejectNote("");
    setShowRejectInput(false);
  };

  const inputCls = "w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30";

  return (
    <Layout title="Appointments">
      <div className="flex flex-col lg:flex-row gap-4 h-full">
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[180px] max-w-xs">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                placeholder="Search by name, category, ID..."
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-border rounded-xl bg-card focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {pendingCount > 0 && (
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3 py-2 rounded-xl">
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                <span className="text-xs font-semibold text-amber-700">{pendingCount} new pending</span>
              </div>
            )}
          </div>

          <div className="flex gap-2 flex-wrap">
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${filter === s ? "bg-primary text-white" : "bg-card border border-border text-muted-foreground hover:text-foreground"}`}
              >
                {s}
                {s === "Pending" && pendingCount > 0 && (
                  <span className="ml-1.5 bg-amber-500 text-white text-[10px] rounded-full px-1.5 py-0.5">{pendingCount}</span>
                )}
              </button>
            ))}
          </div>

          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    {["ID","User","Category","Date & Time","Status","Actions"].map((h) => (
                      <th key={h} className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((a) => (
                    <tr
                      key={a.id}
                      onClick={() => setSelectedId(a.id)}
                      className={`hover:bg-muted/30 transition-colors cursor-pointer ${selected?.id === a.id ? "bg-primary/5" : ""}`}
                    >
                      <td className="px-4 py-3">
                        <p className="font-mono text-xs text-muted-foreground">{a.id.toUpperCase()}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-foreground text-sm">{a.userName}</p>
                        <p className="text-xs text-muted-foreground">{a.userPhone}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span>{categoryIcons[a.category] ?? "🔧"}</span>
                          <span className="text-sm text-muted-foreground">{a.category}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-foreground">{a.preferredDate}</p>
                        <p className="text-xs text-muted-foreground">{a.preferredTime}</p>
                      </td>
                      <td className="px-4 py-3">
                        <Badge label={a.status} variant={statusVariant[a.status] ?? "neutral"} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                          {a.status === "Pending" && (
                            <>
                              <button onClick={() => handleApprove(a)} title="Approve" className="p-1.5 rounded-lg hover:bg-green-50 text-green-600 transition"><CheckCircle2 size={14} /></button>
                              <button onClick={() => { setSelectedId(a.id); setShowRejectInput(true); }} title="Reject" className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition"><XCircle size={14} /></button>
                            </>
                          )}
                          {a.status === "Approved" && (
                            <button onClick={() => setSelectedId(a.id)} title="Assign Worker" className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition"><UserCheck size={14} /></button>
                          )}
                          {a.status === "Assigned" && (
                            <button onClick={() => handleStart(a)} title="Start" className="p-1.5 rounded-lg hover:bg-purple-50 text-purple-600 transition"><Play size={14} /></button>
                          )}
                          {a.status === "In Progress" && (
                            <button onClick={() => handleComplete(a)} title="Complete" className="p-1.5 rounded-lg hover:bg-green-50 text-green-600 transition"><Trophy size={14} /></button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={6} className="text-center text-muted-foreground py-8 text-sm">No appointments found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 border-t border-border text-xs text-muted-foreground">
              Showing {filtered.length} of {apts.length} appointments
            </div>
          </div>
        </div>

        <div className="lg:w-80 xl:w-96 flex-shrink-0">
          {selected ? (
            <div className="bg-card border border-border rounded-xl shadow-sm p-5 sticky top-20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground text-sm">Appointment Details</h3>
                <button onClick={() => { setSelectedId(null); setShowRejectInput(false); }} className="text-muted-foreground hover:text-foreground text-xl leading-none">×</button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-muted-foreground">{selected.id.toUpperCase()}</span>
                  <Badge label={selected.status} variant={statusVariant[selected.status] ?? "neutral"} />
                </div>

                <div className="bg-muted/50 rounded-xl p-3 space-y-2">
                  <Row label="Customer" value={selected.userName} />
                  <Row label="Phone" value={selected.userPhone} />
                  <Row label="Address" value={selected.address} />
                  <Row label="Category" value={`${categoryIcons[selected.category] ?? "🔧"} ${selected.category}`} />
                  <Row label="Date" value={`${selected.preferredDate} · ${selected.preferredTime}`} />
                  <Row label="Booked On" value={selected.bookedAt} />
                </div>

                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1">Description</p>
                  <p className="text-sm text-foreground leading-relaxed">{selected.description}</p>
                </div>

                {selected.assignedWorkerName && (() => {
                  const aw = workers.find((w) => w.id === selected.assignedWorkerId);
                  return (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                      <p className="text-xs font-semibold text-blue-700 mb-1">Assigned Worker</p>
                      <p className="text-sm text-blue-800 font-medium">{selected.assignedWorkerName}</p>
                      {aw && (
                        <div className="flex items-center gap-3 mt-1">
                          <span className="flex items-center gap-1 text-xs text-blue-700/80">
                            <MapPin size={11} /> {aw.city || "—"}
                          </span>
                          <span className="text-xs text-blue-700/80">{aw.category}</span>
                          {aw.phone && <span className="text-xs text-blue-700/80">{aw.phone}</span>}
                        </div>
                      )}
                    </div>
                  );
                })()}

                {selected.note && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                    <p className="text-xs font-semibold text-red-700 mb-1">Rejection Note</p>
                    <p className="text-sm text-red-700">{selected.note}</p>
                  </div>
                )}

                <div className="border-t border-border pt-3 space-y-2">
                  {selected.status === "Pending" && (
                    <>
                      <button
                        onClick={() => handleApprove(selected)}
                        className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-green-700 transition"
                      >
                        <CheckCircle2 size={15} /> Approve Appointment
                      </button>
                      {!showRejectInput ? (
                        <button
                          onClick={() => setShowRejectInput(true)}
                          className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-100 transition"
                        >
                          <XCircle size={15} /> Reject
                        </button>
                      ) : (
                        <div className="space-y-2">
                          <input className={inputCls} placeholder="Reason for rejection (optional)" value={rejectNote} onChange={(e) => setRejectNote(e.target.value)} />
                          <div className="flex gap-2">
                            <button onClick={() => setShowRejectInput(false)} className="flex-1 border border-border py-2 rounded-xl text-xs hover:bg-muted transition">Cancel</button>
                            <button onClick={() => handleReject(selected)} className="flex-1 bg-red-600 text-white py-2 rounded-xl text-xs font-semibold hover:bg-red-700 transition">Confirm Reject</button>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {selected.status === "Approved" && (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-foreground">Assign Worker</p>
                      <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                          className={`${inputCls} pl-9`}
                          placeholder="Search by name, skill, or city..."
                          value={workerSearch}
                          onChange={(e) => setWorkerSearch(e.target.value)}
                          data-testid="input-worker-search"
                        />
                      </div>

                      <p className="text-[11px] text-muted-foreground">Workers nearest the customer are shown first.</p>

                      <div className="max-h-64 overflow-y-auto rounded-xl border border-border divide-y divide-border">
                        {workerResults.map((w) => {
                          const isSel = assignWorker === w.id;
                          return (
                            <button
                              key={w.id}
                              onClick={() => setAssignWorker(w.id)}
                              className={`w-full text-left px-3 py-2.5 transition flex items-start gap-2.5 ${isSel ? "bg-primary/10" : "hover:bg-muted/50"}`}
                              data-testid={`worker-option-${w.id}`}
                            >
                              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">
                                {w.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5">
                                  <p className="text-sm font-medium text-foreground truncate">{w.name}</p>
                                  {w.verified && <BadgeCheck size={13} className="text-blue-500 flex-shrink-0" />}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  {categoryIcons[w.category] ?? "🔧"} {w.category}
                                  {w.experience ? ` · ${w.experience}y exp` : ""}
                                </p>
                                <div className="flex items-center gap-3 mt-0.5">
                                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <MapPin size={11} /> {w.city || "—"}
                                  </span>
                                  <span className="flex items-center gap-1 text-xs text-amber-600">
                                    <Star size={11} className="fill-amber-400 text-amber-400" /> {w.rating.toFixed(1)}
                                  </span>
                                </div>
                              </div>
                              {isSel && <CheckCircle2 size={16} className="text-primary flex-shrink-0 mt-0.5" />}
                            </button>
                          );
                        })}
                        {workerResults.length === 0 && (
                          <p className="text-center text-xs text-muted-foreground py-6">No matching workers found</p>
                        )}
                      </div>

                      <button
                        onClick={() => handleAssign(selected)}
                        disabled={!assignWorker}
                        className="w-full flex items-center justify-center gap-2 bg-primary text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition disabled:opacity-50"
                        data-testid="btn-assign-worker"
                      >
                        <UserCheck size={15} /> Assign Worker
                      </button>
                    </div>
                  )}

                  {selected.status === "Assigned" && (
                    <button
                      onClick={() => handleStart(selected)}
                      className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-purple-700 transition"
                    >
                      <Play size={15} /> Mark In Progress
                    </button>
                  )}

                  {selected.status === "In Progress" && (
                    <button
                      onClick={() => handleComplete(selected)}
                      className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-green-700 transition"
                    >
                      <Trophy size={15} /> Mark Completed
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-xl p-8 flex flex-col items-center justify-center gap-3 text-center shadow-sm">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                <CheckCircle2 size={24} className="text-primary/50" />
              </div>
              <p className="text-sm font-medium text-foreground">Select an appointment</p>
              <p className="text-xs text-muted-foreground">Click any row to view details and take action</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-2">
      <span className="text-xs text-muted-foreground flex-shrink-0">{label}</span>
      <span className="text-xs text-foreground text-right font-medium">{value}</span>
    </div>
  );
}
