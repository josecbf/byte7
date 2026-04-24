import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, decodeSession, matchesRole } from "@/lib/session";
import { getAporteById, voidAporte } from "@/mocks/aportes";
import { recordAudit } from "@/lib/audit";

export const runtime = "nodejs";

/**
 * DELETE é soft — o aporte permanece no banco marcado com `voidedAt`
 * (ADR-019). Para corrigir valores, a interface envia um POST na
 * rota pai com `supersedes: <aporteId>`.
 */
export async function DELETE(
  _req: Request,
  ctx: { params: { id: string; aporteId: string } }
) {
  const session = decodeSession(cookies().get(SESSION_COOKIE)?.value);
  if (!matchesRole(session, "admin")) {
    return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
  }
  const existing = getAporteById(ctx.params.aporteId);
  if (!existing || existing.investorId !== ctx.params.id) {
    return NextResponse.json(
      { message: "Aporte não encontrado." },
      { status: 404 }
    );
  }
  const result = voidAporte(ctx.params.aporteId, { id: session!.userId });
  if (!result) {
    return NextResponse.json(
      { message: "Aporte não está mais ativo." },
      { status: 409 }
    );
  }
  recordAudit({
    session: session!,
    action: "delete",
    entity: "aporte",
    entityId: result.after.id,
    investorId: ctx.params.id,
    before: result.before as unknown as Record<string, unknown>,
    after: result.after as unknown as Record<string, unknown>,
    note: "Invalidado (soft-delete)"
  });
  return new NextResponse(null, { status: 204 });
}
