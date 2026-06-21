import { useState, useEffect } from "react";
import {
  collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

/**
 * Generic real-time Firestore collection hook.
 * - Reads live via onSnapshot (always reflects the latest DB state, survives refresh).
 * - add/update/remove perform real addDoc/updateDoc/deleteDoc writes.
 * - Every operation logs its payload, success, and errors to the console.
 * - Writes throw on failure so callers can surface real errors (no fake success).
 */
export function useCollection<T extends { id: string }>(name: string) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log(`[Firestore] "${name}" → subscribe`);
    const unsub = onSnapshot(
      collection(db, name),
      (snap) => {
        const rows = snap.docs.map((d) => {
          const raw = d.data() as Record<string, unknown>;
          const createdAt = raw.createdAt as { toMillis?: () => number } | undefined;
          return {
            createdMs: createdAt?.toMillis ? createdAt.toMillis() : 0,
            item: { ...raw, id: d.id } as unknown as T,
          };
        });
        rows.sort((a, b) => b.createdMs - a.createdMs);
        setItems(rows.map((r) => r.item));
        setLoading(false);
        setError(null);
        console.log(`[Firestore] "${name}" → loaded ${rows.length} doc(s)`);
      },
      (err) => {
        console.error(`[Firestore] "${name}" → read error:`, err);
        setError(err.message);
        setLoading(false);
      },
    );
    return () => unsub();
  }, [name]);

  const add = async (data: Omit<T, "id">): Promise<string> => {
    console.log(`[Firestore] "${name}" → addDoc`, data);
    try {
      const ref = await addDoc(collection(db, name), {
        ...data,
        createdAt: serverTimestamp(),
      });
      console.log(`[Firestore] "${name}" → addDoc success, id=${ref.id}`);
      return ref.id;
    } catch (err) {
      console.error(`[Firestore] "${name}" → addDoc failed:`, err);
      throw err;
    }
  };

  const update = async (id: string, patch: Partial<Omit<T, "id">>): Promise<void> => {
    console.log(`[Firestore] "${name}/${id}" → updateDoc`, patch);
    try {
      await updateDoc(doc(db, name, id), {
        ...patch,
        updatedAt: serverTimestamp(),
      });
      console.log(`[Firestore] "${name}/${id}" → updateDoc success`);
    } catch (err) {
      console.error(`[Firestore] "${name}/${id}" → updateDoc failed:`, err);
      throw err;
    }
  };

  const remove = async (id: string): Promise<void> => {
    console.log(`[Firestore] "${name}/${id}" → deleteDoc`);
    try {
      await deleteDoc(doc(db, name, id));
      console.log(`[Firestore] "${name}/${id}" → deleteDoc success`);
    } catch (err) {
      console.error(`[Firestore] "${name}/${id}" → deleteDoc failed:`, err);
      throw err;
    }
  };

  return { items, loading, error, add, update, remove };
}
