import { cn } from "@/design-system/cn";

export type StatusKind = "running" | "degraded" | "down" | "stopped" | "working" | "new";

const DOT: Record<StatusKind, string> = {
  running: "bg-success",
  degraded: "bg-warning",
  down: "bg-destructive",
  new: "bg-info",
  stopped: "border-[1.5px] border-stopped bg-transparent",
  working: "border-[1.5px] border-dashed border-info bg-transparent",
};

/** Status is always a dot plus a word; the word stays quiet so only the dot carries colour. */
export function Status({ kind, children, className }: { kind: StatusKind; children: string; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-body text-muted-foreground", className)}>
      <span aria-hidden className={cn("size-[7px] shrink-0 rounded-full box-border", DOT[kind])} />
      {children}
    </span>
  );
}
