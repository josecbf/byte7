"use client";

import dynamic from "next/dynamic";
import type { Usina } from "@/types/investor";

/**
 * Leaflet depende de `window`; por isso carregamos o mapa sem SSR.
 */
const Map = dynamic(() => import("./UsinasMap").then((m) => m.UsinasMap), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center rounded-xl border border-dashed border-ink-200 bg-ink-50 text-sm text-ink-500">
      Carregando mapa…
    </div>
  )
});

export function UsinasMapClient({ usinas }: { usinas: Usina[] }) {
  return <Map usinas={usinas} />;
}
