import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { KpiCard } from "@/components/investor/KpiCard";
import { AportesTable } from "@/components/investor/AportesTable";
import { MOCK_APORTES } from "@/mocks/investor";
import { Wallet, Hash } from "lucide-react";
import { formatBRL, formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default function AportesPage() {
  const aportes = MOCK_APORTES;
  const total = aportes.reduce((s, a) => s + a.amount, 0);
  const first = [...aportes].sort((a, b) => a.date.localeCompare(b.date))[0];

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-ink-900 tracking-tight">
          Aportes
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          Histórico completo dos aportes registrados no contrato.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard
          label="Total bruto investido"
          value={formatBRL(total)}
          icon={Wallet}
          tone="brand"
        />
        <KpiCard
          label="Aportes"
          value={String(aportes.length)}
          icon={Hash}
        />
        <KpiCard
          label="Primeiro aporte"
          value={first ? formatDate(first.date) : "—"}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todos os aportes</CardTitle>
        </CardHeader>
        <CardBody>
          <AportesTable aportes={aportes} />
        </CardBody>
      </Card>
    </div>
  );
}
