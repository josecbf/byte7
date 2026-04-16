export type InvestorProfileStatus = "ativo" | "pendente" | "inativo";

/**
 * Cadastro administrativo do investidor (gerenciado pelo admin).
 *
 * Observação: este tipo é distinto do usuário de login (ver
 * `src/mocks/users.ts`). Um cadastro pode existir sem conta de login e
 * vice-versa — a amarração em produção será feita por e-mail ou id.
 */
export interface InvestorProfile {
  id: string;
  fullName: string;
  email: string;
  document: string; // CPF/CNPJ — formato livre na demo
  phone: string;
  city: string;
  state: string; // UF
  status: InvestorProfileStatus;
  notes?: string;
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

export type InvestorProfileInput = Omit<
  InvestorProfile,
  "id" | "createdAt" | "updatedAt"
>;
