import type { Aporte } from "@/types/investor";
import { formatBRL, formatDate } from "@/lib/format";

export function AportesTable({ aportes }: { aportes: Aporte[] }) {
  if (aportes.length === 0) {
    return (
      <p className="text-sm text-ink-500">Nenhum aporte registrado.</p>
    );
  }
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wider text-ink-500 border-b border-ink-200">
            <th className="py-2 pr-4 font-medium">Referência</th>
            <th className="py-2 pr-4 font-medium">Data</th>
            <th className="py-2 pr-4 font-medium">Usina</th>
            <th className="py-2 pr-4 font-medium text-right">Valor</th>
          </tr>
        </thead>
        <tbody>
          {aportes.map((a) => (
            <tr
              key={a.id}
              className="border-b last:border-b-0 border-ink-100 hover:bg-ink-50/60"
            >
              <td className="py-3 pr-4 font-medium text-ink-900">
                {a.reference}
              </td>
              <td className="py-3 pr-4 text-ink-700">{formatDate(a.date)}</td>
              <td className="py-3 pr-4 text-ink-700">{a.usinaName}</td>
              <td className="py-3 pr-4 text-right font-medium text-ink-900 tabular-nums">
                {formatBRL(a.amount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
