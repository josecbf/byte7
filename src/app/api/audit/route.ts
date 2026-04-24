import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, decodeSession, matchesRole } from "@/lib/session";
import { listAudit } from "@/mocks/auditLog";
import type { AuditEntity, AuditSource } from "@/types/audit";

export const runtime = "nodejs";

const ALLOWED_ENTITIES: AuditEntity[] = [
  "aporte",
  "statement",
  "investor_profile",
  "user_login"
];
const ALLOWED_SOURCES: AuditSource[] = ["ui", "excel_upload"];

export async function GET(req: Request) {
  const session = decodeSession(cookies().get(SESSION_COOKIE)?.value);
  if (!matchesRole(session, "admin")) {
    return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
  }
  const url = new URL(req.url);
  const entityParam = url.searchParams.get("entity");
  const sourceParam = url.searchParams.get("source");
  const entity = ALLOWED_ENTITIES.includes(entityParam as AuditEntity)
    ? (entityParam as AuditEntity)
    : undefined;
  const source = ALLOWED_SOURCES.includes(sourceParam as AuditSource)
    ? (sourceParam as AuditSource)
    : undefined;
  return NextResponse.json(
    listAudit({
      investorId: url.searchParams.get("investorId") ?? undefined,
      actorId: url.searchParams.get("actorId") ?? undefined,
      entity,
      source,
      from: url.searchParams.get("from") ?? undefined,
      to: url.searchParams.get("to") ?? undefined
    })
  );
}
