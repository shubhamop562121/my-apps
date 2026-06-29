import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Worker } from "@/data/mockData";

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
            profession: (raw.profession as string) ?? (raw.category as string) ?? "",
            category: ((raw.category as string) ?? "").trim().toLowerCase().replace(/\s+/g, "-"),
            city: (raw.city as string) ?? "",
            experience: Number(raw.experience ?? 0),
            verified: Boolean(raw.verified ?? false),
            rating: Number(raw.rating ?? 4.0),
            reviewCount: Number(raw.reviewCount ?? 0),
            phone: (raw.phone as string) ?? "",
            about: (raw.about as string) ?? (raw.description as string) ?? "",
            services: Array.isArray(raw.services) ? (raw.services as string[]) : [],
            avatar: (raw.avatar as string) ?? "",
          };
        });
        data.sort((a, b) => {
          const jA = (a as unknown as Record<string, string>).joinedAt ?? "";
          const jB = (b as unknown as Record<string, string>).joinedAt ?? "";
          return jB > jA ? 1 : -1;
        });
        setWorkers(data);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Firestore onSnapshot error:", err);
        setError("Failed to load workers.");
        setLoading(false);
      },
    );
    return () => unsub();
  }, []);

  return { workers, loading, error };
}
