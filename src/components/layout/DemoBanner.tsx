/**
 * Barra discreta renderizada em todas as páginas (via root layout)
 * informando que a plataforma está em modo demonstrativo.
 * Flui com a página (não é sticky) para não competir visualmente com
 * navbars/sidebars das áreas autenticadas.
 */
export function DemoBanner() {
  return (
    <div className="w-full border-b border-ink-800 bg-ink-900 text-ink-200 text-[11px] tracking-wide py-1.5 px-4 text-center">
      <span className="inline-flex items-center gap-2">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-400" />
        Versão demonstrativa · conteúdos e valores ilustrativos, sem movimentação financeira.
      </span>
    </div>
  );
}
