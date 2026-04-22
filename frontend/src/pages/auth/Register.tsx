// src/pages/auth/Register.tsx
//register via phone/email page
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestOtp } from '../../services/api/authApi';
import PrivacyConsent from '../../components/auth/PrivacyConsent';

export default function Register() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'phone' | 'email'>('phone');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accepted, setAccepted] = useState(false);
  const contactRef = useRef<HTMLInputElement | null>(null);

  function normalizePhone(raw: string) {
    let s = String(raw).trim();
    s = s.replace(/[^\d+]/g, '');
    if (!s.startsWith('+')) s = '+254' + s.replace(/^0+/, '');
    return s;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!accepted) {
      setError('Please accept the privacy & safety consent');
      return;
    }

    if (mode === 'phone') {
      if (!phone) { setError('Enter your phone'); contactRef.current?.focus(); return; }
      const normalized = normalizePhone(phone);
      setLoading(true);
      try {
        await requestOtp({ phone: normalized, mode: 'phone' });
        localStorage.setItem('pendingPhone', normalized);
        navigate('/auth/verify-otp');
      } catch (err: any) {
        setError(err?.message || 'Unable to request code');
      } finally { setLoading(false); }
    } else {
      if (!email) { setError('Enter your email'); contactRef.current?.focus(); return; }
      setLoading(true);
      try {
        await requestOtp({ email, mode: 'email' });
        localStorage.setItem('pendingEmail', email);
        navigate('/auth/verify-otp');
      } catch (err: any) {
        setError(err?.message || 'Unable to request email');
      } finally { setLoading(false); }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-neutral-900 to-[#070607]">
      <div className="w-full max-w-xl bg-neutral-900/70 border border-neutral-800 p-8 rounded-2xl shadow-xl">
        <div className="mb-6 text-center">
          <div className="text-ultraGold font-serif text-3xl">ULTRA</div>
          <p className="text-neutral-400 mt-2">Quick concierge sign up — phone or email</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex gap-3 justify-center">
            <button type="button" className={`px-4 py-2 rounded ${mode === 'phone' ? 'bg-ultraGold text-black' : 'bg-transparent border border-neutral-700 text-neutral-300'}`} onClick={() => setMode('phone')}>Phone</button>
            <button type="button" className={`px-4 py-2 rounded ${mode === 'email' ? 'bg-ultraGold text-black' : 'bg-transparent border border-neutral-700 text-neutral-300'}`} onClick={() => setMode('email')}>Email</button>
          </div>

          {error && <div className="text-sm text-red-400">{error}</div>}

          {mode === 'phone' ? (
            <div>
              <label className="text-sm text-neutral-300">Phone</label>
              <div className="mt-2 flex gap-2">
                <div className="px-3 py-2 rounded bg-neutral-800 border border-neutral-700 text-neutral-200">+254</div>
                <input ref={contactRef} className="flex-1 px-4 py-2 rounded bg-neutral-800 border border-neutral-700 text-white" placeholder="712 345 678" value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" />
              </div>
            </div>
          ) : (
            <div>
              <label className="text-sm text-neutral-300">Email</label>
              <input ref={contactRef} className="w-full mt-2 px-4 py-2 rounded bg-neutral-800 border border-neutral-700 text-white" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
            </div>
          )}

          <PrivacyConsent checked={accepted} onChange={setAccepted} />

          <div className="flex gap-3">
            <button type="submit" className="flex-1 px-6 py-3 bg-ultraGold text-black rounded-md font-semibold" disabled={loading}>
              {loading ? 'Sending code...' : 'Continue'}
            </button>
            <button type="button" className="px-4 py-3 border border-neutral-700 text-neutral-300 rounded-md" onClick={() => navigate('/')}>Cancel</button>
          </div>

          <div className="text-xs text-neutral-500 text-center">
            By continuing you consent to receive a verification token. Standard SMS/email rates may apply.
          </div>
        </form>
      </div>
    </div>
  );
}
