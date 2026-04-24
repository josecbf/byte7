import type { Aporte } from "@/types/investor";

/**
 * Store append-only de aportes (ADR-019). Correções nunca apagam um
 * registro antigo: `createAporte` aceita um `supersedes: id` opcional
 * que marca o antigo com `supersededBy = new.id`. `voidAporte` faz
 * soft-delete via `voidedAt`/`voidedBy`. Não existe update.
 */

export interface AporteInput {
  investorId: string;
  date: string; // ISO YYYY-MM-DD
  amount: number;
  usinaId: string;
  usinaName: string;
  reference?: string;
  /** Id de um aporte existente a ser marcado como substituído. */
  supersedes?: string;
}

function seed(
  id: string,
  investorId: string,
  date: string,
  amount: number,
  usinaId: string,
  usinaName: string,
  reference: string
): Aporte {
  return {
    id,
    investorId,
    date,
    amount,
    usinaId,
    usinaName,
    reference,
    supersededBy: null,
    supersededAt: null,
    voidedAt: null,
    voidedBy: null
  };
}

const SEED_APORTES: Aporte[] = [
  // === Marina Azevedo (inv_001) — investidora âncora ===
  seed("apt_001", "inv_001", "2025-05-12", 25000, "usn_solar_petrolina", "UFV Byte7 Petrolina I", "APT-2025-001"),
  seed("apt_002", "inv_001", "2025-07-03", 15000, "usn_solar_juazeiro", "UFV Byte7 Juazeiro II", "APT-2025-002"),
  seed("apt_003", "inv_001", "2025-09-22", 30000, "usn_solar_ipora", "UFV Byte7 Iporá", "APT-2025-003"),
  seed("apt_004", "inv_001", "2025-12-10", 20000, "usn_solar_petrolina", "UFV Byte7 Petrolina I", "APT-2025-004"),
  seed("apt_005", "inv_001", "2026-02-05", 40000, "usn_solar_juazeiro", "UFV Byte7 Juazeiro II", "APT-2026-001"),
  // === Fernando Ribeiro (inv_002) — carteira de médio prazo ===
  seed("apt_006", "inv_002", "2026-02-14", 50000, "usn_solar_petrolina", "UFV Byte7 Petrolina I", "APT-2026-F01"),
  seed("apt_007", "inv_002", "2026-03-05", 35000, "usn_solar_juazeiro", "UFV Byte7 Juazeiro II", "APT-2026-F02"),
  seed("apt_008", "inv_002", "2026-04-01", 20000, "usn_solar_ipora", "UFV Byte7 Iporá", "APT-2026-F03")
  // === Carla Menezes (inv_003) — cadastro pendente, ainda sem aportes ===
];

let APORTES: Aporte[] = [...SEED_APORTES];

function genId(): string {
  return `apt_${Math.random().toString(36).slice(2, 10)}`;
}

function genReference(date: string): string {
  const year = date.slice(0, 4);
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `APT-${year}-${suffix}`;
}

function isActive(a: Aporte): boolean {
  return a.supersededBy === null && a.voidedAt === null;
}

export function listAportes(filter?: {
  investorId?: string;
  /** Quando true, inclui superseded e voided. Default: só ativos. */
  includeInactive?: boolean;
}): Aporte[] {
  const pool = filter?.investorId
    ? APORTES.filter((a) => a.investorId === filter.investorId)
    : [...APORTES];
  const filtered = filter?.includeInactive ? pool : pool.filter(isActive);
  return filtered.sort((a, b) => {
    const byDate = a.date.localeCompare(b.date);
    if (byDate !== 0) return byDate;
    return b.id.localeCompare(a.id);
  });
}

export function getAporteById(id: string): Aporte | undefined {
  return APORTES.find((a) => a.id === id);
}

export interface AporteCreateResult {
  created: Aporte;
  superseded: Aporte | null;
}

export function createAporte(input: AporteInput): AporteCreateResult {
  const now = new Date().toISOString();
  const newId = genId();

  let supersededSnapshot: Aporte | null = null;
  if (input.supersedes) {
    const idx = APORTES.findIndex((a) => a.id === input.supersedes);
    if (idx === -1) {
      throw new Error("Aporte a substituir não encontrado.");
    }
    const prev = APORTES[idx];
    if (prev.investorId !== input.investorId) {
      throw new Error(
        "Aporte a substituir pertence a outro investidor."
      );
    }
    if (!isActive(prev)) {
      throw new Error(
        "Aporte a substituir já não está ativo (foi substituído ou invalidado)."
      );
    }
    const updated: Aporte = {
      ...prev,
      supersededBy: newId,
      supersededAt: now
    };
    APORTES[idx] = updated;
    supersededSnapshot = updated;
  }

  const created: Aporte = {
    id: newId,
    investorId: input.investorId,
    date: input.date,
    amount: input.amount,
    usinaId: input.usinaId,
    usinaName: input.usinaName,
    reference: input.reference || genReference(input.date),
    supersededBy: null,
    supersededAt: null,
    voidedAt: null,
    voidedBy: null
  };
  APORTES = [...APORTES, created];
  return { created, superseded: supersededSnapshot };
}

export interface AporteVoidResult {
  before: Aporte;
  after: Aporte;
}

export function voidAporte(
  id: string,
  actor: { id: string }
): AporteVoidResult | null {
  const idx = APORTES.findIndex((a) => a.id === id);
  if (idx === -1) return null;
  const before = APORTES[idx];
  if (!isActive(before)) return null;
  const now = new Date().toISOString();
  const after: Aporte = {
    ...before,
    voidedAt: now,
    voidedBy: actor.id
  };
  APORTES[idx] = after;
  return { before, after };
}
