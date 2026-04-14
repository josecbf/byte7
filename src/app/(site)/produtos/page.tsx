import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ArrowRight, Check } from "lucide-react";

export const metadata: Metadata = { title: "Produtos e Serviços" };

const PRODUTOS = [
  {
    name: "Byte7 Solar · Token Investidor",
    tag: "Principal",
    tone: "brand" as const,
    summary:
      "Participação tokenizada em frações econômicas de usinas solares. O investidor acompanha o ativo real, o rendimento contratado e a posição consolidada pelo portal.",
    bullets: [
      "Rendimento contratado de 6% ao mês (parâmetro desta demo)",
      "Posição consultável 24/7 no portal do investidor",
      "Visualização do contrato e download com um clique",
      "Mapa georreferenciado das usinas vinculadas"
    ]
  },
  {
    name: "Byte7 Gestão de Usinas",
    tag: "Back-office",
    tone: "info" as const,
    summary:
      "Operação ponta a ponta de usinas solares de pequeno e médio porte — da O&M ao reporte mensal. A infraestrutura que sustenta os produtos de investidor.",
    bullets: [
      "Monitoramento em tempo real da geração",
      "Contratos padronizados e auditados",
      "Rotinas de compliance e reporte regulatório",
      "Integração nativa com a plataforma Byte7"
    ]
  },
  {
    name: "Byte7 API & Insights",
    tag: "Roadmap",
    tone: "warning" as const,
    summary:
      "API pública para parceiros consumirem posições e indicadores. Em roadmap para a próxima fase — fora do escopo desta demo.",
    bullets: [
      "Endpoints REST para portfólio e usinas",
      "Webhooks para eventos relevantes",
      "Painéis embedáveis via iframe/SDK",
      "Planejado para pós-demo"
    ]
  }
];

export default function ProdutosPage() {
  return (
    <section className="py-16">
      <Container>
        <p className="text-sm uppercase tracking-wider text-brand-700 font-medium">
          Produtos e serviços
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-ink-900 max-w-3xl">
          Três camadas, um mesmo propósito: energia real, capital acompanhado.
        </h1>
        <p className="mt-3 text-ink-600 max-w-2xl">
          Conheça os produtos da Byte7. Esta demo foca no portal do investidor,
          mas as outras camadas já estão mapeadas no nosso roadmap.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {PRODUTOS.map((p) => (
            <Card key={p.name} className="flex flex-col">
              <CardBody className="flex-1 space-y-4">
                <div className="flex items-center justify-between">
                  <Badge tone={p.tone}>{p.tag}</Badge>
                </div>
                <h3 className="text-lg font-semibold text-ink-900">{p.name}</h3>
                <p className="text-sm text-ink-600">{p.summary}</p>
                <ul className="space-y-2 pt-2">
                  {p.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex items-start gap-2 text-sm text-ink-700"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          ))}
        </div>

        <div className="mt-16 rounded-2xl border border-ink-200 bg-white p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-xl font-semibold text-ink-900">
              Quer ver o produto principal em ação?
            </h3>
            <p className="text-sm text-ink-600">
              Entre na área do investidor com as credenciais de demonstração.
            </p>
          </div>
          <Link href="/investidor/login">
            <Button size="lg">
              Abrir portal do investidor <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}
