import type { AuditLogEntry, AuditLogFilters } from "@/types/audit";

/**
 * Log append-only de auditoria. Não expõe update nem delete — uma
 * entrada, uma vez registrada, não pode ser alterada.
 */

let LOG: AuditLogEntry[] = [];

function genId(): string {
  return `aud_${Math.random().toString(36).slice(2, 12)}`;
}

export function appendAudit(
  entry: Omit<AuditLogEntry, "id" | "timestamp">
): AuditLogEntry {
  const record: AuditLogEntry = {
    ...entry,
    id: genId(),
    timestamp: new Date().toISOString()
  };
  LOG = [record, ...LOG];
  return record;
}

export function listAudit(filters: AuditLogFilters = {}): AuditLogEntry[] {
  return LOG.filter((e) => {
    if (filters.investorId && e.investorId !== filters.investorId) return false;
    if (filters.actorId && e.actorId !== filters.actorId) return false;
    if (filters.entity && e.entity !== filters.entity) return false;
    if (filters.source && e.source !== filters.source) return false;
    if (filters.from && e.timestamp < filters.from) return false;
    if (filters.to && e.timestamp > filters.to) return false;
    return true;
  });
}
