type Status = "Pending" | "Approved" | "In Progress" | "Completed" | "Cancelled";

const config: Record<Status, { bg: string; text: string; dot: string }> = {
  Pending: { bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-500" },
  Approved: { bg: "bg-blue-100", text: "text-blue-700", dot: "bg-blue-500" },
  "In Progress": { bg: "bg-purple-100", text: "text-purple-700", dot: "bg-purple-500" },
  Completed: { bg: "bg-green-100", text: "text-green-700", dot: "bg-green-500" },
  Cancelled: { bg: "bg-red-100", text: "text-red-600", dot: "bg-red-400" },
};

export default function StatusBadge({ status }: { status: Status }) {
  const { bg, text, dot } = config[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${bg} ${text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {status}
    </span>
  );
}
