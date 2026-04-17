import type {
  ComparativeAccumulated,
  ComparativeMonthRow
} from "@/types/investor";
import { formatMonth, formatPct } from "@/lib/format";
import { BENCHMARK_COLORS } from "@/mocks/benchmarks";
import { cn } from "@/utils/cn";

/**
 * Tabela comparativa mensal: rendimento (%) mês a mês por benchmark,
 * com linha final de rentabilidade acumulada (juros compostos).
 * Puramente apresentacional — os dados vêm pré-calculados do server.
 */
export function ComparativeTable({
  rows,
  totals
}: {
  rows: ComparativeMonthRow[];
  totals: ComparativeAccumulated;
}) {
  const cols = [
    { key: "coopergac", label: "COOPERGAC", color: BENCHMARK_COLORS.coopergac },
    { key: "poupanca", label: "Poupança", color: BENCHMARK_COLORS.poupanca },
    { key: "ipca", label: "IPCA", color: BENCHMARK_COLORS.ipca },
    { key: "cdi", label: "CDI", color: BENCHMARK_COLORS.cdi },
    { key: "ibovespa", label: "Ibovespa", color: BENCHMARK_COLORS.ibovespa }
  ] as const;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wider text-ink-500 border-b border-ink-200">
            <th className="py-2 pr-4 font-medium">Mês</th>
            {cols.map((c) => (
              <th key={c.key} className="py-2 pr-4 font-medium text-right">
                <span className="inline-flex items-center gap-2">
                  <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{ background: c.color }}
                  />
                  {c.label}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr
              key={r.month}
              className="border-b last:border-b-0 border-ink-100 hover:bg-ink-50/60"
            >
              <td className="py-2.5 pr-4 font-medium text-ink-800">
                {formatMonth(r.month)}
              </td>
              {cols.map((c) => {
                const v = r[c.key];
                return (
                  <td
                    key={c.key}
                    className={cn(
                      "py-2.5 pr-4 text-right tabular-nums",
                      v >= 0 ? "text-ink-800" : "text-red-600"
                    )}
                  >
                    {formatPct(v)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-ink-200 bg-ink-50/60">
            <th className="py-3 pr-4 text-left text-xs uppercase tracking-wider text-ink-600">
              Acumulado (%)
            </th>
            {cols.map((c) => {
              const v = totals[c.key];
              return (
                <td
                  key={c.key}
                  className={cn(
                    "py-3 pr-4 text-right font-semibold tabular-nums",
                    v >= 0 ? "text-ink-900" : "text-red-700"
                  )}
                >
                  {formatPct(v)}
                </td>
              );
            })}
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
