import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Byte7 — Tokenização de Energia (Demo)",
    template: "%s · Byte7 Demo"
  },
  description:
    "Demo institucional + portal do investidor da Byte7, plataforma de intermediação de tokenização de energia. Versão de demonstração, apenas para consulta.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  )
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
