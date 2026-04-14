import { Card, CardBody } from "@/components/ui/Card";
import { cn } from "@/utils/cn";
import type { ComponentType, SVGProps } from "react";

export function KpiCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "default"
}: {
  label: string;
  value: string;
  hint?: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  tone?: "default" | "brand";
}) {
  return (
    <Card>
      <CardBody className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-wider text-ink-500">
            {label}
          </p>
          {Icon ? (
            <span
              className={cn(
                "inline-flex h-8 w-8 items-center justify-center rounded-md",
                tone === "brand"
                  ? "bg-brand-100 text-brand-700"
                  : "bg-ink-100 text-ink-600"
              )}
            >
              <Icon className="h-4 w-4" />
            </span>
          ) : null}
        </div>
        <p className="text-2xl font-semibold tracking-tight text-ink-900">
          {value}
        </p>
        {hint ? <p className="text-xs text-ink-500">{hint}</p> : null}
      </CardBody>
    </Card>
  );
}
