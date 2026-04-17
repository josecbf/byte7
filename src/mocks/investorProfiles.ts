import type {
  InvestorProfile,
  InvestorProfileInput,
  InvestorProfileStatus
} from "@/types/investorProfile";

/**
 * Store em memória dos cadastros de investidores (gestão pelo admin).
 *
 * Padrão idêntico ao `mocks/posts.ts`: a interface pública
 * (`listInvestors`, `getInvestorById`, `createInvestor`,
 * `updateInvestor`, `deleteInvestor`) é estável — migrar para um banco
 * real significa apenas reimplementar o corpo desses métodos.
 */

const SEED: InvestorProfile[] = [
  {
    id: "inv_001",
    fullName: "Marina Azevedo",
    email: "investidor@coopergac.com.br",
    document: "123.456.789-00",
    phone: "+55 81 99876-5432",
    city: "Recife",
    state: "PE",
    status: "ativo",
    notes:
      "Investidora âncora da carteira demonstrativa. Vinculada às usinas de Petrolina, Juazeiro e Iporá.",
    createdAt: "2025-05-01T12:00:00Z",
    updatedAt: "2026-02-05T12:00:00Z"
  },
  {
    id: "inv_002",
    fullName: "Fernando Ribeiro",
    email: "fernando.ribeiro@example.com",
    document: "987.654.321-00",
    phone: "+55 11 97654-3210",
    city: "São Paulo",
    state: "SP",
    status: "ativo",
    notes:
      "Cadastro corporativo com foco em alocação de médio prazo no portfólio solar.",
    createdAt: "2026-01-20T09:30:00Z",
    updatedAt: "2026-03-18T15:00:00Z"
  },
  {
    id: "inv_003",
    fullName: "Carla Menezes",
    email: "carla.menezes@example.com",
    document: "11.222.333/0001-44",
    phone: "+55 71 98888-7777",
    city: "Salvador",
    state: "BA",
    status: "pendente",
    notes:
      "Cadastro em validação. Aguardando confirmação documental para liberação de acesso ao portal.",
    createdAt: "2026-03-30T10:10:00Z",
    updatedAt: "2026-04-02T11:45:00Z"
  }
];

let INVESTORS: InvestorProfile[] = [...SEED];

export function listInvestors(filter?: {
  status?: InvestorProfileStatus;
}): InvestorProfile[] {
  const base = [...INVESTORS].sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt)
  );
  if (!filter?.status) return base;
  return base.filter((i) => i.status === filter.status);
}

export function getInvestorById(id: string): InvestorProfile | undefined {
  return INVESTORS.find((i) => i.id === id);
}

function emailExists(email: string, ignoreId?: string): boolean {
  return INVESTORS.some(
    (i) => i.email.toLowerCase() === email.toLowerCase() && i.id !== ignoreId
  );
}

export function createInvestor(input: InvestorProfileInput): InvestorProfile {
  if (emailExists(input.email)) {
    throw new Error("Já existe um cadastro com este e-mail.");
  }
  const now = new Date().toISOString();
  const id = `inv_${Math.random().toString(36).slice(2, 10)}`;
  const profile: InvestorProfile = {
    id,
    ...input,
    createdAt: now,
    updatedAt: now
  };
  INVESTORS = [profile, ...INVESTORS];
  return profile;
}

export function updateInvestor(
  id: string,
  patch: Partial<InvestorProfileInput>
): InvestorProfile | null {
  const idx = INVESTORS.findIndex((i) => i.id === id);
  if (idx === -1) return null;
  if (patch.email && emailExists(patch.email, id)) {
    throw new Error("Já existe outro cadastro com este e-mail.");
  }
  const prev = INVESTORS[idx];
  const now = new Date().toISOString();
  const next: InvestorProfile = {
    ...prev,
    ...patch,
    id: prev.id,
    createdAt: prev.createdAt,
    updatedAt: now
  };
  INVESTORS[idx] = next;
  return next;
}

export function deleteInvestor(id: string): boolean {
  const before = INVESTORS.length;
  INVESTORS = INVESTORS.filter((i) => i.id !== id);
  return INVESTORS.length < before;
}
