import type {
  Aporte,
  ChartEvolutionPoint,
  ComparativeAccumulated,
  ComparativeMonthRow,
  Contract,
  DashboardSummary,
  MonthlyEvolutionPoint
} from "@/types/investor";
import type { MonthlyStatement } from "@/types/statement";
import { MOCK_USINAS } from "./usinas";
import { listAportes } from "./aportes";
import {
  accumulatedReturn,
  buildSeries,
  totalReturnRate
} from "@/utils/finance";
import { getMonthlyRate } from "./benchmarks";

/**
 * Parâmetros da demo.
 * Rendimento fixo em 6% ao mês usado como fallback quando o admin não
 * registrou um `MonthlyStatement` para o mês (ADR-007 + ADR-017).
 */
export const MONTHLY_YIELD_RATE = 0.06;

/**
 * Evolução mensal da posição Byte7.
 * - Baseline: aportes + 6% a.m. via `buildSeries`.
 * - Override: se existir um `MonthlyStatement` para `(investor, mês)`,
 *   os valores de `invested/balance` daquele mês vêm do statement
 *   (ADR-017). Meses sem statement continuam no fallback computado.
 */
export function buildMonthlyEvolution(
  aportes: Aporte[] = listAportes(),
  statements: MonthlyStatement[] = [],
  rate = MONTHLY_YIELD_RATE,
  until: Date = new Date()
): MonthlyEvolutionPoint[] {
  if (aportes.length === 0 && statements.length === 0) return [];

  // Caso especial: sem aportes, só statements (ex.: investidor cuja
  // operação começou em meses registrados manualmente).
  if (aportes.length === 0) {
    const sorted = [...statements].sort((a, b) => a.month.localeCompare(b.month));
    return sorted.map((s, i, arr) => {
      const prev = i > 0 ? arr[i - 1] : null;
      return {
        month: s.month,
        invested: s.invested,
        balance: Math.round(s.balance * 100) / 100,
        yieldAmount:
          Math.round(
            (s.balance - (prev?.balance ?? 0) - (s.invested - (prev?.invested ?? 0))) *
              100
          ) / 100
      };
    });
  }

  const baseline = buildSeries(aportes, () => rate, until);
  if (statements.length === 0) return baseline;

  const byMonth = new Map<string, MonthlyStatement>();
  for (const s of statements) byMonth.set(s.month, s);

  const adjusted: MonthlyEvolutionPoint[] = [];
  for (let i = 0; i < baseline.length; i++) {
    const p = baseline[i];
    const stm = byMonth.get(p.month);
    if (!stm) {
      adjusted.push(p);
      continue;
    }
    const prev = adjusted[i - 1];
    const prevBalance = prev?.balance ?? 0;
    const prevInvested = prev?.invested ?? 0;
    adjusted.push({
      month: p.month,
      invested: stm.invested,
      balance: Math.round(stm.balance * 100) / 100,
      yieldAmount:
        Math.round(
          (stm.balance - prevBalance - (stm.invested - prevInvested)) * 100
        ) / 100
    });
  }
  return adjusted;
}

export function buildDashboardSummary(
  aportes: Aporte[] = listAportes(),
  statements: MonthlyStatement[] = [],
  rate = MONTHLY_YIELD_RATE
): DashboardSummary {
  const evolution = buildMonthlyEvolution(aportes, statements, rate);
  const last = evolution[evolution.length - 1];
  // Quando há statement no último mês, `invested`/`balance` do KPI
  // refletem o registrado (não a soma bruta de aportes).
  const totalInvested = last
    ? last.invested
    : aportes.reduce((sum, a) => sum + a.amount, 0);
  const consolidatedBalance = last ? last.balance : 0;
  const firstAporte = [...aportes].sort((a, b) => a.date.localeCompare(b.date))[0];
  const firstMonth = evolution[0]?.month;
  return {
    totalInvested,
    consolidatedBalance,
    accumulatedYield:
      Math.round((consolidatedBalance - totalInvested) * 100) / 100,
    monthlyYieldRate: rate,
    aportesCount: aportes.length,
    since:
      firstAporte?.date ??
      (firstMonth ? `${firstMonth}-01` : new Date().toISOString().slice(0, 10))
  };
}

/**
 * Série combinada para o gráfico: Byte7 (com override por statements)
 * × CDI × Ibovespa. Benchmarks continuam sendo derivados dos aportes
 * (sem noção de statements) — a comparação é sempre "aportes reais sob
 * benchmark externo".
 */
export function buildChartEvolution(
  aportes: Aporte[] = listAportes(),
  statements: MonthlyStatement[] = [],
  until: Date = new Date()
): ChartEvolutionPoint[] {
  const byte7 = buildMonthlyEvolution(aportes, statements, MONTHLY_YIELD_RATE, until);
  const cdi =
    aportes.length > 0
      ? buildSeries(aportes, (i) => getMonthlyRate("cdi", i), until)
      : [];
  const ibov =
    aportes.length > 0
      ? buildSeries(aportes, (i) => getMonthlyRate("ibovespa", i), until)
      : [];
  return byte7.map((p, idx) => ({
    month: p.month,
    invested: p.invested,
    byte7: p.balance,
    cdi: cdi[idx]?.balance ?? 0,
    ibovespa: ibov[idx]?.balance ?? 0
  }));
}

/**
 * Tabela comparativa mensal. Para Byte7 usamos o `rate` do statement
 * quando existe; demais benchmarks sempre vêm dos mocks de mercado.
 */
export function buildComparative(
  aportes: Aporte[] = listAportes(),
  statements: MonthlyStatement[] = [],
  until: Date = new Date()
): { rows: ComparativeMonthRow[]; totals: ComparativeAccumulated } {
  const series = buildMonthlyEvolution(aportes, statements, MONTHLY_YIELD_RATE, until);
  const stmByMonth = new Map(statements.map((s) => [s.month, s.rate]));
  const rows: ComparativeMonthRow[] = series.map((p, i) => ({
    month: p.month,
    byte7: stmByMonth.get(p.month) ?? getMonthlyRate("byte7", i),
    poupanca: getMonthlyRate("poupanca", i),
    ipca: getMonthlyRate("ipca", i),
    cdi: getMonthlyRate("cdi", i),
    ibovespa: getMonthlyRate("ibovespa", i)
  }));
  const pluck = (k: keyof ComparativeMonthRow) =>
    rows.map((r) => r[k] as number);
  const totals: ComparativeAccumulated = {
    byte7: accumulatedReturn(pluck("byte7")),
    poupanca: accumulatedReturn(pluck("poupanca")),
    ipca: accumulatedReturn(pluck("ipca")),
    cdi: accumulatedReturn(pluck("cdi")),
    ibovespa: accumulatedReturn(pluck("ibovespa"))
  };
  return { rows, totals };
}

export function computeByte7ReturnRate(
  aportes: Aporte[] = listAportes(),
  statements: MonthlyStatement[] = []
): number {
  const summary = buildDashboardSummary(aportes, statements);
  return totalReturnRate(summary.totalInvested, summary.consolidatedBalance);
}

export const MOCK_CONTRACT: Contract = {
  id: "ctr_demo_001",
  number: "BYT7-2025-0001",
  signedAt: "2025-05-01",
  monthlyYieldRate: MONTHLY_YIELD_RATE,
  parties: {
    investor: "Marina Azevedo",
    issuer: "Byte7 Tokenização de Energia LTDA."
  },
  summary:
    "Contrato de participação em projeto de geração de energia solar fotovoltaica com intermediação tokenizada pela Byte7. Rendimento contratado de 6% ao mês sobre o saldo consolidado, com direito à consulta integral de aportes, usinas vinculadas e evolução mensal via portal do investidor.",
  clauses: [
    {
      title: "1. Objeto",
      body: "A Byte7 atua como intermediária na tokenização de frações de usinas solares fotovoltaicas. Este contrato formaliza a participação do INVESTIDOR nas usinas listadas na cláusula 3."
    },
    {
      title: "2. Rendimento contratado",
      body: "Fica estabelecido o rendimento mensal de 6% (seis por cento) sobre o saldo consolidado, apurado conforme regras do portal do investidor. Este valor é exibido exclusivamente para fins demonstrativos nesta versão DEMO."
    },
    {
      title: "3. Usinas vinculadas",
      body: `Compõem este contrato as usinas: ${MOCK_USINAS.filter((u) => u.status !== "planejada")
        .map((u) => `${u.name} (${u.city}/${u.state})`)
        .join(", ")}.`
    },
    {
      title: "4. Natureza demonstrativa",
      body: "Esta é uma versão DEMO da plataforma Byte7. Nenhuma movimentação financeira, aporte, saque ou transferência é realizada. Todos os valores, datas e partes envolvidas são fictícios."
    },
    {
      title: "5. Consulta e transparência",
      body: "O INVESTIDOR terá acesso, via portal, à totalidade de informações sobre seus aportes, usinas associadas, evolução mensal e contrato vigente."
    }
  ],
  downloadUrl: "/api/investor/contrato/download"
};
