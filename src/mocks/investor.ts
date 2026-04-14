import type {
  Aporte,
  Contract,
  DashboardSummary,
  MonthlyEvolutionPoint
} from "@/types/investor";
import { MOCK_USINAS } from "./usinas";

/**
 * Parâmetros da demo.
 * Rendimento fixo em 6% ao mês (conforme briefing).
 */
export const MONTHLY_YIELD_RATE = 0.06;

/**
 * Aportes do investidor de demonstração. Eles definem o "total bruto
 * investido" e a data-base de cada tranche — a evolução mensal é
 * derivada matematicamente a partir daqui.
 */
export const MOCK_APORTES: Aporte[] = [
  {
    id: "apt_001",
    date: "2025-05-12",
    amount: 25000,
    usinaId: "usn_solar_petrolina",
    usinaName: "UFV Byte7 Petrolina I",
    reference: "APT-2025-001"
  },
  {
    id: "apt_002",
    date: "2025-07-03",
    amount: 15000,
    usinaId: "usn_solar_juazeiro",
    usinaName: "UFV Byte7 Juazeiro II",
    reference: "APT-2025-002"
  },
  {
    id: "apt_003",
    date: "2025-09-22",
    amount: 30000,
    usinaId: "usn_solar_ipora",
    usinaName: "UFV Byte7 Iporá",
    reference: "APT-2025-003"
  },
  {
    id: "apt_004",
    date: "2025-12-10",
    amount: 20000,
    usinaId: "usn_solar_petrolina",
    usinaName: "UFV Byte7 Petrolina I",
    reference: "APT-2025-004"
  },
  {
    id: "apt_005",
    date: "2026-02-05",
    amount: 40000,
    usinaId: "usn_solar_juazeiro",
    usinaName: "UFV Byte7 Juazeiro II",
    reference: "APT-2026-001"
  }
];

function monthKey(d: Date): string {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

function addMonths(d: Date, n: number): Date {
  const r = new Date(d);
  r.setUTCMonth(r.getUTCMonth() + n);
  return r;
}

/**
 * Gera a série mensal de evolução acumulada aplicando 6% a.m.
 * a partir do primeiro aporte até o mês atual. O saldo de cada mês é:
 *   saldo_m = saldo_{m-1} * (1 + rate) + aportes_do_mes
 */
export function buildMonthlyEvolution(
  aportes: Aporte[] = MOCK_APORTES,
  rate = MONTHLY_YIELD_RATE,
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
  while (cursor <= end) {
    const key = monthKey(cursor);
    const previousBalance = balance;
    // rendimento sobre o saldo anterior
    const yieldAmount = previousBalance * rate;
    // aportes do mês entram após rendimento (convenção da demo)
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
  }
  return points;
}

export function buildDashboardSummary(
  aportes: Aporte[] = MOCK_APORTES,
  rate = MONTHLY_YIELD_RATE
): DashboardSummary {
  const evolution = buildMonthlyEvolution(aportes, rate);
  const last = evolution[evolution.length - 1];
  const totalInvested = aportes.reduce((sum, a) => sum + a.amount, 0);
  const consolidatedBalance = last ? last.balance : 0;
  const first = [...aportes].sort((a, b) => a.date.localeCompare(b.date))[0];
  return {
    totalInvested,
    consolidatedBalance,
    accumulatedYield: Math.round((consolidatedBalance - totalInvested) * 100) / 100,
    monthlyYieldRate: rate,
    aportesCount: aportes.length,
    since: first?.date ?? new Date().toISOString().slice(0, 10)
  };
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
