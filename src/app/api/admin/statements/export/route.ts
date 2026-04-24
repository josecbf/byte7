import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SESSION_COOKIE, decodeSession, matchesRole } from "@/lib/session";
import { listStatements } from "@/mocks/statements";
import { listInvestors } from "@/mocks/investorProfiles";
import { buildStatementsWorkbook } from "@/lib/statementsExcel";

export const runtime = "nodejs";

/**
 * Gera .xlsx com os lançamentos ATIVOS de todos os investidores.
 * Linhas = (investor, mês). Registros superseded/voided ficam de
 * fora — para histórico completo, consultar `/admin/auditoria`.
 */
export async function GET() {
  const session = decodeSession(cookies().get(SESSION_COOKIE)?.value);
  if (!matchesRole(session, "admin")) {
    return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
  }
  const statements = listStatements();
  const investors = listInvestors();
  const buf = await buildStatementsWorkbook(statements, investors);
  const ts = new Date().toISOString().replace(/[-:]/g, "").slice(0, 13);
  return new NextResponse(buf, {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="byte7-lancamentos-${ts}.xlsx"`,
      "Cache-Control": "no-store"
    }
  });
}
