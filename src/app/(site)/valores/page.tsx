import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Card, CardBody } from "@/components/ui/Card";
import { Compass, Heart, ShieldCheck, Target, Users, Leaf } from "lucide-react";

export const metadata: Metadata = { title: "Valores" };

const VALORES = [
  {
    icon: ShieldCheck,
    title: "Transparência operacional",
    body: "A posição do investidor precisa ser integralmente consultável. Aportes, usinas vinculadas, evolução mensal e contrato são apresentados em tempo real, sem intermediação manual."
  },
  {
    icon: Leaf,
    title: "Capital aplicado a geração real",
    body: "A plataforma direciona recursos para ativos de geração solar no Brasil. Transição energética é tese de longo prazo — e exige estrutura operacional sólida para se materializar."
  },
  {
    icon: Target,
    title: "Simplicidade estrutural",
    body: "Rejeitamos complexidade desnecessária. Processos, cláusulas e interfaces são desenhados para serem compreensíveis, auditáveis e replicáveis."
  },
  {
    icon: Users,
    title: "Relacionamento institucional",
    body: "Cada investidor é tratado como parceiro de longo prazo. Informação clara, resposta tempestiva e compromisso contratual são não-negociáveis."
  },
  {
    icon: Compass,
    title: "Governança e aderência regulatória",
    body: "Operamos sob os padrões de diligência, compliance e reporte exigidos pelo setor de energia e pelo mercado de capitais brasileiro."
  },
  {
    icon: Heart,
    title: "Produto como instrumento institucional",
    body: "A plataforma é a principal materialização da relação com o investidor. É construída com o mesmo padrão técnico de produtos financeiros consolidados."
  }
];

export default function ValoresPage() {
  return (
    <section className="py-16">
      <Container>
        <p className="text-sm uppercase tracking-wider text-brand-700 font-medium">
          Missão, visão e valores
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-ink-900 max-w-3xl">
          Os compromissos institucionais que orientam a Byte7.
        </h1>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-brand-600 border-brand-700">
            <CardBody className="space-y-3 text-white">
              <p className="text-xs uppercase tracking-wider text-brand-100">Missão</p>
              <p className="text-lg font-semibold leading-snug">
                Estruturar a participação de investidores em ativos reais de geração de energia de forma simples, transparente e auditável.
              </p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="space-y-3">
              <p className="text-xs uppercase tracking-wider text-ink-500">Visão</p>
              <p className="text-lg font-semibold text-ink-900 leading-snug">
                Consolidar-se como plataforma de referência em intermediação tokenizada de energia no mercado brasileiro.
              </p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="space-y-3">
              <p className="text-xs uppercase tracking-wider text-ink-500">Compromisso</p>
              <p className="text-lg font-semibold text-ink-900 leading-snug">
                Assegurar ao investidor acesso integral às informações de sua posição, com rigor contratual em cada etapa.
              </p>
            </CardBody>
          </Card>
        </div>

        <h2 className="mt-16 text-2xl font-semibold text-ink-900">Princípios</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {VALORES.map(({ icon: Icon, title, body }) => (
            <Card key={title}>
              <CardBody className="space-y-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100 text-brand-700">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="text-lg font-semibold text-ink-900">{title}</h3>
                <p className="text-sm text-ink-600">{body}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
