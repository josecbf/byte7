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
            <Badge tone="brand">Plataforma Byte7 · Demo</Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-ink-900">
              Tokenização de energia, com a{" "}
              <span className="text-brand-700">transparência</span> que o investidor precisa.
            </h1>
            <p className="text-lg text-ink-600 max-w-xl">
              A Byte7 conecta investidores a usinas solares reais por meio de um
              modelo de tokenização moderno. Esta demo apresenta o site
              institucional e um portal de consulta para o investidor — sem
              movimentações financeiras.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/investidor/login">
                <Button size="lg">
                  Acessar área do investidor <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/produtos">
                <Button variant="outline" size="lg">
                  Conhecer os produtos
                </Button>
              </Link>
            </div>
            <p className="text-xs text-ink-500">
              Versão demonstrativa · dados ilustrativos · nenhuma movimentação real.
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
                  <Badge tone="success">Ao vivo nesta demo</Badge>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-4">
                  <Kpi label="Total investido" value="R$ 130.000,00" />
                  <Kpi label="Saldo consolidado" value="R$ 179.482,91" />
                  <Kpi label="Rendimento" value="6% a.m." brand />
                  <Kpi label="Usinas vinculadas" value="4 de 5" />
                </div>
                <div className="mt-5 rounded-lg border border-dashed border-ink-200 bg-ink-50 p-4 text-xs text-ink-500 leading-relaxed">
                  Todos os valores acima são fictícios. O portal foi desenhado
                  para consulta — sem aportes, saques ou qualquer movimentação.
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
              Uma plataforma, toda a jornada.
            </h2>
            <p className="mt-3 text-ink-600">
              Da institucional ao dashboard do investidor, a Byte7 entrega o
              ecossistema completo para quem investe e para quem gere usinas.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Feature
              icon={Sun}
              title="Usinas reais, vinculadas ao investidor"
              body="Cada token representa uma fração econômica de usinas solares operantes ou em construção no Brasil."
            />
            <Feature
              icon={LineChart}
              title="Evolução mensal transparente"
              body="Rendimento contratado de 6% a.m. com composição visível mês a mês e gráfico histórico."
            />
            <Feature
              icon={Map}
              title="Mapa das usinas"
              body="Visualize geograficamente onde seu capital está operando — com status e capacidade de cada planta."
            />
            <Feature
              icon={FileText}
              title="Contrato acessível"
              body="Visualize online e baixe uma cópia do seu contrato a qualquer momento, com um clique."
            />
            <Feature
              icon={BarChart3}
              title="KPIs consolidados"
              body="Total investido, saldo consolidado e rendimento acumulado em uma única tela."
            />
            <Feature
              icon={ShieldCheck}
              title="Consulta apenas"
              body="Nesta fase, a plataforma é 100% de consulta. Nenhuma movimentação financeira é executada."
            />
          </div>
        </Container>
      </section>

      <section className="py-20 border-t border-ink-200 bg-gradient-to-br from-ink-900 to-ink-800 text-white">
        <Container className="grid gap-8 md:grid-cols-[1fr_auto] items-center">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tight">
              Pronto para explorar a demo?
            </h2>
            <p className="text-ink-200 max-w-2xl">
              Entre com as credenciais de demonstração para navegar pelo portal
              do investidor — ou acesse o admin do blog para testar o CRUD de
              conteúdo.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/investidor/login">
              <Button size="lg">Área do investidor</Button>
            </Link>
            <Link href="/admin/login">
              <Button size="lg" variant="outline" className="bg-white/5 text-white border-white/20 hover:bg-white/10">
                Admin do blog
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
