import { useState, useEffect } from "react";
import {
  collection, onSnapshot, addDoc, updateDoc, deleteDoc,
  doc, serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Worker } from "@/data/mockData";

export type WorkerInput = Omit<Worker, "id" | "rating" | "reviewCount" | "joinedAt">;

export function useWorkers() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "workers"),
      (snap) => {
        const data: Worker[] = snap.docs.map((d) => {
          const raw = d.data() as Record<string, unknown>;
          return {
            id: d.id,
            name: (raw.name as string) ?? "",
            phone: (raw.phone as string) ?? "",
            category: (raw.category as string) ?? "",
            city: (raw.city as string) ?? "",
            experience: Number(raw.experience ?? 0),
            rating: Number(raw.rating ?? 4.0),
            reviewCount: Number(raw.reviewCount ?? 0),
            status: (raw.status as "active" | "inactive") ?? "active",
            verified: Boolean(raw.verified ?? false),
            joinedAt: (raw.joinedAt as string) ?? "",
            description: (raw.description as string) ?? (raw.about as string) ?? "",
          };
        });
        data.sort((a, b) => (b.joinedAt > a.joinedAt ? 1 : -1));
        setWorkers(data);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Firestore onSnapshot error:", err);
        setError(`Failed to load workers: ${err.message}`);
        setLoading(false);
      },
    );
    return () => unsub();
  }, []);

  const addWorker = async (input: WorkerInput) => {
    const docRef = await addDoc(collection(db, "workers"), {
      name: input.name,
      phone: input.phone,
      category: input.category,
      city: input.city,
      experience: input.experience,
      description: input.description,
      status: input.status,
      rating: 4.0,
      reviewCount: 0,
      verified: input.verified ?? false,
      joinedAt: new Date().toISOString().split("T")[0],
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  };

  const updateWorker = async (id: string, updates: Partial<Omit<Worker, "id">>) => {
    await updateDoc(doc(db, "workers", id), {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  };

  const deleteWorker = async (id: string) => {
    await deleteDoc(doc(db, "workers", id));
  };

  return { workers, loading, error, addWorker, updateWorker, deleteWorker };
}
