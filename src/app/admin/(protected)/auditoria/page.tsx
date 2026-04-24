import { listAudit } from "@/mocks/auditLog";
import { listInvestors } from "@/mocks/investorProfiles";
import type { AuditEntity, AuditSource } from "@/types/audit";
import { AuditClient } from "./AuditClient";

export const dynamic = "force-dynamic";

const ALLOWED_ENTITIES: AuditEntity[] = [
  "aporte",
  "statement",
  "investor_profile",
  "user_login"
];
const ALLOWED_SOURCES: AuditSource[] = ["ui", "excel_upload"];

export default function AuditoriaPage({
  searchParams
}: {
  searchParams?: {
    investorId?: string;
    entity?: string;
    source?: string;
    actorId?: string;
    from?: string;
    to?: string;
  };
}) {
  const entity = ALLOWED_ENTITIES.includes(
    (searchParams?.entity ?? "") as AuditEntity
  )
    ? (searchParams!.entity as AuditEntity)
    : undefined;
  const source = ALLOWED_SOURCES.includes(
    (searchParams?.source ?? "") as AuditSource
  )
    ? (searchParams!.source as AuditSource)
    : undefined;

  // `from`/`to` vêm como YYYY-MM-DD; normaliza para ISO-limites do dia.
  const from = searchParams?.from ? `${searchParams.from}T00:00:00.000Z` : undefined;
  const to = searchParams?.to ? `${searchParams.to}T23:59:59.999Z` : undefined;

  const entries = listAudit({
    investorId: searchParams?.investorId,
    actorId: searchParams?.actorId,
    entity,
    source,
    from,
    to
  });
  const investors = listInvestors().map((i) => ({
    id: i.id,
    fullName: i.fullName
  }));

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-ink-900 tracking-tight">
          Auditoria
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          Trilha de todas as criações, edições e exclusões de dados financeiros
          e cadastros. Log append-only — entradas não podem ser alteradas.
        </p>
      </div>

      <AuditClient entries={entries} investors={investors} />
    </div>
  );
}
