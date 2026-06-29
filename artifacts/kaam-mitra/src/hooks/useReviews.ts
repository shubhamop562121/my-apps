import { useState, useEffect } from "react";
import {
  collection, onSnapshot, query, where, addDoc, serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export type AppReview = {
  id: string;
  workerId: string;
  workerName: string;
  userName: string;
  rating: number;
  comment: string;
  status: string;
  createdAt: unknown;
  createdMs: number;
};

/**
 * Live approved reviews for a single worker.
 * Uses a single-field equality filter (no composite index needed); status
 * filtering and sorting happen client-side.
 */
export function useReviews(workerId: string | undefined) {
  const [reviews, setReviews] = useState<AppReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!workerId) {
      setReviews([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const q = query(collection(db, "reviews"), where("workerId", "==", workerId));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const rows = snap.docs
          .map((d) => {
            const raw = d.data() as Record<string, unknown>;
            const ts = raw.createdAt as { toMillis?: () => number } | undefined;
            return {
              id: d.id,
              workerId: (raw.workerId as string) ?? "",
              workerName: (raw.workerName as string) ?? "",
              userName: (raw.userName as string) ?? "Anonymous",
              rating: Number(raw.rating ?? 0),
              comment: (raw.comment as string) ?? "",
              status: (raw.status as string) ?? "pending",
              createdAt: raw.createdAt,
              createdMs: ts?.toMillis ? ts.toMillis() : 0,
            } as AppReview;
          })
          .filter((r) => r.status === "approved")
          .sort((a, b) => b.createdMs - a.createdMs);
        setReviews(rows);
        setLoading(false);
      },
      (err) => {
        console.error("Firestore reviews onSnapshot error:", err);
        setReviews([]);
        setLoading(false);
      },
    );
    return () => unsub();
  }, [workerId]);

  return { reviews, loading };
}

export async function addReview(input: {
  workerId: string;
  workerName: string;
  userName: string;
  rating: number;
  comment: string;
}): Promise<void> {
  const workerId = input.workerId?.trim();
  if (!workerId) throw new Error("Missing worker.");
  const rating = Math.round(Number(input.rating));
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    throw new Error("Please select a rating between 1 and 5 stars.");
  }
  const comment = input.comment.trim().slice(0, 1000);
  const userName = (input.userName?.trim() || "Anonymous").slice(0, 80);
  const workerName = (input.workerName?.trim() || "").slice(0, 120);
  await addDoc(collection(db, "reviews"), {
    workerId,
    workerName,
    userName,
    rating,
    comment,
    status: "pending",
    createdAt: serverTimestamp(),
  });
}
