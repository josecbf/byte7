export interface Aporte {
  id: string;
  investorId: string; // id do cadastro (InvestorProfile)
  date: string; // ISO
  amount: number; // BRL
  usinaId: string;
  usinaName: string;
  reference: string; // ex.: "APT-2025-001"
}

export interface MonthlyEvolutionPoint {
  month: string; // "YYYY-MM"
  invested: number; // total bruto investido acumulado até o mês
  balance: number; // saldo consolidado (com rendimento)
  yieldAmount: number; // rendimento do mês
}

export interface Usina {
  id: string;
  name: string;
  city: string;
  state: string;
  capacityMwp: number;
  status: "operando" | "construcao" | "planejada";
  lat: number;
  lng: number;
  startedAt?: string; // ISO
}

export interface Contract {
  id: string;
  number: string;
  signedAt: string; // ISO
  monthlyYieldRate: number; // fração (ex.: 0.06 = 6%)
  parties: {
    investor: string;
    issuer: string;
  };
  summary: string;
  clauses: { title: string; body: string }[];
  downloadUrl: string; // rota interna de download
}

export interface DashboardSummary {
  totalInvested: number; // soma dos aportes brutos
  consolidatedBalance: number; // saldo com rendimento
  accumulatedYield: number; // consolidatedBalance - totalInvested
  monthlyYieldRate: number; // 0.06
  aportesCount: number;
  since: string; // ISO — primeiro aporte
}

/**
 * Ponto da série consumida pelo gráfico comparativo. Inclui o saldo
 * acumulado de cada benchmark no mesmo mês, todos partindo do mesmo
 * fluxo de aportes para permitir comparação direta na mesma escala.
 */
export interface ChartEvolutionPoint {
  month: string;
  invested: number;
  coopergac: number;
  cdi: number;
  ibovespa: number;
}

/**
 * Linha da tabela comparativa mensal: taxa do mês (fração) para cada
 * benchmark considerado.
 */
export interface ComparativeMonthRow {
  month: string;
  coopergac: number;
  poupanca: number;
  ipca: number;
  cdi: number;
  ibovespa: number;
}

/**
 * Rentabilidade acumulada (fração) do período para cada benchmark.
 */
export interface ComparativeAccumulated {
  coopergac: number;
  poupanca: number;
  ipca: number;
  cdi: number;
  ibovespa: number;
}
