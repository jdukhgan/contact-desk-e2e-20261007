import { forwardRef, useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/design-system/cn";

const control =
  "w-full rounded-md border border-border-strong bg-card text-body text-foreground " +
  "transition-colors hover-capable:hover:border-border-heavy disabled:opacity-60 " +
  "aria-[invalid=true]:border-destructive/60 max-md:h-11";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input(
  { className, ...props },
  ref,
) {
  return <input ref={ref} className={cn(control, "h-9 px-2.5", className)} {...props} />;
});

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(function Textarea(
  { className, ...props },
  ref,
) {
  return <textarea ref={ref} className={cn(control, "min-h-24 px-2.5 py-2 max-md:h-auto", className)} {...props} />;
});

/** Native select (keyboard, type-ahead and phone pickers for free) in the JLab control style. */
export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(function Select(
  { className, children, ...props },
  ref,
) {
  return (
    <div className="relative">
      <select ref={ref} className={cn(control, "h-9 appearance-none pl-2.5 pr-8", className)} {...props}>
        {children}
      </select>
      <ChevronDown
        size={16}
        strokeWidth={1.5}
        aria-hidden
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-subtle-foreground"
      />
    </div>
  );
});

interface FieldProps {
  label: string;
  required?: boolean;
  /** Message saying what is wrong and how to fix it. */
  error?: string;
  hint?: string;
  children: (a: { id: string; "aria-invalid": boolean; "aria-describedby"?: string; "aria-required"?: boolean }) => ReactNode;
}

/** Label, control and inline error wired together with ids. */
export function Field({ label, required, error, hint, children }: FieldProps) {
  const id = useId();
  const msgId = `${id}-msg`;
  const described = error || hint ? msgId : undefined;
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="mb-1.5 block text-meta font-medium text-muted-foreground">
        {label}
        {required && <span className="ml-1 text-subtle-foreground">(required)</span>}
      </label>
      {children({ id, "aria-invalid": Boolean(error), "aria-describedby": described, "aria-required": required })}
      {(error || hint) && (
        <p id={msgId} role={error ? "alert" : undefined} className={cn("mt-1.5 text-meta", error ? "text-destructive-foreground" : "text-subtle-foreground")}>
          {error ?? hint}
        </p>
      )}
    </div>
  );
}
