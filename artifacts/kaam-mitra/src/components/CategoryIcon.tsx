import {
  Droplets, Zap, Hammer, Building2, Paintbrush, Wind,
  Flame, HardHat, Camera, Waves, Sparkles, Grid3x3,
} from "lucide-react";
import { Link } from "wouter";

const iconMap: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  Droplets, Zap, Hammer, Building2, Paintbrush, Wind,
  Flame, HardHat, Camera, Waves, Sparkles, Grid3x3,
};

type Props = {
  icon: string;
  label: string;
  color: string;
  slug: string;
};

export default function CategoryIcon({ icon, label, color, slug }: Props) {
  const Icon = iconMap[icon] || Grid3x3;
  return (
    <Link href={`/category/${slug}`}>
      <div
        className="flex flex-col items-center gap-1.5 cursor-pointer"
        data-testid={`category-${slug}`}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm"
          style={{ backgroundColor: color + "18" }}
        >
          <Icon size={26} color={color} />
        </div>
        <span className="text-[11px] font-medium text-foreground text-center leading-tight">{label}</span>
      </div>
    </Link>
  );
}
