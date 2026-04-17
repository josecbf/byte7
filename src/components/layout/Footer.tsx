import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-ink-200 bg-white">
      <Container className="py-10 grid gap-8 md:grid-cols-4">
        <div className="md:col-span-2 space-y-3">
          <Logo showTag />
          <p className="text-sm text-ink-600 max-w-sm">
            Cooperativa de geração distribuída de energia solar, eletromobilidade
            e sustentabilidade. Esta é uma <strong>versão demonstrativa</strong>,
            destinada exclusivamente à consulta, sem movimentação financeira.
          </p>
          <p className="text-xs italic text-brand-700/80">
            Energia que une, fé que move, futuro que transforma.
          </p>
        </div>
        <nav className="text-sm">
          <p className="text-xs uppercase tracking-wider text-ink-500 mb-3">
            Navegação
          </p>
          <ul className="space-y-2">
            <li><Link className="text-ink-700 hover:text-brand-700" href="/">Home</Link></li>
            <li><Link className="text-ink-700 hover:text-brand-700" href="/sobre">Sobre nós</Link></li>
            <li><Link className="text-ink-700 hover:text-brand-700" href="/valores">Valores</Link></li>
            <li><Link className="text-ink-700 hover:text-brand-700" href="/produtos">Produtos</Link></li>
            <li><Link className="text-ink-700 hover:text-brand-700" href="/blog">Blog</Link></li>
          </ul>
        </nav>
        <nav className="text-sm">
          <p className="text-xs uppercase tracking-wider text-ink-500 mb-3">
            Acesso
          </p>
          <ul className="space-y-2">
            <li><Link className="text-ink-700 hover:text-brand-700" href="/investidor/login">Portal do investidor</Link></li>
            <li><Link className="text-ink-700 hover:text-brand-700" href="/admin/login">Ambiente administrativo</Link></li>
          </ul>
        </nav>
      </Container>
      <div className="border-t border-ink-200">
        <Container className="py-5 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-ink-500">
          <p>&copy; {new Date().getFullYear()} COOPERGAC Solar Energy. Todos os direitos reservados.</p>
          <p>Versão <strong>demonstrativa</strong> · valores ilustrativos.</p>
        </Container>
      </div>
    </footer>
  );
}
