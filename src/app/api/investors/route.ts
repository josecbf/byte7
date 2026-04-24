import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, decodeSession, matchesRole } from "@/lib/session";
import {
  createInvestor,
  listInvestors
} from "@/mocks/investorProfiles";
import type {
  InvestorProfileInput,
  InvestorProfileStatus
} from "@/types/investorProfile";
import { recordAudit } from "@/lib/audit";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const session = decodeSession(cookies().get(SESSION_COOKIE)?.value);
  if (!matchesRole(session, "admin")) {
    return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
  }
  const url = new URL(req.url);
  const statusParam = url.searchParams.get("status");
  const allowed: InvestorProfileStatus[] = ["ativo", "pendente", "inativo"];
  const status = allowed.includes(statusParam as InvestorProfileStatus)
    ? (statusParam as InvestorProfileStatus)
    : undefined;
  return NextResponse.json(listInvestors(status ? { status } : undefined));
}

export async function POST(req: Request) {
  const session = decodeSession(cookies().get(SESSION_COOKIE)?.value);
  if (!matchesRole(session, "admin")) {
    return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
  }
  const body = (await req.json().catch(() => null)) as
    | InvestorProfileInput
    | null;
  if (!body || !body.fullName || !body.email) {
    return NextResponse.json(
      { message: "Nome completo e e-mail são obrigatórios." },
      { status: 400 }
    );
  }
  try {
    const created = createInvestor(body);
    recordAudit({
      session: session!,
      action: "create",
      entity: "investor_profile",
      entityId: created.id,
      investorId: created.id,
      before: null,
      after: created as unknown as Record<string, unknown>
    });
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      {
        message:
          err instanceof Error ? err.message : "Falha ao criar cadastro."
      },
      { status: 409 }
    );
  }
}
