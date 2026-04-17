/**
 * Taxas mensais mockadas dos benchmarks usados no dashboard.
 * Todos os valores são frações (0.06 = 6%). Realistas, mas fixados
 * para a demo — em produção viriam de uma API de mercado.
 */

export type BenchmarkKey = "coopergac" | "cdi" | "poupanca" | "ipca" | "ibovespa";

/**
 * Taxas mensais constantes. Escolhidas como aproximações razoáveis:
 *   - coopergac: parâmetro fixo da demo (ver mocks/investor.ts)
 *   - cdi:       ~12.7% ao ano
 *   - poupanca:  ~7.4%  ao ano (abaixo do CDI, como na realidade recente)
 *   - ipca:      ~5.0%  ao ano (inflação média)
 */
export const FIXED_MONTHLY_RATES: Record<
  Exclude<BenchmarkKey, "ibovespa">,
  number
> = {
  coopergac: 0.06,
  cdi: 0.01,
  poupanca: 0.006,
  ipca: 0.004
};

/**
 * Série mensal mockada do Ibovespa. Volátil (positivo e negativo),
 * amplitude realista entre ~-4% e ~+5%. Se o período for mais longo
 * que o array, ciclamos o vetor (via módulo em getMonthlyRate).
 */
export const IBOV_MONTHLY_RATES: number[] = [
  0.032, -0.018, 0.045, 0.012, -0.026, 0.038,
  -0.008, 0.051, -0.034, 0.022, 0.015, -0.041,
  0.029, 0.047, -0.019, 0.024, -0.012, 0.036
];

export function getMonthlyRate(key: BenchmarkKey, monthIndex: number): number {
  if (key === "ibovespa") {
    return IBOV_MONTHLY_RATES[monthIndex % IBOV_MONTHLY_RATES.length];
  }
  return FIXED_MONTHLY_RATES[key];
}

export const BENCHMARK_LABELS: Record<BenchmarkKey, string> = {
  coopergac: "COOPERGAC",
  cdi: "CDI",
  poupanca: "Poupança",
  ipca: "IPCA",
  ibovespa: "Ibovespa"
};

/**
 * Cores por benchmark. Usadas pelo gráfico e pela legenda.
 * Mantidas em um único lugar para consistência. Linha COOPERGAC em
 * verde profundo da identidade institucional.
 */
export const BENCHMARK_COLORS: Record<BenchmarkKey, string> = {
  coopergac: "#0e4d2c", // brand-700 (verde COOPERGAC)
  cdi: "#2563eb",       // blue-600
  poupanca: "#0891b2",  // cyan-600
  ipca: "#9333ea",      // purple-600
  ibovespa: "#d97706"   // amber-600
};
