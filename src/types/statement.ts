/**
 * Lançamento mensal consolidado por investidor, registrado pelo admin.
 *
 * Append-only (ADR-019): nenhum registro é sobrescrito. Correções
 * criam um novo registro que aponta `supersededBy` do antigo para o
 * novo. Exclusões são soft (marcam `voidedAt`/`voidedBy`). Dashboard
 * do investidor considera apenas entradas ativas
 * (`supersededBy === null && voidedAt === null`).
 */
export interface MonthlyStatement {
  id: string;
  investorId: string; // InvestorProfile.id
  month: string; // "YYYY-MM"
  invested: number; // total investido acumulado até o fim do mês (BRL)
  rate: number; // taxa mensal (fração — ex.: 0.06 = 6%)
  balance: number; // saldo consolidado ao fim do mês (BRL)
  note?: string; // observação livre
  createdAt: string; // ISO
  createdBy: string; // userId do admin
  // Append-only metadata
  supersededBy: string | null;
  supersededAt: string | null;
  voidedAt: string | null;
  voidedBy: string | null;
}

export interface MonthlyStatementInput {
  month: string;
  invested: number;
  rate: number;
  balance: number;
  note?: string;
}
