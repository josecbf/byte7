import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardBody } from "@/components/ui/Card";
import {
  ArrowRight,
  BarChart3,
  ShieldCheck,
  Sun,
  Map,
  FileText,
  LineChart
} from "lucide-react";

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-ink-200 bg-gradient-to-b from-white via-brand-50/40 to-white">
        <Container className="py-20 md:py-28 grid gap-10 md:grid-cols-2 items-center">
          <div className="space-y-6">
            <Badge tone="brand">Plataforma institucional Byte7</Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-ink-900">
              Intermediação tokenizada de{" "}
              <span className="text-brand-700">ativos de energia</span>, com rigor e transparência.
            </h1>
            <p className="text-lg text-ink-600 max-w-xl">
              A Byte7 é uma plataforma de intermediação que estrutura a
              participação econômica de investidores em usinas de geração
              solar fotovoltaica no Brasil. Esta versão demonstrativa apresenta
              a camada institucional e o portal de consulta do investidor.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/investidor/login">
                <Button size="lg">
                  Acessar portal do investidor <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/produtos">
                <Button variant="outline" size="lg">
                  Produtos e serviços
                </Button>
              </Link>
            </div>
            <p className="text-xs text-ink-500">
              Ambiente demonstrativo. Valores, usinas e investidores são ilustrativos.
            </p>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-brand-100 via-brand-50 to-white blur-2xl" />
            <Card className="relative">
              <CardBody>
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-wider text-ink-500">
                    Portal do investidor
                  </p>
                  <Badge tone="success">Demonstrativo</Badge>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-4">
                  <Kpi label="Total investido" value="R$ 130.000,00" />
                  <Kpi label="Saldo consolidado" value="R$ 179.482,91" />
                  <Kpi label="Rendimento contratado" value="6% a.m." brand />
                  <Kpi label="Usinas vinculadas" value="4 de 5" />
                </div>
                <div className="mt-5 rounded-lg border border-dashed border-ink-200 bg-ink-50 p-4 text-xs text-ink-500 leading-relaxed">
                  Valores exibidos para fins de demonstração. O portal é destinado
                  exclusivamente à consulta de posição, sem qualquer movimentação financeira.
                </div>
              </CardBody>
            </Card>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container className="space-y-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-ink-900">
              Infraestrutura institucional ponta a ponta.
            </h2>
            <p className="mt-3 text-ink-600">
              Da camada institucional à posição consolidada do investidor, a
              Byte7 oferece um ambiente integrado, auditável e desenhado para
              decisões informadas.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Feature
              icon={Sun}
              title="Vinculação a ativos reais"
              body="Cada posição representa uma participação econômica em usinas solares em operação ou em construção, com rastreabilidade plena."
            />
            <Feature
              icon={LineChart}
              title="Evolução mensal auditável"
              body="Rendimento contratado de 6% ao mês, com composição detalhada mês a mês e histórico completo disponível para consulta."
            />
            <Feature
              icon={Map}
              title="Mapeamento geográfico do portfólio"
              body="Visualização das usinas vinculadas, com status operacional, capacidade instalada e localização georreferenciada."
            />
            <Feature
              icon={FileText}
              title="Contrato acessível"
              body="Cláusulas, partes envolvidas e condições disponíveis em tela, com emissão imediata de cópia em arquivo."
            />
            <Feature
              icon={BarChart3}
              title="Indicadores consolidados"
              body="Total investido, saldo consolidado, rentabilidade e comparativos com referências de mercado em uma única visão."
            />
            <Feature
              icon={ShieldCheck}
              title="Ambiente exclusivamente de consulta"
              body="Nesta fase, a plataforma opera apenas em modo de consulta, sem qualquer execução de movimentação financeira."
            />
          </div>
        </Container>
      </section>

      <section className="py-20 border-t border-ink-200 bg-gradient-to-br from-ink-900 to-ink-800 text-white">
        <Container className="grid gap-8 md:grid-cols-[1fr_auto] items-center">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tight">
              Conheça o ambiente demonstrativo.
            </h2>
            <p className="text-ink-200 max-w-2xl">
              Acesse o portal do investidor com as credenciais demonstrativas
              ou o ambiente administrativo para avaliar os fluxos de gestão de
              cadastros e conteúdo institucional.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/investidor/login">
              <Button size="lg">Portal do investidor</Button>
            </Link>
            <Link href="/admin/login">
              <Button size="lg" variant="outline" className="bg-white/5 text-white border-white/20 hover:bg-white/10">
                Ambiente administrativo
              </Button>
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}

function Kpi({ label, value, brand }: { label: string; value: string; brand?: boolean }) {
  return (
    <div className="rounded-lg border border-ink-100 bg-ink-50/60 p-3">
      <p className="text-[11px] uppercase tracking-wider text-ink-500">{label}</p>
      <p className={`text-lg font-semibold tabular-nums ${brand ? "text-brand-700" : "text-ink-900"}`}>
        {value}
      </p>
    </div>
  );
}

function Feature({
  icon: Icon,
  title,
  body
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
}) {
  return (
    <Card>
      <CardBody className="space-y-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100 text-brand-700">
          <Icon className="h-5 w-5" />
        </span>
        <h3 className="text-lg font-semibold text-ink-900">{title}</h3>
        <p className="text-sm text-ink-600">{body}</p>
      </CardBody>
    </Card>
  );
}
