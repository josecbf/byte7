import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, decodeSession, matchesRole } from "@/lib/session";
import {
  MOCK_APORTES,
  buildDashboardSummary,
  buildMonthlyEvolution
} from "@/mocks/investor";
import { MOCK_USINAS } from "@/mocks/usinas";

export const runtime = "nodejs";

export async function GET() {
  const session = decodeSession(cookies().get(SESSION_COOKIE)?.value);
  if (!matchesRole(session, "investor")) {
    return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
  }
  return NextResponse.json({
    summary: buildDashboardSummary(),
    aportes: MOCK_APORTES,
    evolution: buildMonthlyEvolution(),
    usinas: MOCK_USINAS
  });
}
