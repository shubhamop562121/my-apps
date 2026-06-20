type Status = string;

const config: Record<string, { bg: string; text: string; dot: string }> = {
  Pending:      { bg: "bg-amber-100",  text: "text-amber-700",  dot: "bg-amber-500"  },
  Approved:     { bg: "bg-blue-100",   text: "text-blue-700",   dot: "bg-blue-500"   },
  Assigned:     { bg: "bg-indigo-100", text: "text-indigo-700", dot: "bg-indigo-500" },
  "In Progress":{ bg: "bg-purple-100", text: "text-purple-700", dot: "bg-purple-500" },
  Completed:    { bg: "bg-green-100",  text: "text-green-700",  dot: "bg-green-500"  },
  Rejected:     { bg: "bg-red-100",    text: "text-red-600",    dot: "bg-red-400"    },
  Cancelled:    { bg: "bg-red-100",    text: "text-red-600",    dot: "bg-red-400"    },
};

const fallback = { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" };

export default function StatusBadge({ status }: { status: Status }) {
  const { bg, text, dot } = config[status] ?? fallback;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${bg} ${text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {status}
    </span>
  );
}
