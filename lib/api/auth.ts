import axios from "axios";
import { apiClient, getApiBaseUrl } from "@/lib/api/client";

export type LoginProvider = "GOOGLE" | "KAKAO" | "NAVER";

export type DevLoginRequest = {
  provider: LoginProvider;
  provider_id: string;
  nickname: string;
  picture?: string;
  email?: string;
};

export type DevLoginResponse = {
  access_token: string;
  expires_in: string;
};

export type SocialLoginProvider = Lowercase<LoginProvider>;

export async function socialLogin(provider: SocialLoginProvider) {
  window.location.href = `${getApiBaseUrl()}oauth2/authorization/${provider}`;
}

export async function devLogin(payload: DevLoginRequest) {
  const { data } = await apiClient.post<DevLoginResponse>("/dev/auth/login", payload);
  return data;
}

export async function reissue() {
  const { data } = await axios.post<DevLoginResponse>(`${getApiBaseUrl()}auth/reissue`, null, {
    withCredentials: true,
  });
  return data;
}

export async function logout() {
  await apiClient.post("/auth/logout");
}
