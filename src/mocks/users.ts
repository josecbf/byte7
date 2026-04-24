import type { AuthUser, UserRole } from "@/types/auth";

/**
 * Base de usuários mockada. Em produção, isso será substituído por
 * um provider de autenticação real (NextAuth, Clerk, backend próprio).
 */
interface MockUser extends AuthUser {
  password: string;
  /**
   * Amarra o usuário de login a um cadastro em `InvestorProfile` (`investorProfileId`).
   * Só faz sentido para usuários com role=investor.
   */
  investorProfileId?: string;
}

const SEED_USERS: MockUser[] = [
  {
    id: "usr_admin_1",
    name: "Admin Byte7",
    email: "admin@byte7.com.br",
    password: "admin123",
    role: "admin"
  },
  {
    id: "usr_editor_1",
    name: "Editor Byte7",
    email: "editor@byte7.com.br",
    password: "editor123",
    role: "editor"
  },
  {
    id: "usr_inv_1",
    name: "Marina Azevedo",
    email: "investidor@byte7.com.br",
    password: "investidor123",
    role: "investor",
    investorProfileId: "inv_001"
  }
];

export const MOCK_USERS: MockUser[] = [...SEED_USERS];

function genId(): string {
  return `usr_${Math.random().toString(36).slice(2, 10)}`;
}

export function findUserByCredentials(
  email: string,
  password: string,
  expectedRole: UserRole
): AuthUser | null {
  const user = MOCK_USERS.find(
    (u) =>
      u.email.toLowerCase() === email.toLowerCase() &&
      u.password === password &&
      u.role === expectedRole
  );
  if (!user) return null;
  const { password: _pw, ...publicUser } = user;
  return publicUser;
}

export function findUserByEmail(email: string): MockUser | undefined {
  return MOCK_USERS.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );
}

export function getUserById(id: string): MockUser | undefined {
  return MOCK_USERS.find((u) => u.id === id);
}

export function getUserByInvestorProfileId(
  profileId: string
): MockUser | undefined {
  return MOCK_USERS.find((u) => u.investorProfileId === profileId);
}

export function toPublicUser(user: MockUser): AuthUser & {
  investorProfileId?: string;
} {
  const { password: _pw, ...rest } = user;
  return rest;
}

export interface InvestorUserInput {
  investorProfileId: string;
  name: string;
  email: string;
  password: string;
}

export function createInvestorUser(input: InvestorUserInput): MockUser {
  if (findUserByEmail(input.email)) {
    throw new Error("Já existe um usuário com este e-mail.");
  }
  if (getUserByInvestorProfileId(input.investorProfileId)) {
    throw new Error(
      "Este investidor já possui um usuário de login vinculado."
    );
  }
  if (input.password.length < 6) {
    throw new Error("A senha precisa ter ao menos 6 caracteres.");
  }
  const user: MockUser = {
    id: genId(),
    name: input.name,
    email: input.email,
    password: input.password,
    role: "investor",
    investorProfileId: input.investorProfileId
  };
  MOCK_USERS.push(user);
  return user;
}

export function resetPassword(userId: string, newPassword: string): MockUser {
  if (newPassword.length < 6) {
    throw new Error("A senha precisa ter ao menos 6 caracteres.");
  }
  const idx = MOCK_USERS.findIndex((u) => u.id === userId);
  if (idx === -1) {
    throw new Error("Usuário não encontrado.");
  }
  MOCK_USERS[idx] = { ...MOCK_USERS[idx], password: newPassword };
  return MOCK_USERS[idx];
}
