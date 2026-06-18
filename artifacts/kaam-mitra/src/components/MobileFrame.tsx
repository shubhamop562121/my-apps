import { ReactNode } from "react";

export default function MobileFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-200 flex items-start justify-center">
      <div
        className="relative w-full max-w-[430px] min-h-screen bg-background shadow-2xl overflow-hidden"
        style={{ minHeight: "100svh" }}
      >
        {children}
      </div>
    </div>
  );
}
