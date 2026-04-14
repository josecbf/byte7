import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, invalid, ...props },
  ref
) {
  return (
    <input
      ref={ref}
      className={cn(
        "h-10 w-full rounded-md border bg-white px-3 text-sm text-ink-900 placeholder-ink-400",
        "focus:outline-none focus:ring-2 focus:ring-offset-0",
        invalid
          ? "border-red-400 focus:ring-red-200"
          : "border-ink-200 focus:border-brand-500 focus:ring-brand-100",
        className
      )}
      {...props}
    />
  );
});
