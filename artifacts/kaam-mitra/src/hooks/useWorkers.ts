import { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Worker } from "@/data/mockData";

export function useWorkers() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "workers"), orderBy("joinedAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const data: Worker[] = snap.docs.map((d) => {
          const raw = d.data() as Omit<Worker, "id"> & { description?: string };
          return {
            id: d.id,
            name: raw.name ?? "",
            profession: raw.profession ?? raw.category ?? "",
            category: (raw.category ?? "").toLowerCase().replace(/\s+/g, "-"),
            city: raw.city ?? "",
            experience: raw.experience ?? 0,
            verified: raw.verified ?? false,
            rating: raw.rating ?? 4.0,
            reviewCount: raw.reviewCount ?? 0,
            phone: raw.phone ?? "",
            about: raw.about ?? raw.description ?? "",
            services: Array.isArray(raw.services) ? raw.services : [],
            avatar: raw.avatar ?? "",
          };
        });
        setWorkers(data);
        setLoading(false);
      },
      (err) => {
        console.error("Firestore error:", err);
        setError("Failed to load workers.");
        setLoading(false);
      },
    );
    return () => unsub();
  }, []);

  return { workers, loading, error };
}
