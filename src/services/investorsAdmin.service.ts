import type {
  InvestorProfile,
  InvestorProfileInput,
  InvestorProfileStatus
} from "@/types/investorProfile";
import { apiRequest } from "./api-client";

/**
 * API pública (UI ↔ backend) para o CRUD administrativo de cadastros
 * de investidores. Em modo demo aponta para as route handlers internas.
 * Para produção, setar NEXT_PUBLIC_DATA_SOURCE=api + base URL.
 */
export const investorsAdminService = {
  list(filter?: { status?: InvestorProfileStatus }): Promise<InvestorProfile[]> {
    const qs = filter?.status ? `?status=${filter.status}` : "";
    return apiRequest<InvestorProfile[]>(`/api/investors${qs}`);
  },
  getById(id: string): Promise<InvestorProfile> {
    return apiRequest<InvestorProfile>(`/api/investors/${encodeURIComponent(id)}`);
  },
  create(input: InvestorProfileInput): Promise<InvestorProfile> {
    return apiRequest<InvestorProfile>(`/api/investors`, {
      method: "POST",
      body: input
    });
  },
  update(
    id: string,
    input: Partial<InvestorProfileInput>
  ): Promise<InvestorProfile> {
    return apiRequest<InvestorProfile>(
      `/api/investors/${encodeURIComponent(id)}`,
      { method: "PUT", body: input }
    );
  },
  remove(id: string): Promise<void> {
    return apiRequest(`/api/investors/${encodeURIComponent(id)}`, {
      method: "DELETE"
    });
  }
};
