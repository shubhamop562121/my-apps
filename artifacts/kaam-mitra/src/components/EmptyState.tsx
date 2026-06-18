import { LucideIcon } from "lucide-react";
import { Link } from "wouter";

type Props = {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export default function EmptyState({ icon: Icon, title, subtitle, ctaLabel, ctaHref }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center gap-4">
      <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center">
        <Icon size={36} className="text-muted-foreground" />
      </div>
      <div>
        <p className="font-semibold text-base text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
      </div>
      {ctaLabel && ctaHref && (
        <Link href={ctaHref}>
          <button className="mt-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-semibold">
            {ctaLabel}
          </button>
        </Link>
      )}
    </div>
  );
}
