import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

export type AppCity = {
  id: string;
  name: string;
  state: string;
};

const DEFAULT_CITIES: AppCity[] = [
  { id: "new-delhi", name: "New Delhi", state: "Delhi" },
  { id: "mumbai", name: "Mumbai", state: "Maharashtra" },
  { id: "bangalore", name: "Bangalore", state: "Karnataka" },
  { id: "hyderabad", name: "Hyderabad", state: "Telangana" },
  { id: "chennai", name: "Chennai", state: "Tamil Nadu" },
  { id: "pune", name: "Pune", state: "Maharashtra" },
  { id: "jaipur", name: "Jaipur", state: "Rajasthan" },
  { id: "ahmedabad", name: "Ahmedabad", state: "Gujarat" },
  { id: "lucknow", name: "Lucknow", state: "Uttar Pradesh" },
];

export function useCities() {
  const [cities, setCities] = useState<AppCity[]>(DEFAULT_CITIES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "cities"),
      (snap) => {
        const rows: AppCity[] = [];
        snap.docs.forEach((d) => {
          const raw = d.data() as Record<string, unknown>;
          const name = (raw.name as string) ?? "";
          const status = (raw.status as string) ?? "active";
          if (!name || status === "inactive") return;
          rows.push({
            id: d.id,
            name,
            state: (raw.state as string) ?? "",
          });
        });
        rows.sort((a, b) => a.name.localeCompare(b.name));
        setCities(rows.length > 0 ? rows : DEFAULT_CITIES);
        setLoading(false);
      },
      (err) => {
        console.error("Firestore cities onSnapshot error:", err);
        setCities(DEFAULT_CITIES);
        setLoading(false);
      },
    );
    return () => unsub();
  }, []);

  return { cities, loading };
}
