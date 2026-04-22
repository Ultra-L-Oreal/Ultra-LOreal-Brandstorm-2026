// src/pages/auth/VerifyOtp.tsx
// verify OTP page
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OtpInput from '../../components/auth/OtpInput';
import { verifyOtp } from '../../services/api/authApi';
import api from '../../services/api/httpClient';
import useAuthContext from '../../context/useAuthContext';

export default function VerifyOtp() {
  const navigate = useNavigate();
  const auth = useAuthContext();
  const pendingPhone = localStorage.getItem('pendingPhone');
  const pendingEmail = localStorage.getItem('pendingEmail');
  const contact = pendingPhone || pendingEmail || '';
  const isPhone = Boolean(pendingPhone);

  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState<number>(0);
  const [attemptsLeft, setAttemptsLeft] = useState<number>(5);

  const [deviceFingerprint] = useState(() => {
    const key = 'ultra_fp';
    const existing = localStorage.getItem(key);
    if (existing) return existing;
    const uid = (typeof crypto !== 'undefined' && (crypto as any).randomUUID) ? (crypto as any).randomUUID() : `fp_${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(key, uid);
    return uid;
  });

  useEffect(() => {
    if (!contact) {
      // fallback to register
      setTimeout(() => navigate('/auth/register'), 800);
    }
    // start resend cooldown small if navigated freshly
    setResendCooldown(0);
  }, [contact, navigate]);

  useEffect(() => {
    let t: any;
    if (resendCooldown > 0) {
      t = setTimeout(() => setResendCooldown((s) => Math.max(0, s - 1)), 1000);
    }
    return () => clearTimeout(t);
  }, [resendCooldown]);

  async function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setError(null);
    const code = digits.join('');
    if (isPhone && code.length !== 6) { setError('Enter the 6-digit code'); return; }
    setLoading(true);
    try {
      const body = isPhone ? { phone: contact, code, deviceFingerprint } : { email: contact, code, deviceFingerprint };
      const resp = await verifyOtp(body);
      if (!resp.ok) {
        setAttemptsLeft((a) => Math.max(0, a - 1));
        setError(resp.message || 'Verification failed');
        setLoading(false);
        return;
      }
      // set token + user in auth
      if (resp.token) api.setAccessToken(resp.token);
      auth.setAuth({ token: resp.token ?? null, user: resp.user ?? null });
      // cleanup
      localStorage.removeItem('pendingPhone');
      localStorage.removeItem('pendingEmail');

      // redirect to Safety Passport or next step
      navigate('/onboarding/safety', { replace: true });
    } catch (err: any) {
      setError(err?.message || 'Network error');
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (resendCooldown > 0) return;
    try {
      setResendCooldown(60);
      const payload = isPhone ? { phone: contact, mode: 'phone' } : { email: contact, mode: 'email' };
      await fetch(`${import.meta.env.VITE_API_URL || ''}/v1/auth/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.warn('resend failed', err);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-neutral-900 to-[#070607]">
      <div className="w-full max-w-lg bg-neutral-900/70 border border-neutral-800 p-8 rounded-2xl">
        <div className="text-center mb-6">
          <div className="text-ultraGold font-serif text-2xl">Verify</div>
          <p className="text-neutral-400 mt-2">Enter the 6-digit code sent to <strong className="text-white">{contact}</strong></p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <OtpInput value={digits} setValue={setDigits} />

          {error && <div className="text-sm text-red-400">{error}</div>}

          <div className="flex gap-3">
            <button type="submit" className="flex-1 px-6 py-3 bg-ultraGold text-black rounded-md font-semibold" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify'}
            </button>
            <button type="button" className="px-4 py-3 border border-neutral-700 text-neutral-300 rounded-md" onClick={() => navigate('/auth/register')}>Edit</button>
          </div>

          <div className="flex items-center justify-between text-sm text-neutral-500">
            <div>Attempts left: {attemptsLeft}</div>
            <div>
              <button className="text-ultraGold" type="button" onClick={handleResend} disabled={resendCooldown > 0}>
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
