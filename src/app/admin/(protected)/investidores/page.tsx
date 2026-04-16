import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { listInvestors } from "@/mocks/investorProfiles";
import { AdminInvestorsTable } from "./AdminInvestorsTable";

export const dynamic = "force-dynamic";

export default function AdminInvestorsPage() {
  const investors = listInvestors();
  const counts = {
    total: investors.length,
    ativos: investors.filter((i) => i.status === "ativo").length,
    pendentes: investors.filter((i) => i.status === "pendente").length,
    inativos: investors.filter((i) => i.status === "inativo").length
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink-900 tracking-tight">
            Investidores
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            Gestão dos cadastros de investidores. Crie, edite ou remova registros.
          </p>
        </div>
        <Link href="/admin/investidores/new">
          <Button>
            <PlusCircle className="h-4 w-4" /> Novo investidor
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <CountCard label="Total" value={counts.total} />
        <CountCard label="Ativos" value={counts.ativos} />
        <CountCard label="Pendentes" value={counts.pendentes} />
        <CountCard label="Inativos" value={counts.inativos} />
      </div>

      <Card>
        <AdminInvestorsTable investors={investors} />
      </Card>
    </div>
  );
}

function CountCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-ink-200 bg-white px-4 py-3 shadow-card">
      <p className="text-xs uppercase tracking-wider text-ink-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums text-ink-900">
        {value}
      </p>
    </div>
  );
}
