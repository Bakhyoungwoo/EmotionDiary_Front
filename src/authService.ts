import API from "./api";
import {
  SignupResponse,
  LoginResponse,
  RefreshResponse,
  LogoutResponse,
} from "./types";

export async function signup(email: string, password: string): Promise<SignupResponse> {
  const res = await API.post<SignupResponse>("/signup", { email, password });
  return res.data;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const res = await API.post<LoginResponse>("/login", { email, password });
  return res.data;
}

export async function refreshToken(refresh_token: string): Promise<RefreshResponse> {
  const res = await API.post<RefreshResponse>("/refresh", { refresh_token });
  return res.data;
}

export async function logout(refresh_token: string): Promise<LogoutResponse> {
  const res = await API.post<LogoutResponse>("/logout", { refresh_token });
  return res.data;
}
