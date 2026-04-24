import type {
  MonthlyStatement,
  MonthlyStatementInput
} from "@/types/statement";

/**
 * Store append-only de lançamentos mensais (ADR-019).
 *
 * - `createStatement` NUNCA sobrescreve. Se houver um lançamento ativo
 *   para `(investorId, input.month)`, o antigo é marcado com
 *   `supersededBy = new.id` e o novo entra como ativo.
 * - `voidStatement` faz soft-delete marcando `voidedAt`/`voidedBy`.
 * - Não existe update de valores. Para "editar" um lançamento, o
 *   chamador cria um novo (que substitui o antigo).
 */

let STATEMENTS: MonthlyStatement[] = [];

function genId(): string {
  return `stm_${Math.random().toString(36).slice(2, 10)}`;
}

function isActive(s: MonthlyStatement): boolean {
  return s.supersededBy === null && s.voidedAt === null;
}

export function listStatements(filter?: {
  investorId?: string;
  /** Quando true, inclui superseded e voided. Default: só ativos. */
  includeInactive?: boolean;
}): MonthlyStatement[] {
  const pool = filter?.investorId
    ? STATEMENTS.filter((s) => s.investorId === filter.investorId)
    : [...STATEMENTS];
  const filtered = filter?.includeInactive ? pool : pool.filter(isActive);
  return filtered.sort((a, b) => {
    const byMonth = a.month.localeCompare(b.month);
    if (byMonth !== 0) return byMonth;
    return b.createdAt.localeCompare(a.createdAt);
  });
}

export function getStatementById(id: string): MonthlyStatement | undefined {
  return STATEMENTS.find((s) => s.id === id);
}

function getActiveByMonth(
  investorId: string,
  month: string
): MonthlyStatement | undefined {
  return STATEMENTS.find(
    (s) => s.investorId === investorId && s.month === month && isActive(s)
  );
}

export interface StatementCreateResult {
  created: MonthlyStatement;
  superseded: MonthlyStatement | null;
}

export function createStatement(
  investorId: string,
  input: MonthlyStatementInput,
  actor: { id: string }
): StatementCreateResult {
  const now = new Date().toISOString();
  const newId = genId();

  const existing = getActiveByMonth(investorId, input.month);
  let supersededSnapshot: MonthlyStatement | null = null;
  if (existing) {
    // Marca o antigo — preserva o registro inteiro, muda só o metadata.
    const idx = STATEMENTS.findIndex((s) => s.id === existing.id);
    const updated: MonthlyStatement = {
      ...existing,
      supersededBy: newId,
      supersededAt: now
    };
    STATEMENTS[idx] = updated;
    supersededSnapshot = updated;
  }

  const created: MonthlyStatement = {
    id: newId,
    investorId,
    month: input.month,
    invested: input.invested,
    rate: input.rate,
    balance: input.balance,
    note: input.note,
    createdAt: now,
    createdBy: actor.id,
    supersededBy: null,
    supersededAt: null,
    voidedAt: null,
    voidedBy: null
  };
  STATEMENTS = [...STATEMENTS, created];
  return { created, superseded: supersededSnapshot };
}

export interface StatementVoidResult {
  before: MonthlyStatement;
  after: MonthlyStatement;
}

export function voidStatement(
  id: string,
  actor: { id: string }
): StatementVoidResult | null {
  const idx = STATEMENTS.findIndex((s) => s.id === id);
  if (idx === -1) return null;
  const before = STATEMENTS[idx];
  if (!isActive(before)) {
    // Já não é ativo — não há o que invalidar. Trata como idempotente.
    return null;
  }
  const now = new Date().toISOString();
  const after: MonthlyStatement = {
    ...before,
    voidedAt: now,
    voidedBy: actor.id
  };
  STATEMENTS[idx] = after;
  return { before, after };
}
