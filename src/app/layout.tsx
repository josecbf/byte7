import type { Metadata } from "next";
import { DemoBanner } from "@/components/layout/DemoBanner";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "COOPERGAC — Solar Energy (Demo)",
    template: "%s · COOPERGAC Demo"
  },
  description:
    "Demo institucional + portal do investidor da COOPERGAC, cooperativa de energia solar. Energia que une, fé que move, futuro que transforma. Versão de demonstração, apenas para consulta.",
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
      <body>
        <DemoBanner />
        {children}
      </body>
    </html>
  );
}
