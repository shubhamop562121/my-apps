import { useState, useEffect } from "react";
import {
  collection, onSnapshot, updateDoc, doc, serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Appointment } from "@/data/mockData";

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "appointments"),
      (snap) => {
        const rows = snap.docs.map((d) => {
          const raw = d.data() as Record<string, unknown>;
          const createdAt = raw.createdAt as { toMillis?: () => number } | undefined;
          return {
            createdMs: createdAt?.toMillis ? createdAt.toMillis() : 0,
            apt: {
              id: d.id,
              userName: (raw.userName as string) ?? "",
              userPhone: (raw.userPhone as string) ?? "",
              address: (raw.address as string) ?? "",
              category: (raw.category as string) ?? "",
              workerName: (raw.workerName as string) ?? "",
              description: (raw.description as string) ?? "",
              preferredDate: (raw.preferredDate as string) ?? "",
              preferredTime: (raw.preferredTime as string) ?? "",
              status: (raw.status as Appointment["status"]) ?? "Pending",
              assignedWorkerName: (raw.assignedWorkerName as string) ?? undefined,
              assignedWorkerId: (raw.assignedWorkerId as string) ?? undefined,
              bookedAt: (raw.bookedAt as string) ?? "",
              note: (raw.note as string) ?? undefined,
            } as Appointment,
          };
        });
        rows.sort((a, b) => b.createdMs - a.createdMs);
        setAppointments(rows.map((r) => r.apt));
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Firestore appointments error:", err);
        setError(`Failed to load appointments: ${err.message}`);
        setLoading(false);
      },
    );
    return () => unsub();
  }, []);

  const updateAppointment = async (id: string, patch: Partial<Omit<Appointment, "id">>) => {
    await updateDoc(doc(db, "appointments", id), {
      ...patch,
      updatedAt: serverTimestamp(),
    });
  };

  return { appointments, loading, error, updateAppointment };
}
