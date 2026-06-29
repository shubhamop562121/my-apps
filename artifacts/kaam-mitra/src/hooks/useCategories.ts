import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { categories as defaultCategories } from "@/data/mockData";

export type AppCategory = {
  slug: string;
  label: string;
  icon: string;
  color: string;
};

function toSlug(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, "-");
}

export function useCategories() {
  const [categories, setCategories] = useState<AppCategory[]>(defaultCategories);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "categories"),
      (snap) => {
        const data: AppCategory[] = [];
        snap.docs.forEach((d) => {
          const raw = d.data() as Record<string, unknown>;
          const name = (raw.name as string) ?? "";
          const status = (raw.status as string) ?? "active";
          if (!name || status === "inactive") return;
          data.push({
            slug: toSlug(name),
            label: name,
            icon: (raw.icon as string) ?? "",
            color: (raw.color as string) ?? "#9CA3AF",
          });
        });

        setCategories(data.length > 0 ? data : defaultCategories);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Firestore categories onSnapshot error:", err);
        setError("Failed to load categories.");
        setCategories(defaultCategories);
        setLoading(false);
      },
    );
    return () => unsub();
  }, []);

  return { categories, loading, error };
}
