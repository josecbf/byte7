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
          Intermediação institucional entre capital e geração de energia.
        </h1>
        <p className="mt-4 text-lg text-ink-600">
          A Byte7 atua como plataforma de intermediação tokenizada de ativos
          de energia solar fotovoltaica no Brasil. Nossa operação combina
          engenharia de ativos reais, estruturação contratual e tecnologia
          proprietária para oferecer ao investidor um ambiente íntegro,
          transparente e auditável.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <Card>
            <CardBody>
              <p className="text-3xl font-bold text-brand-700">+20 MWp</p>
              <p className="mt-2 text-sm text-ink-600">
                Capacidade combinada instalada e em construção no portfólio atual.
              </p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <p className="text-3xl font-bold text-brand-700">5 usinas</p>
              <p className="mt-2 text-sm text-ink-600">
                Distribuídas entre Nordeste e Centro-Oeste, entre operação, construção e planejamento.
              </p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <p className="text-3xl font-bold text-brand-700">100%</p>
              <p className="mt-2 text-sm text-ink-600">
                Da posição de cada investidor disponível para consulta em tempo real no portal.
              </p>
            </CardBody>
          </Card>
        </div>

        <div className="mt-16 prose-byte7">
          <h2>Trajetória</h2>
          <p>
            A Byte7 nasceu da convergência entre expertise operacional em
            geração solar e capacidade de engenharia de software. A partir de
            operações próprias em Petrolina e Juazeiro, estruturamos a camada
            de intermediação que hoje permite a participação tokenizada de
            investidores em ativos reais de energia.
          </p>
          <p>
            Desde a concepção, o desenho da plataforma priorizou três
            requisitos institucionais: aderência regulatória, rastreabilidade
            contratual integral e uma experiência de consulta compatível com
            os padrões mais exigentes do mercado financeiro.
          </p>

          <h2>Posicionamento</h2>
          <p>
            Atuamos sob três princípios claros: <strong>ativos reais</strong>,{" "}
            <strong>transparência operacional</strong> e{" "}
            <strong>rigor na execução</strong>. A presente versão
            demonstrativa já reflete esses princípios — mesmo em ambiente de
            avaliação, tratamos o produto como parte indissociável do
            relacionamento institucional com o investidor.
          </p>
        </div>
      </Container>
    </section>
  );
}
