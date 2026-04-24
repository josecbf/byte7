import type { Session } from "@/types/auth";
import type {
  AuditAction,
  AuditEntity,
  AuditSource
} from "@/types/audit";
import { appendAudit } from "@/mocks/auditLog";

export interface AuditContext {
  session: Session;
  action: AuditAction;
  entity: AuditEntity;
  entityId: string;
  investorId: string;
  before: Record<string, unknown> | null;
  after: Record<string, unknown> | null;
  source?: AuditSource;
  note?: string;
}

/**
 * Registra uma mutação no log de auditoria. Resolve o ator a partir
 * da sessão — chamador não precisa conhecer a forma da entrada.
 */
export function recordAudit(ctx: AuditContext): void {
  appendAudit({
    actorId: ctx.session.userId,
    actorName: ctx.session.name,
    action: ctx.action,
    entity: ctx.entity,
    entityId: ctx.entityId,
    investorId: ctx.investorId,
    before: ctx.before,
    after: ctx.after,
    source: ctx.source ?? "ui",
    note: ctx.note
  });
}
