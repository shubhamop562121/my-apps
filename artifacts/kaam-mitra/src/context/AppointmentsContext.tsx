import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  collection, addDoc, onSnapshot, serverTimestamp, query, where,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "@/lib/firebase";

export type Appointment = {
  id: string;
  workerId: string;
  workerName: string;
  category: string;
  userName: string;
  userPhone: string;
  address: string;
  description: string;
  preferredDate: string;
  preferredTime: string;
  status: "Pending" | "Approved" | "Assigned" | "In Progress" | "Completed" | "Rejected";
  assignedWorkerName?: string;
  bookedAt: string;
};

type NewAppointment = Omit<Appointment, "id" | "bookedAt" | "status">;

type AppointmentsContextType = {
  appointments: Appointment[];
  loading: boolean;
  addAppointment: (a: NewAppointment) => Promise<string>;
};

const AppointmentsContext = createContext<AppointmentsContextType | null>(null);

function mapDoc(id: string, raw: Record<string, unknown>): Appointment {
  return {
    id,
    workerId: (raw.workerId as string) ?? "",
    workerName: (raw.workerName as string) ?? "",
    category: (raw.category as string) ?? "",
    userName: (raw.userName as string) ?? "",
    userPhone: (raw.userPhone as string) ?? "",
    address: (raw.address as string) ?? "",
    description: (raw.description as string) ?? "",
    preferredDate: (raw.preferredDate as string) ?? "",
    preferredTime: (raw.preferredTime as string) ?? "",
    status: (raw.status as Appointment["status"]) ?? "Pending",
    assignedWorkerName: (raw.assignedWorkerName as string) ?? undefined,
    bookedAt: (raw.bookedAt as string) ?? "",
  };
}

export function AppointmentsProvider({ children }: { children: ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubSnap: (() => void) | null = null;

    const unsubAuth = onAuthStateChanged(auth, (u) => {
      if (unsubSnap) {
        unsubSnap();
        unsubSnap = null;
      }
      if (!u) {
        setAppointments([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      // Only the signed-in user's own appointments.
      unsubSnap = onSnapshot(
        query(collection(db, "appointments"), where("userId", "==", u.uid)),
        (snap) => {
          const rows = snap.docs.map((d) => {
            const raw = d.data() as Record<string, unknown>;
            const createdAt = raw.createdAt as { toMillis?: () => number } | undefined;
            return {
              createdMs: createdAt?.toMillis ? createdAt.toMillis() : 0,
              apt: mapDoc(d.id, raw),
            };
          });
          rows.sort((a, b) => b.createdMs - a.createdMs);
          setAppointments(rows.map((r) => r.apt));
          setLoading(false);
        },
        (err) => {
          console.error("Firestore appointments error:", err);
          setLoading(false);
        },
      );
    });

    return () => {
      if (unsubSnap) unsubSnap();
      unsubAuth();
    };
  }, []);

  const addAppointment = async (a: NewAppointment): Promise<string> => {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error("You must be signed in to book an appointment.");
    const ref = await addDoc(collection(db, "appointments"), {
      ...a,
      userId: uid,
      status: "Pending",
      bookedAt: new Date().toISOString().split("T")[0],
      createdAt: serverTimestamp(),
    });
    return ref.id;
  };

  return (
    <AppointmentsContext.Provider value={{ appointments, loading, addAppointment }}>
      {children}
    </AppointmentsContext.Provider>
  );
}

export function useAppointments() {
  const ctx = useContext(AppointmentsContext);
  if (!ctx) throw new Error("useAppointments must be used within AppointmentsProvider");
  return ctx;
}
