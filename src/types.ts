export interface SignupResponse {
  message: string;
  user: {
    id: string;
    email: string;
  };
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

export interface RefreshResponse {
  access_token: string;
}

export interface LogoutResponse {
  message: string;
}
