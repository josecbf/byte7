import { BarChart3, LineChart, Percent, TrendingUp, Users, Wallet } from "lucide-react";
import {
  MOCK_APORTES,
  buildChartEvolution,
  buildComparative,
  buildDashboardSummary,
  computeByte7ReturnRate
} from "@/mocks/investor";
import { listInvestors } from "@/mocks/investorProfiles";
import { MOCK_USINAS } from "@/mocks/usinas";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { KpiCard } from "@/components/investor/KpiCard";
import { EvolutionChart } from "@/components/investor/EvolutionChart";
import { ComparativeTable } from "@/components/investor/ComparativeTable";
import { AportesTable } from "@/components/investor/AportesTable";
import { InvestorStatusBadge } from "@/components/investor/InvestorStatusBadge";
import { InvestorSelector } from "@/components/admin/InvestorSelector";
import { formatBRL, formatDate, formatPct } from "@/lib/format";

export const dynamic = "force-dynamic";

export default function AdminDashboardPage({
  searchParams
}: {
  searchParams?: { investor?: string };
}) {
  const investors = listInvestors();
  const selectedId = searchParams?.investor ?? "all";
  const selectedProfile =
    selectedId === "all"
      ? null
      : investors.find((i) => i.id === selectedId) ?? null;

  const isAll = selectedId === "all";
  const aportes = isAll
    ? MOCK_APORTES
    : MOCK_APORTES.filter((a) => a.investorId === selectedId);

  const summary = buildDashboardSummary(aportes);
  const returnRate = computeByte7ReturnRate(aportes);
  const chartData = buildChartEvolution(aportes);
  const comparative = buildComparative(aportes);

  const usinaIds = Array.from(new Set(aportes.map((a) => a.usinaId)));
  const usinasVinculadas = MOCK_USINAS.filter((u) => usinaIds.includes(u.id));

  const contribCount = aportes.length;
  const activeInvestors = isAll
    ? new Set(MOCK_APORTES.map((a) => a.investorId)).size
    : 1;

  return (
    <div className="space-y-8 max-w-6xl">
      <header className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink-900 tracking-tight">
            Resultados
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            {isAll
              ? "Visão consolidada da base de investidores. Use o seletor ao lado para analisar um investidor específico."
              : `Visão individual: ${selectedProfile?.fullName ?? "—"}.`}
          </p>
        </div>
        <div className="flex flex-col items-start lg:items-end gap-1.5">
          <span className="text-xs uppercase tracking-wider text-ink-500">
            Visualizando
          </span>
          <InvestorSelector
            investors={investors.map((i) => ({
              id: i.id,
              fullName: i.fullName,
              status: i.status
            }))}
          />
        </div>
      </header>

      {selectedProfile ? (
        <Card>
          <CardBody className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-ink-900">
                  {selectedProfile.fullName}
                </h2>
                <InvestorStatusBadge status={selectedProfile.status} />
              </div>
              <p className="text-sm text-ink-600">
                {selectedProfile.email} · {selectedProfile.phone}
              </p>
              <p className="text-xs text-ink-500">
                {selectedProfile.document} · {selectedProfile.city}/
                {selectedProfile.state} · cadastrado em{" "}
                {formatDate(selectedProfile.createdAt)}
              </p>
            </div>
            {selectedProfile.notes ? (
              <p className="text-xs text-ink-600 max-w-md md:text-right">
                {selectedProfile.notes}
              </p>
            ) : null}
          </CardBody>
        </Card>
      ) : null}

      {aportes.length === 0 ? (
        <Alert tone="warning">
          {selectedProfile
            ? `${selectedProfile.fullName} ainda não possui aportes registrados.`
            : "Nenhum aporte registrado na base."}
        </Alert>
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            <KpiCard
              label={isAll ? "Investidores com posição" : "Investidor"}
              value={isAll ? String(activeInvestors) : "1"}
              hint={isAll ? `de ${investors.length} cadastrados` : undefined}
              icon={Users}
            />
            <KpiCard
              label="Total investido"
              value={formatBRL(summary.totalInvested)}
              hint={`${contribCount} aportes`}
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
              label="Rentabilidade (%)"
              value={formatPct(returnRate)}
              hint="Retorno total sobre o investido"
              icon={LineChart}
              tone="brand"
            />
          </section>

          <section className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Evolução mensal</CardTitle>
                <span className="text-xs text-ink-500">
                  Byte7 × CDI × Ibovespa · mesma escala de saldo acumulado
                </span>
              </CardHeader>
              <CardBody>
                <EvolutionChart data={chartData} />
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resumo</CardTitle>
              </CardHeader>
              <CardBody className="space-y-3 text-sm">
                <Row
                  label={isAll ? "Aportes (base)" : "Aportes do investidor"}
                  value={String(contribCount)}
                />
                <Row label="Primeiro aporte" value={formatDate(summary.since)} />
                <Row
                  label="Bruto investido"
                  value={formatBRL(summary.totalInvested)}
                />
                <Row
                  label="Rendimento acumulado"
                  value={formatBRL(summary.accumulatedYield)}
                />
                <Row label="Rentabilidade" value={formatPct(returnRate)} />
                <Row
                  label="Rendimento contratado"
                  value={`${formatPct(summary.monthlyYieldRate)} a.m.`}
                />
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

          <section>
            <Card>
              <CardHeader>
                <CardTitle>Comparativo mensal</CardTitle>
                <span className="text-xs text-ink-500">
                  Rendimento (%) mês a mês por referência
                </span>
              </CardHeader>
              <CardBody>
                <ComparativeTable
                  rows={comparative.rows}
                  totals={comparative.totals}
                />
              </CardBody>
            </Card>
          </section>

          <section className="grid gap-6 lg:grid-cols-5">
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Aportes</CardTitle>
                <span className="text-xs text-ink-500">
                  {isAll
                    ? "Todos os aportes da base"
                    : "Aportes do investidor selecionado"}
                </span>
              </CardHeader>
              <CardBody>
                <AportesTable aportes={aportes} />
              </CardBody>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Usinas vinculadas</CardTitle>
                <Badge tone="neutral">{usinasVinculadas.length}</Badge>
              </CardHeader>
              <CardBody className="space-y-2">
                {usinasVinculadas.length === 0 ? (
                  <p className="text-sm text-ink-500">
                    Nenhuma usina vinculada ainda.
                  </p>
                ) : (
                  usinasVinculadas.map((u) => (
                    <div
                      key={u.id}
                      className="flex items-center justify-between rounded-md border border-ink-100 bg-ink-50/50 px-3 py-2"
                    >
                      <div>
                        <p className="text-sm font-medium text-ink-900">
                          {u.name}
                        </p>
                        <p className="text-xs text-ink-500">
                          {u.city}/{u.state} · {u.capacityMwp.toFixed(1)} MWp
                        </p>
                      </div>
                      <Badge
                        tone={
                          u.status === "operando"
                            ? "success"
                            : u.status === "construcao"
                            ? "warning"
                            : "info"
                        }
                      >
                        {u.status}
                      </Badge>
                    </div>
                  ))
                )}
              </CardBody>
            </Card>
          </section>
        </>
      )}
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
