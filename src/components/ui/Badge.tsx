import { cn } from "@/utils/cn";
import type { HTMLAttributes } from "react";

type Tone = "neutral" | "success" | "warning" | "info" | "brand";

const TONE: Record<Tone, string> = {
  neutral: "bg-ink-100 text-ink-700",
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
  info: "bg-sky-100 text-sky-700",
  brand: "bg-brand-100 text-brand-700"
};

export function Badge({
  className,
  tone = "neutral",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        TONE[tone],
        className
      )}
      {...props}
    />
  );
}
