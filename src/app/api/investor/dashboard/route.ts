import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, decodeSession, matchesRole } from "@/lib/session";
import {
  buildDashboardSummary,
  buildMonthlyEvolution
} from "@/mocks/investor";
import { MOCK_USINAS } from "@/mocks/usinas";
import {
  getCurrentInvestorAportes,
  getCurrentInvestorStatements
} from "@/lib/currentInvestor";

export const runtime = "nodejs";

export async function GET() {
  const session = decodeSession(cookies().get(SESSION_COOKIE)?.value);
  if (!matchesRole(session, "investor")) {
    return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
  }
  const aportes = getCurrentInvestorAportes();
  const statements = getCurrentInvestorStatements();
  return NextResponse.json({
    summary: buildDashboardSummary(aportes, statements),
    aportes,
    evolution: buildMonthlyEvolution(aportes, statements),
    usinas: MOCK_USINAS
  });
}
