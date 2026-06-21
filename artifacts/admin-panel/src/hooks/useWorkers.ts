import { useState, useEffect } from "react";
import {
  collection, onSnapshot, addDoc, updateDoc, deleteDoc,
  doc, serverTimestamp, query, orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Worker } from "@/data/mockData";

export type WorkerInput = Omit<Worker, "id" | "rating" | "reviewCount" | "verified" | "joinedAt">;

export function useWorkers() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "workers"), orderBy("joinedAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const data: Worker[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Worker, "id">) }));
        setWorkers(data);
        setLoading(false);
      },
      (err) => {
        console.error("Firestore error:", err);
        setError("Failed to load workers. Check Firestore connection.");
        setLoading(false);
      },
    );
    return () => unsub();
  }, []);

  const addWorker = async (input: WorkerInput) => {
    await addDoc(collection(db, "workers"), {
      ...input,
      rating: 4.0,
      reviewCount: 0,
      verified: false,
      joinedAt: new Date().toISOString().split("T")[0],
      createdAt: serverTimestamp(),
    });
  };

  const updateWorker = async (id: string, updates: Partial<Worker>) => {
    const { id: _id, ...rest } = updates as Worker;
    await updateDoc(doc(db, "workers", id), { ...rest, updatedAt: serverTimestamp() });
  };

  const deleteWorker = async (id: string) => {
    await deleteDoc(doc(db, "workers", id));
  };

  return { workers, loading, error, addWorker, updateWorker, deleteWorker };
}
