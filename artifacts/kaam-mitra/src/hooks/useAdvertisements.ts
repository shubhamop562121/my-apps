import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

export type AppAd = {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string;
  position: string;
};

function isLive(raw: Record<string, unknown>): boolean {
  if ((raw.status as string) !== "active") return false;
  const today = new Date().toISOString().split("T")[0];
  const start = (raw.startDate as string) || "";
  const end = (raw.endDate as string) || "";
  if (start && today < start) return false;
  if (end && today > end) return false;
  return true;
}

/**
 * Live advertisements, optionally filtered by position. Reads the whole (small)
 * collection and filters by status/date-window client-side — no index needed.
 */
export function useAdvertisements(position?: string) {
  const [ads, setAds] = useState<AppAd[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "advertisements"),
      (snap) => {
        const rows: AppAd[] = [];
        snap.docs.forEach((d) => {
          const raw = d.data() as Record<string, unknown>;
          if (!isLive(raw)) return;
          if (position && (raw.position as string) !== position) return;
          const imageUrl = (raw.imageUrl as string) ?? "";
          if (!imageUrl) return;
          rows.push({
            id: d.id,
            title: (raw.title as string) ?? "",
            imageUrl,
            linkUrl: (raw.linkUrl as string) ?? "",
            position: (raw.position as string) ?? "",
          });
        });
        setAds(rows);
        setLoading(false);
      },
      (err) => {
        console.error("Firestore advertisements onSnapshot error:", err);
        setAds([]);
        setLoading(false);
      },
    );
    return () => unsub();
  }, [position]);

  return { ads, loading };
}
