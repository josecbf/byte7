import { cn } from "@/utils/cn";
import type { HTMLAttributes } from "react";

type Tone = "info" | "success" | "warning" | "error";

const TONE: Record<Tone, string> = {
  info: "bg-sky-50 border-sky-200 text-sky-800",
  success: "bg-emerald-50 border-emerald-200 text-emerald-800",
  warning: "bg-amber-50 border-amber-200 text-amber-800",
  error: "bg-red-50 border-red-200 text-red-800"
};

export function Alert({
  className,
  tone = "info",
  ...props
}: HTMLAttributes<HTMLDivElement> & { tone?: Tone }) {
  return (
    <div
      className={cn(
        "rounded-md border px-4 py-3 text-sm",
        TONE[tone],
        className
      )}
      {...props}
    />
  );
}
