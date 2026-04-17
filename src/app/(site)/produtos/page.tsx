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
    name: "COOPERGAC Solar · Usina de Investimento",
    tag: "Produto principal",
    tone: "brand" as const,
    summary:
      "Adquira um sistema fotovoltaico e veja o retorno do seu investimento todos os meses durante 30 anos. Renda passiva garantida com base em contrato sólido de locação dos equipamentos. Painéis, inversores e estrutura instalados em local visível e monitorado.",
    bullets: [
      "Rendimento contratado de 6% ao mês (parâmetro desta versão demonstrativa)",
      "Posição consultável em tempo real no portal do cooperado",
      "Visualização e emissão de cópia do contrato em um clique",
      "Mapeamento georreferenciado das usinas vinculadas"
    ]
  },
  {
    name: "COOPERGAC Energia · Geração Distribuída",
    tag: "Operações",
    tone: "info" as const,
    summary:
      "Sua conta de energia com até 95% de economia. Operação integral de usinas solares de pequeno e médio porte — da operação e manutenção ao reporte mensal. Energia limpa, com payback médio de 3 a 4 anos e vida útil de 25 anos.",
    bullets: [
      "Monitoramento contínuo da geração",
      "Contratos padronizados e auditados",
      "Amparo na Lei 14.300 (Marco Legal da Geração Distribuída)",
      "Sistema conectado à rede com compensação de créditos de energia"
    ]
  },
  {
    name: "COOPERGAC Mobilidade · Carregadores Elétricos",
    tag: "Em roadmap",
    tone: "warning" as const,
    summary:
      "Energia por assinatura, mercado livre e infraestrutura de carregadores elétricos. Interface pública para parceiros institucionais consumirem posições, indicadores e eventos da plataforma. Prevista para a próxima fase e fora do escopo desta versão demonstrativa.",
    bullets: [
      "Endpoints REST para portfólio e usinas",
      "Webhooks para eventos relevantes",
      "Painéis incorporáveis via iframe/SDK",
      "Disponibilização programada para o pós-demo"
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
          Nosso ecossistema: três camadas integradas, um único propósito.
        </h1>
        <p className="mt-3 text-ink-600 max-w-2xl">
          A COOPERGAC estrutura sua oferta em camadas complementares — usina de
          redução da conta de energia, usina de investimento, energia do mercado
          livre, energia por assinatura e carregadores elétricos. Esta versão
          demonstrativa evidencia o portal do cooperado.
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
              Avalie o produto principal em ambiente demonstrativo.
            </h3>
            <p className="text-sm text-ink-600">
              Acesse o portal do investidor com as credenciais de demonstração para explorar a experiência completa.
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
