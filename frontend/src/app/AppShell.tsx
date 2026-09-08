import { BookOpen, CalendarDays, Home, Library, LogIn, UploadCloud } from "lucide-react";
import { NavLink } from "react-router-dom";
import type { ReactNode } from "react";

type AppShellProps = {
  children: ReactNode;
};

const navItems = [
  { to: "/", label: "Dashboard", icon: Home },
  { to: "/login", label: "Login", icon: LogIn },
  { to: "/plans/new", label: "Create Plan", icon: CalendarDays },
  { to: "/lessons", label: "Lessons", icon: BookOpen },
  { to: "/knowledge", label: "Knowledge", icon: Library },
  { to: "/admin/books", label: "Admin Books", icon: UploadCloud }
];

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">GAKUDO</div>
        <nav>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink key={item.to} to={item.to} className="nav-link">
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>
      <main className="main-content">{children}</main>
    </div>
  );
}
