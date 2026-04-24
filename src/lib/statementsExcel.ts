import ExcelJS from "exceljs";

import type { MonthlyStatement } from "@/types/statement";
import type { InvestorProfile } from "@/types/investorProfile";

const SHEET_NAME = "Lançamentos";

/**
 * Colunas do arquivo — a ordem define o layout visual do .xlsx.
 * Toda alteração aqui quebra a importação de arquivos antigos,
 * então mantenha back-compat ao renomear/remover.
 */
const COLUMNS = [
  { key: "investorId", header: "ID Investidor", width: 14 },
  { key: "investorName", header: "Investidor", width: 28 },
  { key: "month", header: "Mês (YYYY-MM)", width: 16 },
  { key: "invested", header: "Investido (R$)", width: 18 },
  { key: "ratePct", header: "Taxa do mês (%)", width: 16 },
  { key: "balance", header: "Saldo (R$)", width: 18 },
  { key: "note", header: "Observação", width: 38 }
] as const;

export async function buildStatementsWorkbook(
  statements: MonthlyStatement[],
  investors: InvestorProfile[]
): Promise<Buffer> {
  const wb = new ExcelJS.Workbook();
  wb.creator = "Byte7 Admin";
  wb.created = new Date();
  const sheet = wb.addWorksheet(SHEET_NAME);

  sheet.columns = COLUMNS.map((c) => ({
    header: c.header,
    key: c.key,
    width: c.width
  }));
  sheet.getRow(1).font = { bold: true };
  sheet.getRow(1).alignment = { vertical: "middle" };

  const nameById = new Map(investors.map((i) => [i.id, i.fullName]));
  const sorted = [...statements].sort((a, b) => {
    const byInv = (nameById.get(a.investorId) ?? a.investorId).localeCompare(
      nameById.get(b.investorId) ?? b.investorId
    );
    if (byInv !== 0) return byInv;
    return a.month.localeCompare(b.month);
  });

  for (const s of sorted) {
    sheet.addRow({
      investorId: s.investorId,
      investorName: nameById.get(s.investorId) ?? "—",
      month: s.month,
      invested: s.invested,
      ratePct: Math.round(s.rate * 1e6) / 1e4, // 0.06 → 6 (2 casas úteis)
      balance: s.balance,
      note: s.note ?? ""
    });
  }

  sheet.getColumn("invested").numFmt = "#,##0.00";
  sheet.getColumn("balance").numFmt = "#,##0.00";
  sheet.getColumn("ratePct").numFmt = "0.00";
  sheet.getColumn("investorId").alignment = { horizontal: "left" };
  sheet.getColumn("month").alignment = { horizontal: "center" };

  const buf = await wb.xlsx.writeBuffer();
  return Buffer.from(buf);
}

export interface ParsedRow {
  /** 1-based index da linha no Excel (inclui o header em 1) */
  rowNumber: number;
  investorId: string;
  month: string;
  invested: number;
  rate: number; // fração — 0.06
  balance: number;
  note?: string;
}

export interface ParseError {
  rowNumber: number;
  reason: string;
}

export interface ParseResult {
  rows: ParsedRow[];
  errors: ParseError[];
}

const MONTH_RE = /^\d{4}-(0[1-9]|1[0-2])$/;

function cellString(cell: ExcelJS.Cell): string {
  const v = cell.value;
  if (v === null || v === undefined) return "";
  if (typeof v === "string") return v.trim();
  if (typeof v === "number") return String(v);
  if (v instanceof Date) {
    // Data em célula com mês formatado — converte para YYYY-MM.
    const y = v.getUTCFullYear();
    const m = String(v.getUTCMonth() + 1).padStart(2, "0");
    return `${y}-${m}`;
  }
  if (typeof v === "object" && "text" in v) {
    const t = (v as { text: string }).text;
    return typeof t === "string" ? t.trim() : "";
  }
  return String(v).trim();
}

function cellNumber(cell: ExcelJS.Cell): number | null {
  const v = cell.value;
  if (v === null || v === undefined || v === "") return null;
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const normalized = v.replace(/\./g, "").replace(",", ".").trim();
    const n = Number(normalized);
    return Number.isFinite(n) ? n : null;
  }
  if (typeof v === "object" && "result" in v) {
    const r = (v as { result: unknown }).result;
    return typeof r === "number" ? r : null;
  }
  return null;
}

export async function parseStatementsWorkbook(
  buffer: Buffer
): Promise<ParseResult> {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(buffer);
  const sheet = wb.worksheets[0];
  if (!sheet) {
    return {
      rows: [],
      errors: [{ rowNumber: 0, reason: "Planilha vazia." }]
    };
  }

  const rows: ParsedRow[] = [];
  const errors: ParseError[] = [];

  sheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber === 1) return; // skip header
    const investorId = cellString(row.getCell(1));
    const month = cellString(row.getCell(3));
    const invested = cellNumber(row.getCell(4));
    const ratePct = cellNumber(row.getCell(5));
    const balance = cellNumber(row.getCell(6));
    const noteRaw = cellString(row.getCell(7));

    if (!investorId) {
      errors.push({ rowNumber, reason: "ID Investidor vazio." });
      return;
    }
    if (!MONTH_RE.test(month)) {
      errors.push({
        rowNumber,
        reason: `Mês inválido: "${month}" (esperado YYYY-MM).`
      });
      return;
    }
    if (invested === null || invested < 0) {
      errors.push({
        rowNumber,
        reason: "Investido deve ser número ≥ 0."
      });
      return;
    }
    if (ratePct === null) {
      errors.push({
        rowNumber,
        reason: "Taxa do mês (%) obrigatória."
      });
      return;
    }
    if (balance === null || balance < 0) {
      errors.push({
        rowNumber,
        reason: "Saldo deve ser número ≥ 0."
      });
      return;
    }
    rows.push({
      rowNumber,
      investorId,
      month,
      invested,
      rate: ratePct / 100,
      balance,
      note: noteRaw || undefined
    });
  });

  // Detecta duplicatas (mesmo investidor+mês) dentro do próprio arquivo.
  const seen = new Map<string, number>();
  const dedupedRows: ParsedRow[] = [];
  for (const r of rows) {
    const key = `${r.investorId}|${r.month}`;
    const prev = seen.get(key);
    if (prev !== undefined) {
      errors.push({
        rowNumber: r.rowNumber,
        reason: `Linha duplicada de (${r.investorId}, ${r.month}); já aparece em L${prev}.`
      });
      continue;
    }
    seen.set(key, r.rowNumber);
    dedupedRows.push(r);
  }

  return { rows: dedupedRows, errors };
}

export interface RowOutcome {
  rowNumber: number;
  investorId: string;
  month: string;
  outcome: "created" | "superseded" | "unchanged" | "error";
  message?: string;
  newStatementId?: string;
  supersededStatementId?: string;
}

export interface ImportSummary {
  total: number;
  created: number;
  superseded: number;
  unchanged: number;
  errors: number;
  outcomes: RowOutcome[];
  parseErrors: ParseError[];
}
