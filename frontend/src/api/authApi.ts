import { http } from "./http";
import type { LoginRequest, RegisterRequest } from "../types/auth";

export const authApi = {
  login: (request: LoginRequest) => http.post("/auth/login", request),
  register: (request: RegisterRequest) => http.post("/auth/register", request),
  refresh: (refreshToken: string) => http.post("/auth/refresh", { refreshToken })
};
