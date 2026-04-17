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

export const MOCK_USERS: MockUser[] = [
  {
    id: "usr_admin_1",
    name: "Admin COOPERGAC",
    email: "admin@coopergac.com.br",
    password: "admin123",
    role: "admin"
  },
  {
    id: "usr_inv_1",
    name: "Marina Azevedo",
    email: "investidor@coopergac.com.br",
    password: "investidor123",
    role: "investor",
    investorProfileId: "inv_001"
  }
];

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
