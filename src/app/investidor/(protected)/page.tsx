import { Wallet, TrendingUp, BarChart3, Percent } from "lucide-react";
import {
  MOCK_APORTES,
  buildDashboardSummary,
  buildMonthlyEvolution
} from "@/mocks/investor";
import { MOCK_USINAS } from "@/mocks/usinas";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { KpiCard } from "@/components/investor/KpiCard";
import { EvolutionChart } from "@/components/investor/EvolutionChart";
import { AportesTable } from "@/components/investor/AportesTable";
import { UsinasMapClient } from "@/components/investor/UsinasMapClient";
import { UsinaStatusBadge } from "@/components/investor/UsinaBadge";
import { Alert } from "@/components/ui/Alert";
import { formatBRL, formatDate, formatPct } from "@/lib/format";

export const dynamic = "force-dynamic";

export default function InvestorDashboardPage() {
  const summary = buildDashboardSummary();
  const evolution = buildMonthlyEvolution();
  const aportes = MOCK_APORTES;
  const usinas = MOCK_USINAS;
  const usinasVinculadas = Array.from(
    new Set(aportes.map((a) => a.usinaId))
  ).length;

  return (
    <div className="space-y-8 max-w-6xl">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-ink-900 tracking-tight">
            Seu dashboard
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            Consulta consolidada da sua posição. Investidor desde{" "}
            {formatDate(summary.since)}.
          </p>
        </div>
      </header>

      <Alert tone="info">
        Você está na <strong>versão demo</strong>: nenhuma movimentação
        financeira pode ser realizada. Todos os valores são ilustrativos.
      </Alert>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Total investido"
          value={formatBRL(summary.totalInvested)}
          hint={`${summary.aportesCount} aportes registrados`}
          icon={Wallet}
        />
        <KpiCard
          label="Saldo consolidado"
          value={formatBRL(summary.consolidatedBalance)}
          hint="Bruto acumulado com rendimento"
          icon={BarChart3}
          tone="brand"
        />
        <KpiCard
          label="Rendimento acumulado"
          value={formatBRL(summary.accumulatedYield)}
          hint="Saldo − Total investido"
          icon={TrendingUp}
        />
        <KpiCard
          label="Rendimento contratado"
          value={`${formatPct(summary.monthlyYieldRate)} a.m.`}
          hint="Parâmetro da demo"
          icon={Percent}
          tone="brand"
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Evolução mensal</CardTitle>
            <span className="text-xs text-ink-500">
              Saldo consolidado × total investido
            </span>
          </CardHeader>
          <CardBody>
            <EvolutionChart data={evolution} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumo</CardTitle>
          </CardHeader>
          <CardBody className="space-y-3 text-sm">
            <Row label="Usinas vinculadas" value={`${usinasVinculadas} de ${usinas.length}`} />
            <Row label="Primeiro aporte" value={formatDate(summary.since)} />
            <Row label="Total de aportes" value={String(summary.aportesCount)} />
            <Row label="Bruto investido" value={formatBRL(summary.totalInvested)} />
            <Row label="Rendimento acumulado" value={formatBRL(summary.accumulatedYield)} />
            <div className="border-t border-ink-100 pt-3 flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-ink-500">
                Saldo consolidado
              </span>
              <span className="font-semibold tabular-nums text-brand-700">
                {formatBRL(summary.consolidatedBalance)}
              </span>
            </div>
          </CardBody>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Últimos aportes</CardTitle>
          </CardHeader>
          <CardBody>
            <AportesTable aportes={aportes} />
          </CardBody>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Usinas vinculadas</CardTitle>
          </CardHeader>
          <CardBody className="space-y-3">
            {usinas.map((u) => (
              <div
                key={u.id}
                className="flex items-center justify-between rounded-md border border-ink-100 bg-ink-50/50 px-3 py-2"
              >
                <div>
                  <p className="text-sm font-medium text-ink-900">{u.name}</p>
                  <p className="text-xs text-ink-500">
                    {u.city}/{u.state} · {u.capacityMwp.toFixed(1)} MWp
                  </p>
                </div>
                <UsinaStatusBadge status={u.status} />
              </div>
            ))}
          </CardBody>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle>Mapa das usinas</CardTitle>
            <span className="text-xs text-ink-500">
              Arraste para navegar · zoom pelos controles
            </span>
          </CardHeader>
          <CardBody>
            <div className="h-[420px] w-full overflow-hidden rounded-xl">
              <UsinasMapClient usinas={usinas} />
            </div>
          </CardBody>
        </Card>
      </section>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-ink-500">{label}</span>
      <span className="font-medium text-ink-900 tabular-nums">{value}</span>
    </div>
  );
}
