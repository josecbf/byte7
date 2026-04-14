import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-ink-50 flex items-center">
      <Container className="max-w-lg text-center space-y-6">
        <p className="text-sm uppercase tracking-wider text-brand-700 font-medium">
          Erro 404
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-ink-900">
          Página não encontrada
        </h1>
        <p className="text-ink-600">
          O endereço acessado não existe ou o conteúdo foi removido.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/">
            <Button>Voltar ao site</Button>
          </Link>
          <Link href="/investidor/login">
            <Button variant="outline">Área do investidor</Button>
          </Link>
        </div>
      </Container>
    </div>
  );
}
