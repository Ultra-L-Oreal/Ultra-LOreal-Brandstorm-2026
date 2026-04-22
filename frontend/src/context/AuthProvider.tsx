// src/context/AuthProvider.tsx
import React from 'react';
import useAuth from '../hooks/useAuth';
import { AuthContext } from './AuthContext';

type Props = { children: React.ReactNode };

export function AuthProvider({ children }: Props) {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
