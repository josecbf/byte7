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
          Onde propósito, tecnologia e fé caminham juntos.
        </h1>
        <p className="mt-4 text-lg text-ink-600">
          Desde 2022, a COOPERGAC nasceu com um propósito maior: unir pessoas,
          propósitos e tecnologias sustentáveis sob a direção de um chamado que
          transcende o mercado. Atuamos como cooperativa de geração distribuída
          de energia solar, eletromobilidade e sustentabilidade — um organismo
          vivo de fé, inovação e responsabilidade socioambiental.
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
                Da posição de cada cooperado disponível para consulta em tempo real no portal.
              </p>
            </CardBody>
          </Card>
        </div>

        <div className="mt-16 prose-coopergac">
          <h2>Trajetória</h2>
          <p>
            Inspirada pelo princípio bíblico de que &quot;todas as coisas
            cooperam para o bem daqueles que amam a Deus&quot;, a COOPERGAC é
            formada pelas iniciais de seus sócios fundadores: profissionais
            comprometidos com o avanço da energia solar, da eletromobilidade
            e da sustentabilidade.
          </p>
          <p>
            Cada projeto, cada usina, cada economia gerada aos clientes é fruto
            da cooperação, da visão compartilhada e do trabalho alinhado com
            valores eternos. Atuamos para levar energia limpa, acessível e
            compartilhada, promovendo liberdade energética e construindo um
            legado sustentável para as próximas gerações.
          </p>

          <h2>Posicionamento</h2>
          <p>
            Atuamos sob três princípios claros: <strong>ativos reais</strong>,{" "}
            <strong>transparência operacional</strong> e{" "}
            <strong>rigor na execução</strong>. A presente versão
            demonstrativa já reflete esses princípios — mesmo em ambiente de
            avaliação, tratamos o produto como parte indissociável do
            relacionamento institucional com o cooperado.
          </p>
        </div>
      </Container>
    </section>
  );
}
