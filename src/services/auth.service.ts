import type { AuthUser, LoginPayload } from "@/types/auth";
import { apiRequest } from "./api-client";

export const authService = {
  loginInvestor(payload: LoginPayload): Promise<AuthUser> {
    return apiRequest<AuthUser>("/api/auth/investor", {
      method: "POST",
      body: payload
    });
  },
  loginAdmin(payload: LoginPayload): Promise<AuthUser> {
    return apiRequest<AuthUser>("/api/auth/admin", {
      method: "POST",
      body: payload
    });
  },
  logout(): Promise<void> {
    return apiRequest("/api/auth/logout", { method: "POST" });
  },
  me(): Promise<AuthUser | null> {
    return apiRequest<AuthUser | null>("/api/auth/me");
  }
};
