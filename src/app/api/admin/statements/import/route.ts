import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, decodeSession, matchesRole } from "@/lib/session";
import { getInvestorById } from "@/mocks/investorProfiles";
import {
  createStatement,
  listStatements
} from "@/mocks/statements";
import {
  ImportSummary,
  ParsedRow,
  RowOutcome,
  parseStatementsWorkbook
} from "@/lib/statementsExcel";
import { recordAudit } from "@/lib/audit";

export const runtime = "nodejs";

const EPS = 0.005; // tolerância pra comparar BRL com 2 casas

function sameValues(
  a: { invested: number; rate: number; balance: number; note?: string },
  b: { invested: number; rate: number; balance: number; note?: string }
): boolean {
  return (
    Math.abs(a.invested - b.invested) < EPS &&
    Math.abs(a.rate - b.rate) < 1e-6 &&
    Math.abs(a.balance - b.balance) < EPS &&
    (a.note ?? "") === (b.note ?? "")
  );
}

/**
 * Importa um .xlsx com lançamentos. Cada linha vira um
 * `MonthlyStatement`. A apuração por linha é:
 *
 * - investor inválido ou linha malformada → outcome=error
 * - igual ao statement ATIVO para (investor, mês) → outcome=unchanged
 * - sem ativo para (investor, mês) → outcome=created
 * - ativo com valores diferentes → outcome=superseded (o antigo fica
 *   marcado com `supersededBy` do novo, via `createStatement`)
 *
 * Auditoria recebe `source: "excel_upload"` em todas as entradas
 * geradas pela importação.
 */
export async function POST(req: Request) {
  const session = decodeSession(cookies().get(SESSION_COOKIE)?.value);
  if (!matchesRole(session, "admin")) {
    return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
  }
  const ctype = req.headers.get("content-type") ?? "";
  if (!ctype.includes("multipart/form-data")) {
    return NextResponse.json(
      { message: "Use multipart/form-data com um campo 'file'." },
      { status: 400 }
    );
  }
  const fd = await req.formData();
  const file = fd.get("file");
  if (!(file instanceof Blob)) {
    return NextResponse.json(
      { message: "Campo 'file' obrigatório." },
      { status: 400 }
    );
  }
  const arrayBuffer = await file.arrayBuffer();
  const parsed = await parseStatementsWorkbook(Buffer.from(arrayBuffer));

  const outcomes: RowOutcome[] = [];
  const stats = { created: 0, superseded: 0, unchanged: 0, errors: 0 };

  for (const row of parsed.rows as ParsedRow[]) {
    // investor existe?
    if (!getInvestorById(row.investorId)) {
      outcomes.push({
        rowNumber: row.rowNumber,
        investorId: row.investorId,
        month: row.month,
        outcome: "error",
        message: "Investidor não encontrado."
      });
      stats.errors++;
      continue;
    }
    const actives = listStatements({ investorId: row.investorId });
    const existing = actives.find((s) => s.month === row.month);

    if (existing && sameValues(existing, row)) {
      outcomes.push({
        rowNumber: row.rowNumber,
        investorId: row.investorId,
        month: row.month,
        outcome: "unchanged"
      });
      stats.unchanged++;
      continue;
    }

    try {
      const { created, superseded } = createStatement(
        row.investorId,
        {
          month: row.month,
          invested: row.invested,
          rate: row.rate,
          balance: row.balance,
          note: row.note
        },
        { id: session!.userId }
      );
      if (superseded) {
        recordAudit({
          session: session!,
          action: "update",
          entity: "statement",
          entityId: superseded.id,
          investorId: row.investorId,
          before: {
            ...superseded,
            supersededBy: null,
            supersededAt: null
          } as unknown as Record<string, unknown>,
          after: superseded as unknown as Record<string, unknown>,
          source: "excel_upload",
          note: `Substituído por ${created.id} (linha Excel ${row.rowNumber})`
        });
      }
      recordAudit({
        session: session!,
        action: "create",
        entity: "statement",
        entityId: created.id,
        investorId: row.investorId,
        before: null,
        after: created as unknown as Record<string, unknown>,
        source: "excel_upload",
        note: superseded
          ? `Substitui ${superseded.id} (linha Excel ${row.rowNumber})`
          : `Criado via Excel (linha ${row.rowNumber})`
      });
      outcomes.push({
        rowNumber: row.rowNumber,
        investorId: row.investorId,
        month: row.month,
        outcome: superseded ? "superseded" : "created",
        newStatementId: created.id,
        supersededStatementId: superseded?.id
      });
      if (superseded) stats.superseded++;
      else stats.created++;
    } catch (err) {
      outcomes.push({
        rowNumber: row.rowNumber,
        investorId: row.investorId,
        month: row.month,
        outcome: "error",
        message: err instanceof Error ? err.message : "Falha ao aplicar linha."
      });
      stats.errors++;
    }
  }

  const summary: ImportSummary = {
    total: parsed.rows.length + parsed.errors.length,
    created: stats.created,
    superseded: stats.superseded,
    unchanged: stats.unchanged,
    errors: stats.errors + parsed.errors.length,
    outcomes,
    parseErrors: parsed.errors
  };
  return NextResponse.json(summary);
}
