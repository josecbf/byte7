"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import type { MonthlyEvolutionPoint } from "@/types/investor";
import { formatBRL, formatMonth } from "@/lib/format";

export function EvolutionChart({ data }: { data: MonthlyEvolutionPoint[] }) {
  const formatted = data.map((p) => ({
    ...p,
    monthLabel: formatMonth(p.month)
  }));
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={formatted} margin={{ top: 10, right: 16, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
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
              name === "balance"
                ? "Saldo consolidado"
                : name === "invested"
                ? "Total investido"
                : "Rendimento do mês"
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
            formatter={(value) =>
              value === "balance"
                ? "Saldo consolidado"
                : value === "invested"
                ? "Total investido"
                : value
            }
          />
          <Area
            type="monotone"
            dataKey="balance"
            stroke="#059669"
            strokeWidth={2}
            fill="url(#balanceGradient)"
          />
          <Line
            type="monotone"
            dataKey="invested"
            stroke="#0f172a"
            strokeWidth={2}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
