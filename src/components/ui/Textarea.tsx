import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ className, invalid, ...props }, ref) {
    return (
      <textarea
        ref={ref}
        className={cn(
          "min-h-[120px] w-full rounded-md border bg-white px-3 py-2 text-sm text-ink-900 placeholder-ink-400",
          "focus:outline-none focus:ring-2",
          invalid
            ? "border-red-400 focus:ring-red-200"
            : "border-ink-200 focus:border-brand-500 focus:ring-brand-100",
          className
        )}
        {...props}
      />
    );
  }
);
