import API from "./api";
import {
  SignupResponse,
  LoginResponse,
  RefreshResponse,
  LogoutResponse,
} from "./types";

// 회원가입
export async function signup(
  email: string,
  password: string
): Promise<SignupResponse> {
  try {
    const res = await API.post<SignupResponse>("/user/signup", {
      email,
      password,
    });
    return res.data;
  } catch (err: any) {
    console.error("❌ Signup Error:", err.response?.data || err.message);
    throw err;
  }
}

// 로그인
export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  try {
    const res = await API.post<LoginResponse>("/user/login", {
      email,
      password,
    });
    return res.data;
  } catch (err: any) {
    console.error("❌ Login Error:", err.response?.data || err.message);
    throw err;
  }
}

// 토큰 갱신
export async function refreshToken(
  refresh_token: string
): Promise<RefreshResponse> {
  try {
    const res = await API.post<RefreshResponse>("/user/refresh", {
      refresh_token,
    });
    return res.data;
  } catch (err: any) {
    console.error("❌ Refresh Token Error:", err.response?.data || err.message);
    throw err;
  }
}

// 로그아웃
export async function logout(
  access_token: string,
  refresh_token: string
): Promise<LogoutResponse> {
  try {
    const res = await API.post<LogoutResponse>(
      "/user/logout",
      { refresh_token },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return res.data;
  } catch (err: any) {
    console.error("❌ Logout Error:", err.response?.data || err.message);
    throw err;
  }
}

// 현재 로그인 유저 확인
export async function getCurrentUser(access_token: string) {
  try {
    const res = await API.get("/user/me", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return res.data;
  } catch (err: any) {
    console.error("❌ GetCurrentUser Error:", err.response?.data || err.message);
    throw err;
  }
}
