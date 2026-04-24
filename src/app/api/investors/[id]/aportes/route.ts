import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, decodeSession, matchesRole } from "@/lib/session";
import { getInvestorById } from "@/mocks/investorProfiles";
import {
  AporteInput,
  createAporte,
  listAportes
} from "@/mocks/aportes";
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
    listAportes({ investorId: ctx.params.id, includeInactive })
  );
}

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
    | (Omit<AporteInput, "investorId"> & { supersedes?: string })
    | null;
  if (
    !body ||
    !body.date ||
    !body.usinaId ||
    !body.usinaName ||
    typeof body.amount !== "number"
  ) {
    return NextResponse.json(
      { message: "Campos obrigatórios: date, amount, usinaId, usinaName." },
      { status: 400 }
    );
  }
  try {
    const { created, superseded } = createAporte({
      ...body,
      investorId: ctx.params.id
    });
    if (superseded) {
      recordAudit({
        session: session!,
        action: "update",
        entity: "aporte",
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
      entity: "aporte",
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
          err instanceof Error ? err.message : "Falha ao criar aporte."
      },
      { status: 409 }
    );
  }
}
