import { useMemo, useState } from "react";
import { useCollection } from "@/hooks/useCollection";
import type { Appointment, Review, Message } from "@/data/mockData";

export type AdminNotification = {
  id: string;
  kind: "appointment" | "review" | "message";
  title: string;
  message: string;
  time: string;
  read: boolean;
};

const KEY = "km_admin_read_notifs";

function loadRead(): Set<string> {
  try {
    const raw = localStorage.getItem(KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

/**
 * Firestore date fields are inconsistent here: seed docs store ISO strings while
 * docs written via useCollection.add use serverTimestamp() (a Timestamp object).
 * Normalize either form into a numeric sort key + a human display label so
 * sorting never throws and the UI never renders "[object Object]".
 */
function normTime(raw: unknown): { ms: number; label: string } {
  if (!raw) return { ms: 0, label: "" };
  if (typeof raw === "object" && typeof (raw as { toMillis?: () => number }).toMillis === "function") {
    const ms = (raw as { toMillis: () => number }).toMillis();
    return { ms, label: new Date(ms).toLocaleDateString() };
  }
  if (typeof raw === "string") {
    const ms = Date.parse(raw);
    return { ms: Number.isNaN(ms) ? 0 : ms, label: raw };
  }
  return { ms: 0, label: "" };
}

/**
 * Admin notifications are DERIVED from real, actionable Firestore state:
 * pending appointments, reviews awaiting moderation, and open support messages.
 * Each has a stable id tied to its source document, so nothing is ever
 * duplicated, and read state is persisted in localStorage so logging in again
 * never repeats already-seen notifications. Once an item is handled (e.g. an
 * appointment leaves "Pending"), it naturally drops off the list.
 */
export function useAdminNotifications() {
  const { items: appointments } = useCollection<Appointment>("appointments");
  const { items: reviews } = useCollection<Review>("reviews");
  const { items: messages } = useCollection<Message>("messages");
  const [readIds, setReadIds] = useState<Set<string>>(loadRead);

  const notifs = useMemo<AdminNotification[]>(() => {
    const list: Array<AdminNotification & { ms: number }> = [];

    appointments
      .filter((a) => a.status === "Pending")
      .forEach((a) => {
        const t = normTime(a.bookedAt);
        list.push({
          id: `apt-${a.id}`,
          kind: "appointment",
          title: "New Booking Request",
          message: `${a.userName || "A user"} requested ${a.category}${a.workerName ? ` — ${a.workerName}` : ""}.`,
          time: t.label,
          ms: t.ms,
          read: readIds.has(`apt-${a.id}`),
        });
      });

    reviews
      .filter((r) => r.status === "pending")
      .forEach((r) => {
        const t = normTime((r as unknown as { createdAt?: unknown }).createdAt);
        list.push({
          id: `rev-${r.id}`,
          kind: "review",
          title: "Review Awaiting Moderation",
          message: `${r.userName || "A user"} rated ${r.workerName || "a worker"} ${r.rating}★.`,
          time: t.label,
          ms: t.ms,
          read: readIds.has(`rev-${r.id}`),
        });
      });

    messages
      .filter((m) => m.status === "open")
      .forEach((m) => {
        const t = normTime((m as unknown as { createdAt?: unknown }).createdAt);
        list.push({
          id: `msg-${m.id}`,
          kind: "message",
          title: "New Support Message",
          message: `${m.name || "Someone"}: ${m.subject || "(no subject)"}`,
          time: t.label,
          ms: t.ms,
          read: readIds.has(`msg-${m.id}`),
        });
      });

    return list
      .sort((a, b) => b.ms - a.ms)
      .map(({ ms: _ms, ...n }) => n);
  }, [appointments, reviews, messages, readIds]);

  const unreadCount = notifs.filter((n) => !n.read).length;

  const persist = (next: Set<string>) => {
    setReadIds(new Set(next));
    try {
      localStorage.setItem(KEY, JSON.stringify([...next]));
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
