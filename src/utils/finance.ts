import type { Aporte, MonthlyEvolutionPoint } from "@/types/investor";

/**
 * Função que devolve a taxa mensal (fração — ex.: 0.06 = 6%) para um
 * determinado índice de mês da série. Permite que o mesmo algoritmo
 * de evolução seja reaproveitado por Byte7, CDI, Ibovespa etc.
 */
export type RateFn = (monthIndex: number) => number;

function monthKey(d: Date): string {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

function addMonths(d: Date, n: number): Date {
  const r = new Date(d);
  r.setUTCMonth(r.getUTCMonth() + n);
  return r;
}

/**
 * Constrói a série mensal de evolução aplicando os aportes sob a taxa
 * fornecida em `rateFn(monthIndex)`. Convenção da demo: o rendimento
 * do mês m é aplicado sobre o saldo do mês m-1 ANTES dos aportes do
 * mês m entrarem. Os pontos retornados partem do mês do primeiro
 * aporte e terminam no mês de `until` (inclusive).
 */
export function buildSeries(
  aportes: Aporte[],
  rateFn: RateFn,
  until: Date = new Date()
): MonthlyEvolutionPoint[] {
  if (aportes.length === 0) return [];
  const sorted = [...aportes].sort((a, b) => a.date.localeCompare(b.date));
  const start = new Date(sorted[0].date + "T00:00:00Z");
  start.setUTCDate(1);
  const end = new Date(Date.UTC(until.getUTCFullYear(), until.getUTCMonth(), 1));

  const aportesByMonth = new Map<string, number>();
  for (const a of sorted) {
    const d = new Date(a.date + "T00:00:00Z");
    const key = monthKey(d);
    aportesByMonth.set(key, (aportesByMonth.get(key) ?? 0) + a.amount);
  }

  const points: MonthlyEvolutionPoint[] = [];
  let balance = 0;
  let invested = 0;
  let cursor = start;
  let i = 0;
  while (cursor <= end) {
    const key = monthKey(cursor);
    const previousBalance = balance;
    const rate = rateFn(i);
    const yieldAmount = previousBalance * rate;
    const contribution = aportesByMonth.get(key) ?? 0;
    balance = previousBalance + yieldAmount + contribution;
    invested += contribution;
    points.push({
      month: key,
      invested,
      balance: Math.round(balance * 100) / 100,
      yieldAmount: Math.round(yieldAmount * 100) / 100
    });
    cursor = addMonths(cursor, 1);
    i++;
  }
  return points;
}

/**
 * Rentabilidade acumulada (fração) para uma sequência de taxas
 * mensais. Ex.: [0.01, 0.02] → (1.01 * 1.02) - 1 = 0.0302.
 */
export function accumulatedReturn(rates: number[]): number {
  return rates.reduce((acc, r) => acc * (1 + r), 1) - 1;
}

/**
 * Rentabilidade total do investimento em fração:
 *   (saldo_atual - total_investido) / total_investido
 * Protege divisão por zero retornando 0.
 */
export function totalReturnRate(invested: number, balance: number): number {
  if (invested <= 0) return 0;
  return (balance - invested) / invested;
}
