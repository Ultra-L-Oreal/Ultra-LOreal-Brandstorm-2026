// src/pages/auth/GuestCheckout.tsx
//minimal guest checkout (phone-only)
import React, { useState } from 'react';
import { createUser } from '../../services/api/authApi';
import { useNavigate } from 'react-router-dom';

export default function GuestCheckout() {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function normalizePhone(raw: string) {
    let s = raw.trim().replace(/[^\d+]/g, '');
    if (!s.startsWith('+')) s = '+254' + s.replace(/^0+/, '');
    return s;
  }

  async function handleGuest(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!phone) { setError('Enter phone'); return; }
    if (!accepted) { setError('Accept consent'); return; }

    setLoading(true);
    try {
      const normalized = normalizePhone(phone);
      const res = await createUser({ phone: normalized, guest: true, privacyAccepted: accepted });
      if (!res.ok) { setError(res.message || 'Failed'); setLoading(false); return; }
      // mark as guest user (no token)
      localStorage.setItem('ultra_guest_user', JSON.stringify({ id: res.user?.id, phone: res.user?.phone }));
      navigate('/guest/checkout-success');
    } catch (err) {
        console.error(err);
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-900">
      <div className="w-full max-w-md bg-neutral-900/60 border border-neutral-800 p-8 rounded-xl">
        <h3 className="text-white font-serif text-2xl mb-2">Quick Try — Guest</h3>
        <p className="text-neutral-400 mb-4">Order a demo kit with minimal info. We’ll ask for safety flags before dispatch.</p>

        <form onSubmit={handleGuest} className="space-y-4">
          <input className="w-full px-4 py-2 rounded bg-neutral-800 border border-neutral-700 text-white" placeholder="712 345 678" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <label className="flex items-start gap-2 text-sm text-neutral-300">
            <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} className="mt-1" />
            <span>I confirm I have no history of severe fragrance anaphylaxis and consent to safety screening.</span>
          </label>

          {error && <div className="text-red-400 text-sm">{error}</div>}

          <button className="w-full bg-ultraGold text-black py-2 rounded font-semibold" disabled={loading}>
            {loading ? 'Processing...' : 'Order Demo Kit'}
          </button>
        </form>
      </div>
    </div>
  );
}
