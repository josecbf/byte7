import { cookies } from "next/headers";
import { SESSION_COOKIE, decodeSession } from "@/lib/session";
import { MOCK_USERS } from "@/mocks/users";
import { listAportes } from "@/mocks/aportes";
import { listStatements } from "@/mocks/statements";
import type { Aporte } from "@/types/investor";
import type { MonthlyStatement } from "@/types/statement";

/**
 * Helpers para resolver — em Server Components e route handlers — qual
 * é o cadastro de investidor (`InvestorProfile`) vinculado ao usuário
 * de login atualmente autenticado.
 *
 * A amarração é feita via `MOCK_USERS[i].investorProfileId`. Quando a
 * demo trocar para auth/backend real, este arquivo é o único ponto a
 * ajustar (por exemplo, passando a resolver o vínculo via JWT claim).
 */
export function getCurrentInvestorProfileId(): string | null {
  const session = decodeSession(cookies().get(SESSION_COOKIE)?.value);
  if (!session || session.role !== "investor") return null;
  const user = MOCK_USERS.find((u) => u.id === session.userId);
  return user?.investorProfileId ?? null;
}

export function getCurrentInvestorAportes(): Aporte[] {
  const id = getCurrentInvestorProfileId();
  if (!id) return [];
  return listAportes({ investorId: id });
}

export function getCurrentInvestorStatements(): MonthlyStatement[] {
  const id = getCurrentInvestorProfileId();
  if (!id) return [];
  return listStatements({ investorId: id });
}
