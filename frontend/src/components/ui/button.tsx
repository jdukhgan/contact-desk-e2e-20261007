import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Loader } from "lucide-react";
import { cn } from "@/design-system/cn";

type Variant = "default" | "secondary" | "ghost" | "destructive" | "link";
type Size = "default" | "sm" | "icon" | "icon-sm";

const variants: Record<Variant, string> = {
  default: "bg-primary text-primary-foreground border-primary",
  secondary: "bg-raised text-foreground border-border-strong",
  ghost: "bg-transparent text-muted-foreground border-transparent hover-capable:hover:bg-hover hover-capable:hover:text-foreground",
  destructive: "bg-destructive-bg text-destructive-foreground border-destructive/35",
  link: "bg-transparent text-foreground border-transparent underline underline-offset-[3px] px-0",
};

// 32 default, 28 small; phones get 44 px tap targets.
const sizes: Record<Size, string> = {
  default: "h-8 px-[11px] max-md:h-11 max-md:px-4",
  sm: "h-7 px-[9px] text-meta rounded-sm max-md:h-11 max-md:px-4 max-md:text-body",
  icon: "size-8 p-0 max-md:size-11",
  "icon-sm": "size-7 p-0 rounded-sm max-md:size-11",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  /** Working state: keeps the width, shows a spinner and disables the button. Swap the label to a verb ("Saving"). */
  working?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "secondary", size = "default", working, className, children, disabled, type = "button", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || working}
      aria-busy={working || undefined}
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-[7px] whitespace-nowrap rounded-md border text-label font-medium",
        "transition-transform duration-150 ease-[var(--ease-out)] active:scale-[0.97]",
        "disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {working && <Loader size={14} strokeWidth={1.5} className="animate-turn" aria-hidden />}
      {children}
    </button>
  );
});
