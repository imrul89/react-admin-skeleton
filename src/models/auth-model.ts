export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
}

export interface AuthRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
}

export interface ErrorData {
  messages: Array<{
    description: string;
  }>;
}