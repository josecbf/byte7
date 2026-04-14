import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

export const Select = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement>
>(function Select({ className, children, ...props }, ref) {
  return (
    <select
      ref={ref}
      className={cn(
        "h-10 w-full rounded-md border border-ink-200 bg-white px-3 text-sm text-ink-900",
        "focus:outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-500",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
});
