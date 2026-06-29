import { useEffect, useMemo, useState } from "react";
import { useAppointments, type Appointment } from "@/context/AppointmentsContext";
import { useAuth } from "@/context/AuthContext";

export type AppNotification = {
  id: string;
  type: "new_worker" | "request_approved" | "worker_assigned" | "status_updated";
  title: string;
  message: string;
  time: string;
  read: boolean;
};

const statusMeta: Record<
  Appointment["status"],
  { type: AppNotification["type"]; title: string; msg: (a: Appointment) => string }
> = {
  Pending: {
    type: "status_updated",
    title: "Request Submitted",
    msg: (a) => `Your ${a.category} request has been submitted and is awaiting confirmation.`,
  },
  Approved: {
    type: "request_approved",
    title: "Request Approved",
    msg: (a) => `Your ${a.category} request has been approved.`,
  },
  Assigned: {
    type: "worker_assigned",
    title: "Worker Assigned",
    msg: (a) =>
      `${a.assignedWorkerName || a.workerName || "A worker"} has been assigned to your ${a.category} request.`,
  },
  "In Progress": {
    type: "status_updated",
    title: "Work In Progress",
    msg: (a) => `Your ${a.category} request is now in progress.`,
  },
  Completed: {
    type: "status_updated",
    title: "Work Completed",
    msg: (a) => `Your ${a.category} request has been marked completed.`,
  },
  Rejected: {
    type: "status_updated",
    title: "Request Declined",
    msg: (a) => `Your ${a.category} request was declined.`,
  },
};

const readKey = (uid: string | null) => `km_read_notifs_${uid ?? "anon"}`;

function loadRead(uid: string | null): Set<string> {
  try {
    const raw = localStorage.getItem(readKey(uid));
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

/**
 * Notifications are DERIVED from the signed-in user's real appointments — never
 * from mock data. Each notification has a stable id (`apt-<id>-<status>`) so it
 * can't be duplicated, and read state is persisted in localStorage keyed by uid,
 * so logging in/out never resets or repeats already-seen notifications.
 */
export function useNotifications() {
  const { appointments } = useAppointments();
  const { user } = useAuth();
  const uid = user?.uid ?? null;
  const [readIds, setReadIds] = useState<Set<string>>(() => loadRead(uid));

  useEffect(() => {
    setReadIds(loadRead(uid));
  }, [uid]);

  const notifs = useMemo<AppNotification[]>(() => {
    return appointments.map((a) => {
      const meta = statusMeta[a.status] ?? statusMeta.Pending;
      const id = `apt-${a.id}-${a.status}`;
      return {
        id,
        type: meta.type,
        title: meta.title,
        message: meta.msg(a),
        time: a.bookedAt || "",
        read: readIds.has(id),
      };
    });
  }, [appointments, readIds]);

  const unreadCount = notifs.filter((n) => !n.read).length;

  const persist = (next: Set<string>) => {
    setReadIds(new Set(next));
    try {
      localStorage.setItem(readKey(uid), JSON.stringify([...next]));
    } catch {
      /* ignore storage failures */
    }
  };

  const markRead = (id: string) => {
    if (readIds.has(id)) return;
    const next = new Set(readIds);
    next.add(id);
    persist(next);
  };

  const markAllRead = () => {
    const next = new Set(readIds);
    notifs.forEach((n) => next.add(n.id));
    persist(next);
  };

  return { notifs, unreadCount, markRead, markAllRead };
}
