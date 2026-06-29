export function formatDate(value: unknown): string {
  if (!value) return "—";
  let date: Date | null = null;

  if (typeof value === "string") {
    const d = new Date(value);
    if (isNaN(d.getTime())) return value;
    date = d;
  } else if (typeof value === "number") {
    date = new Date(value);
  } else if (value instanceof Date) {
    date = value;
  } else if (typeof value === "object") {
    const v = value as { toDate?: () => Date; seconds?: number };
    if (typeof v.toDate === "function") date = v.toDate();
    else if (typeof v.seconds === "number") date = new Date(v.seconds * 1000);
  }

  if (!date || isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
