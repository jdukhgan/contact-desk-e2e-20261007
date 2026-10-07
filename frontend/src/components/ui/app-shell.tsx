import type { ReactNode } from "react";
import { BookUser, Moon, Plus, Sun, Users } from "lucide-react";
import { cn } from "@/design-system/cn";
import { useTheme } from "@/design-system/theme";

interface AppShellProps {
  contactCount?: number;
  onHome: () => void;
  onNew: () => void;
  children: ReactNode;
}

function ThemeButton({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const next = theme === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${next} theme`}
      className={cn("flex items-center gap-2.5 rounded-md text-body text-muted-foreground hover-capable:hover:bg-hover hover-capable:hover:text-foreground", className)}
    >
      {theme === "dark" ? <Sun size={16} strokeWidth={1.5} aria-hidden /> : <Moon size={16} strokeWidth={1.5} aria-hidden />}
      <span className="hidden lg:inline max-md:inline">{theme === "dark" ? "Light theme" : "Dark theme"}</span>
    </button>
  );
}

/**
 * Sidebar on `bg` (228 px open from 1024, 52 px rail 768 to 1023), one inset content panel,
 * floating bottom bar below 768 px.
 */
export function AppShell({ contactCount, onHome, onNew, children }: AppShellProps) {
  return (
    <div className="flex h-full bg-background">
      <aside aria-label="Navigation" className="hidden shrink-0 flex-col py-3 md:flex md:w-[52px] md:items-center lg:w-[228px] lg:items-stretch lg:px-3">
        <div className="mb-3 flex h-8 items-center gap-2.5 px-2 text-label text-foreground">
          <BookUser size={18} strokeWidth={1.5} aria-hidden />
          <span className="max-lg:hidden">Contact Desk</span>
        </div>
        <nav aria-label="Primary">
          <button
            type="button"
            onClick={onHome}
            aria-current="page"
            aria-label="Contacts"
            className="flex h-8 w-full items-center gap-2.5 rounded-md bg-hover px-2 text-body text-foreground max-lg:size-8 max-lg:justify-center max-lg:px-0"
          >
            <Users size={16} strokeWidth={1.5} aria-hidden />
            <span className="max-lg:hidden">Contacts</span>
            {contactCount !== undefined && <span className="ml-auto font-mono text-data-sm text-subtle-foreground max-lg:hidden">{contactCount}</span>}
          </button>
        </nav>
        <div className="mt-auto">
          <ThemeButton className="h-8 w-full px-2 max-lg:size-8 max-lg:justify-center max-lg:px-0" />
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col md:py-2 md:pr-2">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-card md:rounded-xl md:border md:border-border">{children}</div>
      </main>

      <nav
        aria-label="Primary"
        className="fixed bottom-3 left-1/2 z-40 flex h-[58px] w-[calc(100%-32px)] max-w-[358px] -translate-x-1/2 items-center justify-around rounded-[18px] bg-raised px-2 shadow-pop md:hidden"
      >
        <button type="button" onClick={onHome} aria-label="Contacts" className="flex h-11 min-w-16 flex-col items-center justify-center rounded-lg text-foreground">
          <Users size={18} strokeWidth={1.5} aria-hidden />
          <span className="text-meta">Contacts</span>
        </button>
        <button type="button" onClick={onNew} aria-label="New contact" className="flex h-11 min-w-16 flex-col items-center justify-center rounded-lg text-muted-foreground">
          <Plus size={18} strokeWidth={1.5} aria-hidden />
          <span className="text-meta">New</span>
        </button>
        <ThemeButton className="h-11 min-w-16 flex-col justify-center gap-0 [&>span]:inline [&>span]:text-meta" />
      </nav>
    </div>
  );
}

/** 52 px header: title or breadcrumb left; controls and the one primary action right. */
export function PageHeader({ left, right }: { left: ReactNode; right?: ReactNode }) {
  return (
    <header className="flex h-[52px] max-md:h-14 shrink-0 items-center justify-between gap-3 border-b border-border px-5 max-md:px-4">
      <div className="min-w-0 flex-1">{left}</div>
      {right && <div className="flex shrink-0 items-center gap-2">{right}</div>}
    </header>
  );
}
