"use client";

import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import type { Usina } from "@/types/investor";
import L from "leaflet";

/**
 * Workaround para os ícones padrão do Leaflet funcionarem com bundlers
 * (os assets default apontam para caminhos relativos que quebram fora
 * do `node_modules`). Usamos as URLs oficiais servidas via CDN.
 */
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export function UsinasMap({ usinas }: { usinas: Usina[] }) {
  const center: [number, number] = usinas.length
    ? [
        usinas.reduce((s, u) => s + u.lat, 0) / usinas.length,
        usinas.reduce((s, u) => s + u.lng, 0) / usinas.length
      ]
    : [-10, -45];
  return (
    <MapContainer
      center={center}
      zoom={5}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%", borderRadius: 12 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {usinas.map((u) => (
        <Marker key={u.id} position={[u.lat, u.lng]} icon={defaultIcon}>
          <Popup>
            <div className="text-sm">
              <p className="font-semibold text-ink-900">{u.name}</p>
              <p className="text-ink-600">
                {u.city} / {u.state}
              </p>
              <p className="text-ink-600">
                Capacidade: {u.capacityMwp.toFixed(1)} MWp
              </p>
              <p className="mt-1 text-xs uppercase tracking-wider text-brand-700">
                {u.status}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default UsinasMap;
