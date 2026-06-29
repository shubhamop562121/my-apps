type Props = {
  slug: string;
  size?: number;
  emoji?: string;
};

const categoryConfig: Record<string, { bg: string; fg: string; icon: React.ReactNode }> = {
  plumber: {
    bg: "#EFF6FF",
    fg: "#2563EB",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="17" y="4" width="6" height="14" rx="3" fill="#2563EB"/>
        <rect x="17" y="22" width="6" height="14" rx="3" fill="#2563EB"/>
        <rect x="4" y="17" width="14" height="6" rx="3" fill="#2563EB"/>
        <rect x="22" y="17" width="14" height="6" rx="3" fill="#2563EB"/>
        <circle cx="20" cy="20" r="5" fill="#93C5FD"/>
        <circle cx="20" cy="20" r="2.5" fill="#2563EB"/>
        <circle cx="20" cy="8" r="2" fill="#93C5FD"/>
        <circle cx="20" cy="32" r="2" fill="#93C5FD"/>
      </svg>
    ),
  },
  electrician: {
    bg: "#FFFBEB",
    fg: "#D97706",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 4L10 22H19L18 36L30 18H21L22 4Z" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5" strokeLinejoin="round"/>
        <circle cx="20" cy="8" r="2" fill="#FDE68A"/>
        <path d="M15 27L17 32" stroke="#FDE68A" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  carpenter: {
    bg: "#FEF3C7",
    fg: "#92400E",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="18" width="22" height="8" rx="2" fill="#B45309"/>
        <rect x="24" y="10" width="10" height="6" rx="2" fill="#92400E"/>
        <rect x="24" y="24" width="10" height="6" rx="2" fill="#92400E"/>
        <rect x="10" y="20" width="14" height="4" rx="1" fill="#FDE68A"/>
        <circle cx="31" cy="13" r="3" fill="#D97706"/>
        <circle cx="31" cy="27" r="3" fill="#D97706"/>
        <rect x="8" y="21.5" width="4" height="1" rx="0.5" fill="#92400E"/>
        <rect x="14" y="21.5" width="4" height="1" rx="0.5" fill="#92400E"/>
      </svg>
    ),
  },
  mason: {
    bg: "#F3F4F6",
    fg: "#374151",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="8" width="14" height="8" rx="1.5" fill="#9CA3AF"/>
        <rect x="22" y="8" width="14" height="8" rx="1.5" fill="#9CA3AF"/>
        <rect x="13" y="18" width="14" height="8" rx="1.5" fill="#6B7280"/>
        <rect x="4" y="28" width="14" height="8" rx="1.5" fill="#9CA3AF"/>
        <rect x="22" y="28" width="14" height="8" rx="1.5" fill="#9CA3AF"/>
        <rect x="4" y="16" width="32" height="2" rx="1" fill="#D1D5DB"/>
        <rect x="4" y="26" width="32" height="2" rx="1" fill="#D1D5DB"/>
      </svg>
    ),
  },
  painter: {
    bg: "#F5F3FF",
    fg: "#7C3AED",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="16" y="4" width="6" height="22" rx="3" fill="#8B5CF6"/>
        <path d="M10 26h20v4a6 6 0 01-6 6h-8a6 6 0 01-6-6v-4z" fill="#A78BFA"/>
        <ellipse cx="20" cy="26" rx="10" ry="3" fill="#7C3AED"/>
        <rect x="18" y="4" width="4" height="3" rx="1" fill="#DDD6FE"/>
        <circle cx="12" cy="33" r="2" fill="#EDE9FE"/>
        <circle cx="28" cy="33" r="2" fill="#EDE9FE"/>
        <circle cx="20" cy="35" r="2" fill="#EDE9FE"/>
      </svg>
    ),
  },
  "ac-repair": {
    bg: "#ECFEFF",
    fg: "#0891B2",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="10" width="32" height="14" rx="4" fill="#06B6D4"/>
        <rect x="4" y="10" width="32" height="6" rx="4" fill="#0891B2"/>
        <rect x="8" y="20" width="24" height="2" rx="1" fill="#A5F3FC"/>
        <rect x="8" y="14" width="4" height="2" rx="1" fill="#CFFAFE"/>
        <rect x="14" y="14" width="4" height="2" rx="1" fill="#CFFAFE"/>
        <rect x="20" y="14" width="4" height="2" rx="1" fill="#CFFAFE"/>
        <rect x="29" y="13" width="4" height="4" rx="1" fill="#A5F3FC"/>
        <path d="M14 26 Q12 30 10 34" stroke="#06B6D4" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M20 26 Q20 30 20 34" stroke="#06B6D4" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M26 26 Q28 30 30 34" stroke="#06B6D4" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  welder: {
    bg: "#FFF7ED",
    fg: "#C2410C",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 32L26 14" stroke="#C2410C" strokeWidth="4" strokeLinecap="round"/>
        <rect x="22" y="6" width="12" height="6" rx="2" fill="#EA580C" transform="rotate(45 22 6)"/>
        <circle cx="27" cy="13" r="4" fill="#FB923C"/>
        <path d="M6 34L4 36" stroke="#9A3412" strokeWidth="2" strokeLinecap="round"/>
        <path d="M30 10 L34 6" stroke="#FED7AA" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M32 12 L36 10" stroke="#FED7AA" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M28 8 L30 4" stroke="#FED7AA" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="27" cy="13" r="2" fill="#FFEDD5"/>
      </svg>
    ),
  },
  labour: {
    bg: "#FFFBEB",
    fg: "#B45309",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 14 Q8 6 20 6 Q32 6 32 14 L32 16 L8 16 Z" fill="#D97706"/>
        <rect x="8" y="14" width="24" height="4" rx="0" fill="#B45309"/>
        <rect x="10" y="18" width="20" height="12" rx="2" fill="#FDE68A"/>
        <rect x="4" y="30" width="32" height="4" rx="2" fill="#D97706"/>
        <rect x="18" y="18" width="4" height="12" rx="1" fill="#D97706"/>
      </svg>
    ),
  },
  cctv: {
    bg: "#EFF6FF",
    fg: "#1D4ED8",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="18" cy="20" rx="10" ry="8" fill="#1D4ED8"/>
        <ellipse cx="18" cy="20" rx="6" ry="5" fill="#3B82F6"/>
        <circle cx="18" cy="20" r="3" fill="#1E3A8A"/>
        <circle cx="18" cy="20" r="1.5" fill="#BFDBFE"/>
        <path d="M28 16 L36 12 L36 28 L28 24Z" fill="#2563EB"/>
        <rect x="14" y="28" width="8" height="4" rx="1" fill="#1D4ED8"/>
        <rect x="10" y="32" width="16" height="3" rx="1.5" fill="#1D4ED8"/>
        <circle cx="16" cy="18" r="1" fill="#DBEAFE"/>
      </svg>
    ),
  },
  "ro-repair": {
    bg: "#ECFEFF",
    fg: "#0E7490",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="6" width="20" height="28" rx="4" fill="#06B6D4"/>
        <rect x="13" y="10" width="14" height="8" rx="2" fill="#CFFAFE"/>
        <circle cx="20" cy="28" r="3" fill="#0E7490"/>
        <circle cx="20" cy="28" r="1.5" fill="#A5F3FC"/>
        <path d="M20 4 L20 6" stroke="#0E7490" strokeWidth="2" strokeLinecap="round"/>
        <path d="M20 34 L20 36" stroke="#0E7490" strokeWidth="2" strokeLinecap="round"/>
        <rect x="15" y="20" width="10" height="2" rx="1" fill="#A5F3FC"/>
        <rect x="15" y="23" width="7" height="2" rx="1" fill="#A5F3FC"/>
        <path d="M6 18 Q4 20 6 22" stroke="#06B6D4" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        <path d="M34 18 Q36 20 34 22" stroke="#06B6D4" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      </svg>
    ),
  },
  cleaning: {
    bg: "#ECFDF5",
    fg: "#059669",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 4 L24 10 L18 10Z" fill="#10B981"/>
        <rect x="19" y="10" width="2" height="18" rx="1" fill="#34D399"/>
        <path d="M12 28 Q16 24 20 28 Q24 32 28 28 L28 36 L12 36Z" fill="#10B981"/>
        <path d="M12 28 Q16 24 20 28 Q24 32 28 28" stroke="#059669" strokeWidth="1.5" fill="none"/>
        <circle cx="8" cy="12" r="2" fill="#6EE7B7"/>
        <circle cx="32" cy="8" r="1.5" fill="#6EE7B7"/>
        <circle cx="30" cy="18" r="1" fill="#6EE7B7"/>
        <path d="M6 20 L8 22" stroke="#34D399" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M34 24 L32 26" stroke="#34D399" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  other: {
    bg: "#F9FAFB",
    fg: "#6B7280",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="4" width="14" height="14" rx="3" fill="#9CA3AF"/>
        <rect x="22" y="4" width="14" height="14" rx="3" fill="#9CA3AF"/>
        <rect x="4" y="22" width="14" height="14" rx="3" fill="#9CA3AF"/>
        <rect x="22" y="22" width="14" height="14" rx="3" fill="#9CA3AF"/>
        <circle cx="11" cy="11" r="3" fill="#E5E7EB"/>
        <circle cx="29" cy="11" r="3" fill="#E5E7EB"/>
        <circle cx="11" cy="29" r="3" fill="#E5E7EB"/>
        <circle cx="29" cy="29" r="3" fill="#E5E7EB"/>
      </svg>
    ),
  },
};

export default function CategoryIcon({ slug, size = 32, emoji }: Props) {
  const builtIn = categoryConfig[slug];

  if (!builtIn && emoji) {
    return (
      <div
        className="rounded-2xl flex items-center justify-center"
        style={{
          width: size + 20,
          height: size + 20,
          backgroundColor: "#F3F4F6",
        }}
      >
        <span style={{ fontSize: size - 2, lineHeight: 1 }}>{emoji}</span>
      </div>
    );
  }

  const config = builtIn ?? categoryConfig["other"];
  return (
    <div
      className="rounded-2xl flex items-center justify-center"
      style={{
        width: size + 20,
        height: size + 20,
        backgroundColor: config.bg,
      }}
    >
      <div style={{ width: size, height: size }}>
        {config.icon}
      </div>
    </div>
  );
}
