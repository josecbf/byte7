export type UserRole = "admin" | "editor" | "investor";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Session {
  userId: string;
  role: UserRole;
  name: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}
