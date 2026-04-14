import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { UsinasMapClient } from "@/components/investor/UsinasMapClient";
import { UsinaStatusBadge } from "@/components/investor/UsinaBadge";
import { MOCK_USINAS } from "@/mocks/usinas";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default function UsinasPage() {
  const usinas = MOCK_USINAS;
  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-ink-900 tracking-tight">
          Usinas
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          Todas as usinas do portfólio vinculadas ao seu contrato.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mapa</CardTitle>
        </CardHeader>
        <CardBody>
          <div className="h-[440px] w-full overflow-hidden rounded-xl">
            <UsinasMapClient usinas={usinas} />
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de usinas</CardTitle>
        </CardHeader>
        <CardBody>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-ink-500 border-b border-ink-200">
                  <th className="py-2 pr-4 font-medium">Nome</th>
                  <th className="py-2 pr-4 font-medium">Cidade/UF</th>
                  <th className="py-2 pr-4 font-medium text-right">Capacidade</th>
                  <th className="py-2 pr-4 font-medium">Início de operação</th>
                  <th className="py-2 pr-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {usinas.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b last:border-b-0 border-ink-100"
                  >
                    <td className="py-3 pr-4 font-medium text-ink-900">{u.name}</td>
                    <td className="py-3 pr-4 text-ink-700">
                      {u.city}/{u.state}
                    </td>
                    <td className="py-3 pr-4 text-right tabular-nums text-ink-900">
                      {u.capacityMwp.toFixed(1)} MWp
                    </td>
                    <td className="py-3 pr-4 text-ink-700">
                      {u.startedAt ? formatDate(u.startedAt) : "—"}
                    </td>
                    <td className="py-3 pr-4">
                      <UsinaStatusBadge status={u.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
