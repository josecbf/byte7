import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, decodeSession, matchesRole } from "@/lib/session";
import { getCurrentInvestorAportes } from "@/lib/currentInvestor";

export const runtime = "nodejs";

export async function GET() {
  const session = decodeSession(cookies().get(SESSION_COOKIE)?.value);
  if (!matchesRole(session, "investor")) {
    return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
  }
  return NextResponse.json(getCurrentInvestorAportes());
}
