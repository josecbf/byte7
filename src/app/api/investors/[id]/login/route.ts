import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, decodeSession, matchesRole } from "@/lib/session";
import { getInvestorById } from "@/mocks/investorProfiles";
import {
  InvestorUserInput,
  createInvestorUser,
  getUserByInvestorProfileId,
  toPublicUser
} from "@/mocks/users";
import { recordAudit } from "@/lib/audit";

export const runtime = "nodejs";

export async function GET(_req: Request, ctx: { params: { id: string } }) {
  const session = decodeSession(cookies().get(SESSION_COOKIE)?.value);
  if (!matchesRole(session, "admin")) {
    return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
  }
  const profile = getInvestorById(ctx.params.id);
  if (!profile) {
    return NextResponse.json(
      { message: "Investidor não encontrado." },
      { status: 404 }
    );
  }
  const user = getUserByInvestorProfileId(ctx.params.id);
  if (!user) {
    return NextResponse.json(null);
  }
  return NextResponse.json(toPublicUser(user));
}

/**
 * Cria um usuário de login vinculado ao perfil de investidor.
 * A senha é informada pelo admin (mínimo 6 caracteres). Auditoria
 * registra o evento sem a senha — nunca persistimos credenciais no log.
 */
export async function POST(req: Request, ctx: { params: { id: string } }) {
  const session = decodeSession(cookies().get(SESSION_COOKIE)?.value);
  if (!matchesRole(session, "admin")) {
    return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
  }
  const profile = getInvestorById(ctx.params.id);
  if (!profile) {
    return NextResponse.json(
      { message: "Investidor não encontrado." },
      { status: 404 }
    );
  }
  const body = (await req.json().catch(() => null)) as
    | Partial<Omit<InvestorUserInput, "investorProfileId">>
    | null;
  if (!body || typeof body.password !== "string") {
    return NextResponse.json(
      { message: "Campo 'password' obrigatório." },
      { status: 400 }
    );
  }
  try {
    const created = createInvestorUser({
      investorProfileId: ctx.params.id,
      name: (body.name || profile.fullName).trim(),
      email: (body.email || profile.email).trim(),
      password: body.password
    });
    const publicUser = toPublicUser(created);
    recordAudit({
      session: session!,
      action: "create",
      entity: "user_login",
      entityId: created.id,
      investorId: ctx.params.id,
      before: null,
      after: publicUser as unknown as Record<string, unknown>,
      note: "Acesso criado"
    });
    return NextResponse.json(publicUser, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      {
        message: err instanceof Error ? err.message : "Falha ao criar acesso."
      },
      { status: 409 }
    );
  }
}
