/**
 * Entrada do log de auditoria. Append-only — qualquer mutação em
 * entidade financeira (aporte, statement, cadastro) deixa um rastro.
 *
 * `before`/`after` são snapshots parciais do registro afetado. Em
 * criações, `before` é null; em exclusões, `after` é null.
 */
export type AuditEntity =
  | "aporte"
  | "statement"
  | "investor_profile"
  | "user_login";
export type AuditAction = "create" | "update" | "delete";
export type AuditSource = "ui" | "excel_upload";

export interface AuditLogEntry {
  id: string;
  timestamp: string; // ISO
  actorId: string;
  actorName: string;
  action: AuditAction;
  entity: AuditEntity;
  entityId: string;
  /** Agrupador — sempre presente mesmo quando a entidade é o próprio investidor. */
  investorId: string;
  before: Record<string, unknown> | null;
  after: Record<string, unknown> | null;
  source: AuditSource;
  note?: string;
}

export interface AuditLogFilters {
  investorId?: string;
  actorId?: string;
  entity?: AuditEntity;
  source?: AuditSource;
  from?: string; // ISO date (inclusive)
  to?: string; // ISO date (inclusive)
}
