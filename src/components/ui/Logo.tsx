import Link from "next/link";
import { cn } from "@/utils/cn";

/**
 * Logo oficial COOPERGAC — sol estilizado + wordmark.
 * Inspirado na identidade visual da apresentação institucional:
 * verde profundo (folhagem) + amarelo dourado (sol).
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
      <SunMark />
      <span className="flex flex-col leading-none">
        <span className="text-base font-bold tracking-tight text-brand-800">
          COOPERGAC
        </span>
        <span className="flex items-center gap-1.5">
          <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-brand-700/80">
            Solar Energy
          </span>
          {showTag ? (
            <span className="rounded bg-accent-100 px-1 py-0.5 text-[8px] font-bold uppercase tracking-wider text-accent-800">
              Demo
            </span>
          ) : null}
        </span>
      </span>
    </Link>
  );
}

/**
 * Sol estilizado da COOPERGAC. Núcleo dourado com 8 raios.
 */
export function SunMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative inline-flex h-9 w-9 items-center justify-center",
        className
      )}
      aria-hidden
    >
      <svg
        viewBox="0 0 40 40"
        className="h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g fill="#f5b800">
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * 360) / 8;
            return (
              <rect
                key={i}
                x="18.5"
                y="1"
                width="3"
                height="9"
                rx="1.2"
                transform={`rotate(${angle} 20 20)`}
              />
            );
          })}
        </g>
        <circle cx="20" cy="20" r="7" fill="#f5b800" />
        <circle cx="20" cy="20" r="4.2" fill="#fff8e1" opacity="0.55" />
      </svg>
    </span>
  );
}
