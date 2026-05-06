export interface ApiError {
  message: string;
  code: string;
}

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
}
