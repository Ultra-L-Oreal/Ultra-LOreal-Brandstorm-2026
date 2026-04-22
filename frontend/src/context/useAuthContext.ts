// src/context/useAuthContext.ts
//typed consumer hook
import { useContext } from 'react';
import { AuthContext } from './AuthContext';

export default function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
}
