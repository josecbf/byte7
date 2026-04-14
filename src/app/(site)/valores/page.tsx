import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Card, CardBody } from "@/components/ui/Card";
import { Compass, Heart, ShieldCheck, Target, Users, Leaf } from "lucide-react";

export const metadata: Metadata = { title: "Valores" };

const VALORES = [
  {
    icon: ShieldCheck,
    title: "Transparência radical",
    body: "Se o investidor não consegue conferir, não existe. Toda posição, usina, rendimento e contrato precisa ser consultável a qualquer momento."
  },
  {
    icon: Leaf,
    title: "Energia limpa que rende de verdade",
    body: "Acreditamos que o futuro energético do país passa por quem investe nele. Nosso papel é simplificar essa ponte, com ativos reais."
  },
  {
    icon: Target,
    title: "Foco no que importa",
    body: "Não criamos complexidade onde não há. Preferimos um produto simples e correto a um produto grande e confuso."
  },
  {
    icon: Users,
    title: "Relacionamento de longo prazo",
    body: "Investidor não é lead. É parceiro. Todo ponto de contato é pensado para construir confiança ao longo do tempo."
  },
  {
    icon: Compass,
    title: "Governança e rigor",
    body: "Operamos com o cuidado regulatório e contratual que o setor de energia exige, sem transferir atrito para o investidor."
  },
  {
    icon: Heart,
    title: "Produto como canal",
    body: "A plataforma é a face mais visível da empresa. Ela é construída com padrão de fintech, não com padrão de portal."
  }
];

export default function ValoresPage() {
  return (
    <section className="py-16">
      <Container>
        <p className="text-sm uppercase tracking-wider text-brand-700 font-medium">
          Nossos valores
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-ink-900 max-w-3xl">
          O que move a Byte7 — e o que o investidor pode nos cobrar.
        </h1>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-brand-600 border-brand-700">
            <CardBody className="space-y-3 text-white">
              <p className="text-xs uppercase tracking-wider text-brand-100">Missão</p>
              <p className="text-lg font-semibold leading-snug">
                Tornar a participação em ativos reais de energia simples, transparente e auditável para todo investidor.
              </p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="space-y-3">
              <p className="text-xs uppercase tracking-wider text-ink-500">Visão</p>
              <p className="text-lg font-semibold text-ink-900 leading-snug">
                Ser a plataforma de referência em intermediação tokenizada de energia no Brasil até o fim da década.
              </p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="space-y-3">
              <p className="text-xs uppercase tracking-wider text-ink-500">Compromisso</p>
              <p className="text-lg font-semibold text-ink-900 leading-snug">
                Tratar cada investidor como parceiro de longo prazo, com acesso integral às informações e rigor contratual em cada passo.
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
