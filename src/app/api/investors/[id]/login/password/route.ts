import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, decodeSession, matchesRole } from "@/lib/session";
import { getInvestorById } from "@/mocks/investorProfiles";
import {
  getUserByInvestorProfileId,
  resetPassword
} from "@/mocks/users";
import { recordAudit } from "@/lib/audit";

export const runtime = "nodejs";

/**
 * Redefine a senha do usuário de login vinculado ao investidor.
 *
 * Auditoria registra `update` em `user_login` com `note: "Senha
 * redefinida"`. Os snapshots `before`/`after` ficam nulos — a senha
 * nunca é gravada no log, nem o hash. O rastro é quem/quando/qual
 * usuário, sem vazar o valor antigo nem o novo.
 */
export async function PUT(req: Request, ctx: { params: { id: string } }) {
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
  const user = getUserByInvestorProfileId(ctx.params.id);
  if (!user) {
    return NextResponse.json(
      { message: "Este investidor ainda não possui acesso." },
      { status: 404 }
    );
  }
  const body = (await req.json().catch(() => null)) as
    | { password?: string }
    | null;
  if (!body || typeof body.password !== "string") {
    return NextResponse.json(
      { message: "Campo 'password' obrigatório." },
      { status: 400 }
    );
  }
  try {
    resetPassword(user.id, body.password);
    recordAudit({
      session: session!,
      action: "update",
      entity: "user_login",
      entityId: user.id,
      investorId: ctx.params.id,
      before: null,
      after: null,
      note: "Senha redefinida"
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      {
        message:
          err instanceof Error ? err.message : "Falha ao redefinir senha."
      },
      { status: 400 }
    );
  }
}
