import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Card, CardBody } from "@/components/ui/Card";
import { Compass, Heart, ShieldCheck, Target, Users, Leaf } from "lucide-react";

export const metadata: Metadata = { title: "Valores" };

const VALORES = [
  {
    icon: ShieldCheck,
    title: "Transparência operacional",
    body: "A posição do cooperado precisa ser integralmente consultável. Aportes, usinas vinculadas, evolução mensal e contrato são apresentados em tempo real, sem intermediação manual."
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
    title: "Cooperação como cultura",
    body: "Cada cooperado é tratado como parceiro de longo prazo. Informação clara, resposta tempestiva e compromisso contratual são não-negociáveis."
  },
  {
    icon: Compass,
    title: "Governança e aderência regulatória",
    body: "Operamos sob os padrões de diligência, compliance e reporte exigidos pelo setor de energia, no amparo da Lei 14.300 (Marco Legal da Geração Distribuída)."
  },
  {
    icon: Heart,
    title: "Fé que move, futuro que transforma",
    body: "A plataforma é a principal materialização da relação com o cooperado. É construída com o mesmo padrão técnico de produtos financeiros consolidados, alinhada com valores eternos."
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
          Os compromissos institucionais que orientam a COOPERGAC.
        </h1>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-brand-700 border-brand-800">
            <CardBody className="space-y-3 text-white">
              <p className="text-xs uppercase tracking-wider text-accent-200">Missão</p>
              <p className="text-lg font-semibold leading-snug">
                Levar energia limpa, acessível e compartilhada, promovendo
                liberdade energética por meio da cooperação e da fé.
              </p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="space-y-3">
              <p className="text-xs uppercase tracking-wider text-ink-500">Visão</p>
              <p className="text-lg font-semibold text-ink-900 leading-snug">
                Construir um legado sustentável de geração distribuída,
                eletromobilidade e responsabilidade socioambiental para as
                próximas gerações.
              </p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="space-y-3">
              <p className="text-xs uppercase tracking-wider text-ink-500">Compromisso</p>
              <p className="text-lg font-semibold text-ink-900 leading-snug">
                Assegurar ao cooperado acesso integral às informações de sua
                posição, com rigor contratual em cada etapa.
              </p>
            </CardBody>
          </Card>
        </div>

        <h2 className="mt-16 text-2xl font-semibold text-ink-900">Princípios</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {VALORES.map(({ icon: Icon, title, body }) => (
            <Card key={title}>
              <CardBody className="space-y-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent-100 text-brand-700">
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
