import type { AuthUser, UserRole } from "@/types/auth";

/**
 * Base de usuários mockada. Em produção, isso será substituído por
 * um provider de autenticação real (NextAuth, Clerk, backend próprio).
 */
interface MockUser extends AuthUser {
  password: string;
}

export const MOCK_USERS: MockUser[] = [
  {
    id: "usr_admin_1",
    name: "Admin Byte7",
    email: "admin@byte7.com.br",
    password: "admin123",
    role: "admin"
  },
  {
    id: "usr_inv_1",
    name: "Marina Azevedo",
    email: "investidor@byte7.com.br",
    password: "investidor123",
    role: "investor"
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
