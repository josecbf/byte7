import type {
  Aporte,
  ChartEvolutionPoint,
  ComparativeAccumulated,
  ComparativeMonthRow,
  Contract,
  DashboardSummary,
  MonthlyEvolutionPoint
} from "@/types/investor";
import { MOCK_USINAS } from "./usinas";
import {
  accumulatedReturn,
  buildSeries,
  totalReturnRate
} from "@/utils/finance";
import { getMonthlyRate } from "./benchmarks";

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
  // === Marina Azevedo (inv_001) — investidora âncora ===
  {
    id: "apt_001",
    investorId: "inv_001",
    date: "2025-05-12",
    amount: 25000,
    usinaId: "usn_solar_petrolina",
    usinaName: "UFV COOPERGAC Petrolina I",
    reference: "APT-2025-001"
  },
  {
    id: "apt_002",
    investorId: "inv_001",
    date: "2025-07-03",
    amount: 15000,
    usinaId: "usn_solar_juazeiro",
    usinaName: "UFV COOPERGAC Juazeiro II",
    reference: "APT-2025-002"
  },
  {
    id: "apt_003",
    investorId: "inv_001",
    date: "2025-09-22",
    amount: 30000,
    usinaId: "usn_solar_ipora",
    usinaName: "UFV COOPERGAC Iporá",
    reference: "APT-2025-003"
  },
  {
    id: "apt_004",
    investorId: "inv_001",
    date: "2025-12-10",
    amount: 20000,
    usinaId: "usn_solar_petrolina",
    usinaName: "UFV COOPERGAC Petrolina I",
    reference: "APT-2025-004"
  },
  {
    id: "apt_005",
    investorId: "inv_001",
    date: "2026-02-05",
    amount: 40000,
    usinaId: "usn_solar_juazeiro",
    usinaName: "UFV COOPERGAC Juazeiro II",
    reference: "APT-2026-001"
  },
  // === Fernando Ribeiro (inv_002) — carteira de médio prazo ===
  {
    id: "apt_006",
    investorId: "inv_002",
    date: "2026-02-14",
    amount: 50000,
    usinaId: "usn_solar_petrolina",
    usinaName: "UFV COOPERGAC Petrolina I",
    reference: "APT-2026-F01"
  },
  {
    id: "apt_007",
    investorId: "inv_002",
    date: "2026-03-05",
    amount: 35000,
    usinaId: "usn_solar_juazeiro",
    usinaName: "UFV COOPERGAC Juazeiro II",
    reference: "APT-2026-F02"
  },
  {
    id: "apt_008",
    investorId: "inv_002",
    date: "2026-04-01",
    amount: 20000,
    usinaId: "usn_solar_ipora",
    usinaName: "UFV COOPERGAC Iporá",
    reference: "APT-2026-F03"
  }
  // === Carla Menezes (inv_003) — cadastro pendente, ainda sem aportes ===
];

/**
 * Evolução mensal da posição COOPERGAC (rendimento contratado 6% a.m.).
 * Delegamos o cálculo ao utilitário `buildSeries` que é reutilizado
 * pelas séries de benchmarks (CDI, Ibovespa, etc).
 */
export function buildMonthlyEvolution(
  aportes: Aporte[] = MOCK_APORTES,
  rate = MONTHLY_YIELD_RATE,
  until: Date = new Date()
): MonthlyEvolutionPoint[] {
  return buildSeries(aportes, () => rate, until);
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
    accumulatedYield:
      Math.round((consolidatedBalance - totalInvested) * 100) / 100,
    monthlyYieldRate: rate,
    aportesCount: aportes.length,
    since: first?.date ?? new Date().toISOString().slice(0, 10)
  };
}

/**
 * Série combinada para o gráfico: para cada mês da janela, calcula o
 * saldo de COOPERGAC, CDI e Ibovespa aplicando os MESMOS aportes sob cada
 * taxa. Assim as três curvas partem do mesmo valor inicial e são
 * diretamente comparáveis na mesma escala.
 */
export function buildChartEvolution(
  aportes: Aporte[] = MOCK_APORTES,
  until: Date = new Date()
): ChartEvolutionPoint[] {
  const coopergac = buildSeries(aportes, () => MONTHLY_YIELD_RATE, until);
  const cdi = buildSeries(aportes, (i) => getMonthlyRate("cdi", i), until);
  const ibov = buildSeries(aportes, (i) => getMonthlyRate("ibovespa", i), until);
  return coopergac.map((p, idx) => ({
    month: p.month,
    invested: p.invested,
    coopergac: p.balance,
    cdi: cdi[idx]?.balance ?? 0,
    ibovespa: ibov[idx]?.balance ?? 0
  }));
}

/**
 * Tabela comparativa mensal: para cada mês da janela, devolve a taxa
 * mensal aplicada em cada benchmark. A linha de "Acumulado (%)" é
 * entregue em `totals`, calculada via juros compostos sobre as taxas.
 */
export function buildComparative(
  aportes: Aporte[] = MOCK_APORTES,
  until: Date = new Date()
): { rows: ComparativeMonthRow[]; totals: ComparativeAccumulated } {
  const series = buildMonthlyEvolution(aportes, MONTHLY_YIELD_RATE, until);
  const rows: ComparativeMonthRow[] = series.map((p, i) => ({
    month: p.month,
    coopergac: getMonthlyRate("coopergac", i),
    poupanca: getMonthlyRate("poupanca", i),
    ipca: getMonthlyRate("ipca", i),
    cdi: getMonthlyRate("cdi", i),
    ibovespa: getMonthlyRate("ibovespa", i)
  }));
  const pluck = (k: keyof ComparativeMonthRow) =>
    rows.map((r) => r[k] as number);
  const totals: ComparativeAccumulated = {
    coopergac: accumulatedReturn(pluck("coopergac")),
    poupanca: accumulatedReturn(pluck("poupanca")),
    ipca: accumulatedReturn(pluck("ipca")),
    cdi: accumulatedReturn(pluck("cdi")),
    ibovespa: accumulatedReturn(pluck("ibovespa"))
  };
  return { rows, totals };
}

/**
 * Rentabilidade total do investidor COOPERGAC (fração). Consistente com
 * o KPI "Rentabilidade (%)" do dashboard.
 */
export function computeCoopergacReturnRate(
  aportes: Aporte[] = MOCK_APORTES,
  rate = MONTHLY_YIELD_RATE
): number {
  const summary = buildDashboardSummary(aportes, rate);
  return totalReturnRate(summary.totalInvested, summary.consolidatedBalance);
}

export const MOCK_CONTRACT: Contract = {
  id: "ctr_demo_001",
  number: "CPGC-2025-0001",
  signedAt: "2025-05-01",
  monthlyYieldRate: MONTHLY_YIELD_RATE,
  parties: {
    investor: "Marina Azevedo",
    issuer: "COOPERGAC Solar Energy LTDA."
  },
  summary:
    "Contrato de participação em projeto de geração de energia solar fotovoltaica via cooperativa COOPERGAC. Rendimento contratado de 6% ao mês sobre o saldo consolidado, com direito à consulta integral de aportes, usinas vinculadas e evolução mensal via portal do cooperado. Amparado na Lei 14.300 (Marco Legal da Geração Distribuída).",
  clauses: [
    {
      title: "1. Objeto",
      body: "A COOPERGAC atua como cooperativa de geração distribuída de frações de usinas solares fotovoltaicas. Este contrato formaliza a participação do COOPERADO nas usinas listadas na cláusula 3."
    },
    {
      title: "2. Rendimento contratado",
      body: "Fica estabelecido o rendimento mensal de 6% (seis por cento) sobre o saldo consolidado, apurado conforme regras do portal do cooperado. Este valor é exibido exclusivamente para fins demonstrativos nesta versão DEMO."
    },
    {
      title: "3. Usinas vinculadas",
      body: `Compõem este contrato as usinas: ${MOCK_USINAS.filter((u) => u.status !== "planejada")
        .map((u) => `${u.name} (${u.city}/${u.state})`)
        .join(", ")}.`
    },
    {
      title: "4. Natureza demonstrativa",
      body: "Esta é uma versão DEMO da plataforma COOPERGAC. Nenhuma movimentação financeira, aporte, saque ou transferência é realizada. Todos os valores, datas e partes envolvidas são fictícios."
    },
    {
      title: "5. Consulta e transparência",
      body: "O COOPERADO terá acesso, via portal, à totalidade de informações sobre seus aportes, usinas associadas, evolução mensal e contrato vigente."
    },
    {
      title: "6. Marco regulatório",
      body: "Este contrato observa as disposições da Lei nº 14.300/2022 (Marco Legal da Geração Distribuída) e demais normas aplicáveis ao setor de energia elétrica brasileiro."
    }
  ],
  downloadUrl: "/api/investor/contrato/download"
};
