import type { ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/design-system/cn";

/** Names what is missing and offers one next step. */
export function EmptyState({ icon, title, description, action }: { icon: ReactNode; title: string; description: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center px-6 py-16 text-center">
      <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-raised text-muted-foreground" aria-hidden>
        {icon}
      </div>
      <h2 className="text-label text-foreground">{title}</h2>
      <p className="mt-1 max-w-[44ch] text-body text-muted-foreground">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

/** `bg-raised`, final layout and height, no shimmer. */
export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn("rounded-sm bg-raised", className)} />;
}

type BannerVariant = "info" | "warning" | "destructive";
const TINT: Record<BannerVariant, string> = {
  info: "bg-raised",
  warning: "bg-warning-bg",
  destructive: "bg-destructive-bg",
};

/** One sentence of fact (title), one of consequence (description), one action. */
export function Banner({ variant = "destructive", title, description, action }: { variant?: BannerVariant; title: string; description: string; action?: ReactNode }) {
  return (
    <div role={variant === "destructive" ? "alert" : "status"} className={cn("flex items-start gap-3 rounded-lg border border-border p-4 max-md:flex-col", TINT[variant])}>
      <AlertTriangle size={16} strokeWidth={1.5} aria-hidden className="mt-[3px] shrink-0 text-muted-foreground" />
      <div className="min-w-0 flex-1">
        <p className="text-label text-foreground">{title}</p>
        <p className="text-body text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  );
}
