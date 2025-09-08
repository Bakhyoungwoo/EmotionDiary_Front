export interface UserInfo {
  id: string;
  email: string;
  // 필요한 경우 phone, aud, app_metadata 등 확장 가능
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: UserInfo;
}

// 회원가입 응답 = AuthResponse
export type SignupResponse = AuthResponse;

// 로그인 응답 = AuthResponse
export type LoginResponse = AuthResponse;

// 토큰 갱신 응답 = AuthResponse
export type RefreshResponse = AuthResponse;

// 로그아웃 응답 (Supabase는 보통 빈 객체 반환)
export interface LogoutResponse {
  [key: string]: any; // 혹시 서버에서 message를 내려줄 수도 있으니 유연하게
}
