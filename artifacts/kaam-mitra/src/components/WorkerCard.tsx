import { Phone, MessageCircle, Star, MapPin, BadgeCheck, Bookmark } from "lucide-react";
import { Worker } from "@/data/mockData";
import { Link, useLocation } from "wouter";

type Props = {
  worker: Worker;
  horizontal?: boolean;
  saved?: boolean;
  onToggleSave?: (id: string) => void;
};

export default function WorkerCard({ worker, horizontal = false, saved = false, onToggleSave }: Props) {
  const initials = worker.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const bgColors = [
    "bg-teal-100 text-teal-700",
    "bg-blue-100 text-blue-700",
    "bg-amber-100 text-amber-700",
    "bg-purple-100 text-purple-700",
    "bg-rose-100 text-rose-700",
  ];
  const colorClass = bgColors[worker.id.charCodeAt(1) % bgColors.length];

  if (horizontal) {
    return (
      <div
        className="bg-white rounded-2xl shadow-sm border border-border p-3 w-[160px] flex-shrink-0"
        data-testid={`card-worker-${worker.id}`}
      >
        <div className="flex flex-col items-center gap-2">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold ${colorClass}`}>
            {initials}
          </div>
          <div className="text-center">
            <p className="font-semibold text-sm text-foreground truncate w-full max-w-[130px]">{worker.name}</p>
            <p className="text-xs text-muted-foreground">{worker.profession}</p>
          </div>
          <div className="flex items-center gap-1">
            <MapPin size={10} className="text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground">{worker.city}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star size={10} className="text-amber-400 fill-amber-400" />
            <span className="text-[10px] font-medium text-foreground">{worker.rating}</span>
            {worker.verified && <BadgeCheck size={12} className="text-primary ml-1" />}
          </div>
          <div className="flex gap-2 w-full">
            <a
              href={`tel:${worker.phone}`}
              className="flex-1 flex items-center justify-center gap-1 bg-primary text-primary-foreground rounded-lg py-1.5 text-[10px] font-semibold"
              data-testid={`btn-call-${worker.id}`}
              onClick={(e) => e.stopPropagation()}
            >
              <Phone size={10} />
              Call
            </a>
            <a
              href={`https://wa.me/${worker.phone.replace(/\D/g, "")}`}
              className="flex-1 flex items-center justify-center gap-1 bg-green-500 text-white rounded-lg py-1.5 text-[10px] font-semibold"
              data-testid={`btn-whatsapp-${worker.id}`}
              onClick={(e) => e.stopPropagation()}
            >
              <MessageCircle size={10} />
              WA
            </a>
          </div>
        </div>
      </div>
    );
  }

  const [, setLocation] = useLocation();

  return (
      <div
        className="bg-white rounded-2xl shadow-sm border border-border p-4 flex gap-3 cursor-pointer active:scale-[0.99] transition-transform"
        data-testid={`card-worker-${worker.id}`}
        onClick={() => setLocation(`/worker/${worker.id}`)}
      >
        <div className={`w-14 h-14 rounded-xl flex-shrink-0 flex items-center justify-center text-xl font-bold ${colorClass}`}>
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="font-semibold text-sm text-foreground truncate">{worker.name}</p>
                {worker.verified && <BadgeCheck size={14} className="text-primary flex-shrink-0" />}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{worker.profession}</p>
            </div>
            {onToggleSave && (
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleSave(worker.id); }}
                className="p-1 rounded-lg hover:bg-muted transition-colors"
                data-testid={`btn-save-${worker.id}`}
              >
                <Bookmark
                  size={16}
                  className={saved ? "text-primary fill-primary" : "text-muted-foreground"}
                />
              </button>
            )}
          </div>
          <div className="flex items-center gap-3 mt-1.5">
            <div className="flex items-center gap-1">
              <MapPin size={11} className="text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{worker.city}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star size={11} className="text-amber-400 fill-amber-400" />
              <span className="text-xs font-medium text-foreground">{worker.rating}</span>
              <span className="text-xs text-muted-foreground">({worker.reviewCount})</span>
            </div>
            <span className="text-xs bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded-md font-medium">
              {worker.experience}y exp
            </span>
          </div>
          <div className="flex gap-2 mt-2.5">
            <a
              href={`tel:${worker.phone}`}
              className="flex-1 flex items-center justify-center gap-1.5 bg-primary text-primary-foreground rounded-xl py-2 text-xs font-semibold"
              data-testid={`btn-call-${worker.id}`}
              onClick={(e) => e.stopPropagation()}
            >
              <Phone size={12} />
              Call Now
            </a>
            <a
              href={`https://wa.me/${worker.phone.replace(/\D/g, "")}`}
              className="flex-1 flex items-center justify-center gap-1.5 bg-green-500 text-white rounded-xl py-2 text-xs font-semibold"
              data-testid={`btn-whatsapp-${worker.id}`}
              onClick={(e) => e.stopPropagation()}
            >
              <MessageCircle size={12} />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
  );
}
