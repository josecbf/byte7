import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, decodeSession, matchesRole } from "@/lib/session";
import { MOCK_CONTRACT } from "@/mocks/investor";
import { formatBRL, formatDate, formatPct } from "@/lib/format";

export const runtime = "nodejs";

/**
 * Endpoint de "download" do contrato mockado. Gera um arquivo texto
 * simples (.txt) para a demo. Em produção, este endpoint retornará
 * um PDF gerado/armazenado pelo backend.
 */
export async function GET() {
  const session = decodeSession(cookies().get(SESSION_COOKIE)?.value);
  if (!matchesRole(session, "investor")) {
    return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
  }

  const c = MOCK_CONTRACT;
  const lines = [
    "===================================================",
    "  BYTE7 — CONTRATO DE PARTICIPAÇÃO (DEMO MOCKADA)",
    "===================================================",
    "",
    `Nº do contrato:  ${c.number}`,
    `Assinado em:     ${formatDate(c.signedAt)}`,
    `Rendimento:      ${formatPct(c.monthlyYieldRate)} ao mês`,
    `Investidor:      ${c.parties.investor}`,
    `Emissor:         ${c.parties.issuer}`,
    "",
    "RESUMO",
    "------",
    c.summary,
    "",
    "CLÁUSULAS",
    "---------"
  ];
  for (const cl of c.clauses) {
    lines.push("");
    lines.push(cl.title);
    lines.push(cl.body);
  }
  lines.push("");
  lines.push("---");
  lines.push(
    `Este documento é gerado apenas para fins demonstrativos. Nenhum valor financeiro foi movimentado. Valor declarado é meramente ilustrativo (${formatBRL(0)}).`
  );

  const body = lines.join("\n");
  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="contrato-byte7-${c.number}.txt"`
    }
  });
}
