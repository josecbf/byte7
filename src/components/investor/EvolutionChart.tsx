"use client";

import {
  Area,
  ComposedChart,
  CartesianGrid,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import type { ChartEvolutionPoint } from "@/types/investor";
import { formatBRL, formatMonth } from "@/lib/format";
import { BENCHMARK_COLORS } from "@/mocks/benchmarks";

const LABELS: Record<string, string> = {
  coopergac: "COOPERGAC",
  cdi: "CDI",
  ibovespa: "Ibovespa",
  invested: "Total investido"
};

export function EvolutionChart({ data }: { data: ChartEvolutionPoint[] }) {
  const formatted = data.map((p) => ({ ...p, monthLabel: formatMonth(p.month) }));
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={formatted}
          margin={{ top: 10, right: 16, bottom: 0, left: 0 }}
        >
          <defs>
            <linearGradient id="coopergacGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={BENCHMARK_COLORS.coopergac} stopOpacity={0.35} />
              <stop offset="100%" stopColor={BENCHMARK_COLORS.coopergac} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="monthLabel"
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) =>
              v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)
            }
          />
          <Tooltip
            formatter={(value: number, name: string) => [
              formatBRL(value),
              LABELS[name] ?? name
            ]}
            labelFormatter={(label) => `Mês ${label}`}
            contentStyle={{
              borderRadius: 8,
              border: "1px solid #e2e8f0",
              fontSize: 12
            }}
          />
          <Legend
            verticalAlign="top"
            height={28}
            iconSize={10}
            formatter={(value) => LABELS[value as string] ?? value}
          />
          <Area
            type="monotone"
            dataKey="coopergac"
            stroke={BENCHMARK_COLORS.coopergac}
            strokeWidth={2}
            fill="url(#coopergacGradient)"
          />
          <Line
            type="monotone"
            dataKey="cdi"
            stroke={BENCHMARK_COLORS.cdi}
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="ibovespa"
            stroke={BENCHMARK_COLORS.ibovespa}
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="invested"
            stroke="#0f172a"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
