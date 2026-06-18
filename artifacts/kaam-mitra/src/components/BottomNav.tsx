import { useLocation, Link } from "wouter";
import { Home, Search, ClipboardList, Bell, User } from "lucide-react";

const tabs = [
  { label: "Home", icon: Home, href: "/home" },
  { label: "Search", icon: Search, href: "/search" },
  { label: "Requests", icon: ClipboardList, href: "/requests" },
  { label: "Alerts", icon: Bell, href: "/notifications" },
  { label: "Profile", icon: User, href: "/profile" },
];

export default function BottomNav() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-border z-50">
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map(({ label, icon: Icon, href }) => {
          const active = location === href || location.startsWith(href + "/");
          return (
            <Link key={href} href={href} data-testid={`nav-${label.toLowerCase()}`}>
              <div className="flex flex-col items-center gap-0.5 py-1 px-3 cursor-pointer">
                <Icon
                  size={22}
                  className={active ? "text-primary" : "text-muted-foreground"}
                  strokeWidth={active ? 2.5 : 1.8}
                />
                <span
                  className={`text-[10px] font-medium ${active ? "text-primary" : "text-muted-foreground"}`}
                >
                  {label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
