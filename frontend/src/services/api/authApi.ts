// src/services/api/authApi.ts
//auth endpoints
// Adjust endpoints /v1/... if backend uses different paths.
import api from './httpClient';
import type { RequestOtpResult, VerifyOtpResult, User } from '../../types/auth';

export async function requestOtp(payload: { phone?: string; email?: string; recaptchaToken?: string; mode: 'phone' | 'email' }) : Promise<RequestOtpResult> {
  return api.post('/v1/auth/request-otp', payload);
}

export async function verifyOtp(payload: { phone?: string; email?: string; code?: string; deviceFingerprint?: string; recaptchaToken?: string }) : Promise<VerifyOtpResult> {
  return api.post('/v1/auth/verify-otp', payload);
}

// create user (optional profile completion)
export async function createUser(payload: { name?: string; email?: string; phone?: string; guest?: boolean; privacyAccepted?: boolean }) : Promise<{ ok: boolean; user?: User; message?: string; }> {
  return api.post('/v1/users', payload);
}
