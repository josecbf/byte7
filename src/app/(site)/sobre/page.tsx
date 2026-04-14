import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Card, CardBody } from "@/components/ui/Card";

export const metadata: Metadata = { title: "Sobre nós" };

export default function SobrePage() {
  return (
    <section className="py-16">
      <Container className="max-w-4xl">
        <p className="text-sm uppercase tracking-wider text-brand-700 font-medium">
          Sobre nós
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-ink-900">
          Conectamos capital a geração de energia real.
        </h1>
        <p className="mt-4 text-lg text-ink-600">
          A Byte7 nasceu do encontro entre engenharia de energia e engenharia
          de software. Nosso objetivo é simplificar a participação de
          investidores em ativos reais de geração solar no Brasil por meio de
          um modelo de tokenização transparente e auditável.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <Card>
            <CardBody>
              <p className="text-3xl font-bold text-brand-700">+20 MWp</p>
              <p className="mt-2 text-sm text-ink-600">
                Capacidade combinada no portfólio atual (operando + construção).
              </p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <p className="text-3xl font-bold text-brand-700">5 usinas</p>
              <p className="mt-2 text-sm text-ink-600">
                Entre operantes, em construção e planejadas — todas no Nordeste e Centro-Oeste.
              </p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <p className="text-3xl font-bold text-brand-700">100%</p>
              <p className="mt-2 text-sm text-ink-600">
                Das posições do investidor consultáveis em tempo real no portal.
              </p>
            </CardBody>
          </Card>
        </div>

        <div className="mt-16 prose-byte7">
          <h2>Nossa história</h2>
          <p>
            Em uma indústria tradicionalmente burocrática, a Byte7 foi fundada
            com a convicção de que o investidor merece clareza. Começamos
            operando usinas solares em Petrolina e Juazeiro, e rapidamente
            percebemos que o gargalo não era técnico — era de informação.
          </p>
          <p>
            A partir disso, desenvolvemos a camada de intermediação
            tokenizada que torna a participação do investidor simples de
            acompanhar, sem abrir mão do rigor contratual e regulatório que
            a operação exige.
          </p>

          <h2>Como pensamos</h2>
          <p>
            Combinamos três princípios simples: <strong>ativos reais</strong>,
            <strong> transparência radical</strong> e <strong>produto bem
            feito</strong>. A demo que você está navegando já reflete essa
            mentalidade — mesmo em fase de protótipo, tratamos o produto como
            parte do relacionamento.
          </p>
        </div>
      </Container>
    </section>
  );
}
