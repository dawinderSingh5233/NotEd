export interface IsAutenticatedResponse {
  authenticated: boolean;
  reason: string;
  statusCode: number;
}

export interface LoginResponse {
  statusCode: number;
  token?: string;
  userId?: string;
  message?: string;
  data?: string;
}

export interface SignupResponse {
  statusCode: number;
  message: string;
  userId?: string;
  data?: string;
}
