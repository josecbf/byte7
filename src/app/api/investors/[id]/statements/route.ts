import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, decodeSession, matchesRole } from "@/lib/session";
import { getInvestorById } from "@/mocks/investorProfiles";
import {
  createStatement,
  listStatements
} from "@/mocks/statements";
import type { MonthlyStatementInput } from "@/types/statement";
import { recordAudit } from "@/lib/audit";

export const runtime = "nodejs";

export async function GET(
  req: Request,
  ctx: { params: { id: string } }
) {
  const session = decodeSession(cookies().get(SESSION_COOKIE)?.value);
  if (!matchesRole(session, "admin")) {
    return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
  }
  if (!getInvestorById(ctx.params.id)) {
    return NextResponse.json(
      { message: "Investidor não encontrado." },
      { status: 404 }
    );
  }
  const url = new URL(req.url);
  const includeInactive = url.searchParams.get("includeInactive") === "true";
  return NextResponse.json(
    listStatements({ investorId: ctx.params.id, includeInactive })
  );
}

/**
 * POST cria um lançamento. Se já existir um lançamento ATIVO para
 * `(investorId, month)`, ele é automaticamente marcado como
 * `supersededBy` do novo — o antigo fica preservado no banco (ADR-019).
 */
export async function POST(req: Request, ctx: { params: { id: string } }) {
  const session = decodeSession(cookies().get(SESSION_COOKIE)?.value);
  if (!matchesRole(session, "admin")) {
    return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
  }
  if (!getInvestorById(ctx.params.id)) {
    return NextResponse.json(
      { message: "Investidor não encontrado." },
      { status: 404 }
    );
  }
  const body = (await req.json().catch(() => null)) as
    | MonthlyStatementInput
    | null;
  if (
    !body ||
    !body.month ||
    typeof body.invested !== "number" ||
    typeof body.rate !== "number" ||
    typeof body.balance !== "number"
  ) {
    return NextResponse.json(
      { message: "Campos obrigatórios: month, invested, rate, balance." },
      { status: 400 }
    );
  }
  try {
    const { created, superseded } = createStatement(
      ctx.params.id,
      body,
      { id: session!.userId }
    );
    if (superseded) {
      recordAudit({
        session: session!,
        action: "update",
        entity: "statement",
        entityId: superseded.id,
        investorId: ctx.params.id,
        before: {
          ...superseded,
          supersededBy: null,
          supersededAt: null
        } as unknown as Record<string, unknown>,
        after: superseded as unknown as Record<string, unknown>,
        note: `Substituído por ${created.id}`
      });
    }
    recordAudit({
      session: session!,
      action: "create",
      entity: "statement",
      entityId: created.id,
      investorId: ctx.params.id,
      before: null,
      after: created as unknown as Record<string, unknown>,
      note: superseded ? `Substitui ${superseded.id}` : undefined
    });
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      {
        message:
          err instanceof Error ? err.message : "Falha ao criar lançamento."
      },
      { status: 409 }
    );
  }
}
