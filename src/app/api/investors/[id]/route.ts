import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, decodeSession, matchesRole } from "@/lib/session";
import {
  deleteInvestor,
  getInvestorById,
  updateInvestor
} from "@/mocks/investorProfiles";
import type { InvestorProfileInput } from "@/types/investorProfile";
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
      { message: "Cadastro não encontrado." },
      { status: 404 }
    );
  }
  return NextResponse.json(profile);
}

export async function PUT(req: Request, ctx: { params: { id: string } }) {
  const session = decodeSession(cookies().get(SESSION_COOKIE)?.value);
  if (!matchesRole(session, "admin")) {
    return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
  }
  const prev = getInvestorById(ctx.params.id);
  if (!prev) {
    return NextResponse.json(
      { message: "Cadastro não encontrado." },
      { status: 404 }
    );
  }
  const patch = (await req.json().catch(() => null)) as
    | Partial<InvestorProfileInput>
    | null;
  if (!patch) {
    return NextResponse.json({ message: "Payload inválido." }, { status: 400 });
  }
  try {
    const updated = updateInvestor(ctx.params.id, patch);
    if (!updated) {
      return NextResponse.json(
        { message: "Cadastro não encontrado." },
        { status: 404 }
      );
    }
    recordAudit({
      session: session!,
      action: "update",
      entity: "investor_profile",
      entityId: updated.id,
      investorId: updated.id,
      before: prev as unknown as Record<string, unknown>,
      after: updated as unknown as Record<string, unknown>
    });
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json(
      {
        message:
          err instanceof Error ? err.message : "Falha ao atualizar cadastro."
      },
      { status: 409 }
    );
  }
}

export async function DELETE(_req: Request, ctx: { params: { id: string } }) {
  const session = decodeSession(cookies().get(SESSION_COOKIE)?.value);
  if (!matchesRole(session, "admin")) {
    return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
  }
  const prev = getInvestorById(ctx.params.id);
  if (!prev) {
    return NextResponse.json(
      { message: "Cadastro não encontrado." },
      { status: 404 }
    );
  }
  const ok = deleteInvestor(ctx.params.id);
  if (!ok) {
    return NextResponse.json(
      { message: "Cadastro não encontrado." },
      { status: 404 }
    );
  }
  recordAudit({
    session: session!,
    action: "delete",
    entity: "investor_profile",
    entityId: prev.id,
    investorId: prev.id,
    before: prev as unknown as Record<string, unknown>,
    after: null
  });
  return new NextResponse(null, { status: 204 });
}
