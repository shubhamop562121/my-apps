import { LucideIcon } from "lucide-react";

type Props = {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  bg: string;
  change?: string;
};

export default function StatCard({ title, value, icon: Icon, color, bg, change }: Props) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 flex items-start justify-between shadow-sm">
      <div>
        <p className="text-sm text-muted-foreground font-medium">{title}</p>
        <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
        {change && <p className="text-xs text-green-600 mt-1 font-medium">{change}</p>}
      </div>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${bg}`}>
        <Icon size={20} className={color} />
      </div>
    </div>
  );
}
