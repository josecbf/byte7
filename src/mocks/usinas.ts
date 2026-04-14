import type { Usina } from "@/types/investor";

export const MOCK_USINAS: Usina[] = [
  {
    id: "usn_solar_petrolina",
    name: "UFV Byte7 Petrolina I",
    city: "Petrolina",
    state: "PE",
    capacityMwp: 5.2,
    status: "operando",
    lat: -9.3891,
    lng: -40.5027,
    startedAt: "2024-03-15"
  },
  {
    id: "usn_solar_juazeiro",
    name: "UFV Byte7 Juazeiro II",
    city: "Juazeiro",
    state: "BA",
    capacityMwp: 3.8,
    status: "operando",
    lat: -9.4165,
    lng: -40.4986,
    startedAt: "2024-07-01"
  },
  {
    id: "usn_solar_mossoro",
    name: "UFV Byte7 Mossoró",
    city: "Mossoró",
    state: "RN",
    capacityMwp: 4.5,
    status: "construcao",
    lat: -5.1879,
    lng: -37.3445
  },
  {
    id: "usn_solar_ipora",
    name: "UFV Byte7 Iporá",
    city: "Iporá",
    state: "GO",
    capacityMwp: 2.9,
    status: "operando",
    lat: -16.4402,
    lng: -51.1181,
    startedAt: "2025-01-10"
  },
  {
    id: "usn_solar_barreiras",
    name: "UFV Byte7 Barreiras",
    city: "Barreiras",
    state: "BA",
    capacityMwp: 6.0,
    status: "planejada",
    lat: -12.1527,
    lng: -44.9901
  }
];
