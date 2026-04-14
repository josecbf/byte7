import Link from "next/link";
import { cn } from "@/utils/cn";

/**
 * Logo provisório da Byte7. A identidade visual oficial virá depois.
 */
export function Logo({
  className,
  href = "/",
  showTag = true
}: {
  className?: string;
  href?: string;
  showTag?: boolean;
}) {
  return (
    <Link href={href} className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-brand-500 to-brand-700 text-white font-bold text-sm shadow-card">
        B7
      </span>
      <span className="flex items-baseline gap-1.5">
        <span className="text-lg font-semibold tracking-tight text-ink-900">
          Byte7
        </span>
        {showTag ? (
          <span className="rounded-md bg-ink-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-ink-500">
            Demo
          </span>
        ) : null}
      </span>
    </Link>
  );
}
