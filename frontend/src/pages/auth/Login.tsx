//frontend/src/pages/auth/Login.tsx
// src/pages/auth/Login.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../services/api/httpClient';
import useAuthContext from '../../context/useAuthContext';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuthContext();
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const state = location.state as { from?: { pathname?: string } } | null;
  //const from = (location.state as any)?.from?.pathname || '/dashboard';
  const from = state?.from?.pathname ?? '/dashboard';
  /*const from =
  typeof location.state === 'object' &&
  location.state !== null &&
  'from' in location.state &&
  typeof (location.state as { from?: { pathname?: string } }).from?.pathname === 'string'
    ? (location.state as { from?: { pathname?: string } }).from?.pathname
    : '/dashboard';*/
    
  // If user already logged in, redirect them
  useEffect(() => {
    if (auth?.user) navigate(from, { replace: true });
  }, [auth, from, navigate]);

  async function handleRequestOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      // Normalise simple input so user can paste +254... or local 07... etc if you want
      const payload = phoneOrEmail.includes('@') ? { email: phoneOrEmail } : { phone: phoneOrEmail };
      await api.post('/v1/auth/request-otp', payload);
      if (!payload.phone && payload.email) {
        localStorage.setItem('pendingEmail', payload.email as string);
      } else if (payload.phone) {
        localStorage.setItem('pendingPhone', payload.phone as string);
      }
      navigate('/auth/verify-otp');
    } catch (err) {
      console.error('Request OTP failed', err);
      // optionally show friendly UI error
      alert('Unable to send code. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-900">
      <div className="w-full max-w-md bg-neutral-900/60 border border-neutral-800 p-8 rounded-xl">
        <h2 className="text-ultraGold font-serif text-2xl mb-3">Welcome back</h2>
        <p className="text-neutral-400 mb-4">Sign in with your phone or email to access your profile and orders</p>

        <form onSubmit={handleRequestOtp} className="space-y-4">
          <input
            value={phoneOrEmail}
            onChange={(e) => setPhoneOrEmail(e.target.value)}
            placeholder="+2547xxxxxxx or email"
            className="w-full px-4 py-2 rounded bg-neutral-800 border border-neutral-700 text-white"
            autoComplete="username"
          />
          <button className="w-full bg-ultraGold text-black py-2 rounded font-semibold" disabled={loading}>
            {loading ? 'Sending...' : 'Send code'}
          </button>
        </form>
      </div>
    </div>
  );
}


/* Login (/auth/login): OTP-based login. After login, default redirect to /dashboard. 
If user arrived from a protected route (e.g., started order), store from location and 
redirect there after login.
use location.state.from when redirecting to login, and after successful login navigate back.*/