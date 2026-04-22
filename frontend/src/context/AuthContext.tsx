// src/context/AuthContext.tsx
//typed context
import React from 'react';
import type { User } from '../types/auth';

export type AuthContextType = {
  user: User | null;
  setAuth: (payload: { token?: string | null; user?: User | null }) => void;
  logout: () => Promise<void>;
  refresh: () => Promise<string | null>;
  isAuthenticated: boolean;
  loading: boolean;
};

export const AuthContext = React.createContext<AuthContextType | null>(null);
