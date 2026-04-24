import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, decodeSession, matchesRole } from "@/lib/session";
import { getStatementById, voidStatement } from "@/mocks/statements";
import { recordAudit } from "@/lib/audit";

export const runtime = "nodejs";

/**
 * DELETE é soft — o lançamento permanece no banco marcado com
 * `voidedAt` (ADR-019). Para corrigir, envie um POST na rota pai com
 * o mesmo `month`: o antigo vira `supersededBy` do novo.
 */
export async function DELETE(
  _req: Request,
  ctx: { params: { id: string; statementId: string } }
) {
  const session = decodeSession(cookies().get(SESSION_COOKIE)?.value);
  if (!matchesRole(session, "admin")) {
    return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
  }
  const existing = getStatementById(ctx.params.statementId);
  if (!existing || existing.investorId !== ctx.params.id) {
    return NextResponse.json(
      { message: "Lançamento não encontrado." },
      { status: 404 }
    );
  }
  const result = voidStatement(ctx.params.statementId, {
    id: session!.userId
  });
  if (!result) {
    return NextResponse.json(
      { message: "Lançamento não está mais ativo." },
      { status: 409 }
    );
  }
  recordAudit({
    session: session!,
    action: "delete",
    entity: "statement",
    entityId: result.after.id,
    investorId: ctx.params.id,
    before: result.before as unknown as Record<string, unknown>,
    after: result.after as unknown as Record<string, unknown>,
    note: "Invalidado (soft-delete)"
  });
  return new NextResponse(null, { status: 204 });
}
