// src/types/auth.ts
//types used across flow
export interface User {
  id: string;
  phone?: string | null;
  email?: string | null;
  name?: string | null;
  roles?: string[];
  guest?: boolean;
  created_at?: string;
  last_login?: string | null;
}

export interface RequestOtpResult {
  ok: boolean;
  message?: string;
}

export interface VerifyOtpResult {
  ok: boolean;
  token?: string;
  user?: User;
  nextStep?: string;
  message?: string;
}
