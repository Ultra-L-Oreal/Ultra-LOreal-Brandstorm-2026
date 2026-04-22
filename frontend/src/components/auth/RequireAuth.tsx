// src/components/auth/RequireAuth.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthContext from '../../context/useAuthContext';

type RequireAuthProps = {
  children: React.ReactNode;
};

export default function RequireAuth({ children }: RequireAuthProps) {
  const { user, loading } = useAuthContext();
  const location = useLocation();

  // While checking auth (e.g. refresh token)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-900 text-white">
        Checking session...
      </div>
    );
  }

  // If not authenticated → redirect to login
  if (!user) {
    return (
      <Navigate
        to="/auth/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return <>{children}</>;
}
