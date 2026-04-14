import type {
  Aporte,
  Contract,
  DashboardSummary,
  MonthlyEvolutionPoint,
  Usina
} from "@/types/investor";
import { apiRequest } from "./api-client";

export interface DashboardResponse {
  summary: DashboardSummary;
  aportes: Aporte[];
  evolution: MonthlyEvolutionPoint[];
  usinas: Usina[];
}

export const investorService = {
  dashboard(): Promise<DashboardResponse> {
    return apiRequest<DashboardResponse>("/api/investor/dashboard");
  },
  aportes(): Promise<Aporte[]> {
    return apiRequest<Aporte[]>("/api/investor/aportes");
  },
  usinas(): Promise<Usina[]> {
    return apiRequest<Usina[]>("/api/investor/usinas");
  },
  contract(): Promise<Contract> {
    return apiRequest<Contract>("/api/investor/contrato");
  }
};
