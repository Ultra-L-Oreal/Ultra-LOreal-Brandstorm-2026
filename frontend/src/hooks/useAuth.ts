// src/hooks/useAuth.ts
//main auth hook
// This keeps tokens in memory via httpClient.setAccessToken and persists only user in localStorage.
import { useCallback, useEffect, useState } from 'react';
import api from '../services/api/httpClient';
//import { refreshToken } from '../services/internal'; // optional, not used below
import type { User } from '../types/auth';

// constants localStorage keys
const STORAGE_USER_KEY = 'ultra_user';

type RefreshResponse = { accessToken?: string; user?: User };
type MeResponse = { user?: User };
type LogoutResponse = { ok?: boolean; message?: string };

export default function useAuth() {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_USER_KEY);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      if (user) localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
      else localStorage.removeItem(STORAGE_USER_KEY);
    } catch (err) {
      console.warn('useAuth: localStorage write failed', err);
    }
  }, [user]);

  // setAuth: accepts token + user
  const setAuth = useCallback(({ token, user: newUser }: { token?: string | null; user?: User | null }) => {
    if (token) {
      api.setAccessToken(token);
    }
    setUser(newUser ?? null);
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await api.post<LogoutResponse>('/v1/auth/logout', {});
    } catch (err) {
      console.warn('logout failed', err);
    } finally {
      api.clearAccessToken();
      setUser(null);
      setLoading(false);
    }
  }, []);

  // simple refresh: call server refresh and set token if returned
  const refresh = useCallback(async (): Promise<string | null> => {
    try {
      const data = await api.post<RefreshResponse>('/v1/auth/refresh', {});
      if (data?.accessToken) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        api.setAccessToken(data.accessToken);
        if (data.user) setUser(data.user);
        return data.accessToken as string;
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      api.clearAccessToken();
      setUser(null);
      return null;
    } catch (err) {
      console.error(err);
      api.clearAccessToken();
      setUser(null);
      return null;
    }
  }, []);

  // checkAuth run once on mount
  const checkAuth = useCallback(async () => {
    setLoading(true);
    try {
      const token = await refresh();
      if (token) {
        // optional: fetch me
        const data = await api.post<MeResponse>('/v1/auth/me');
        if (data?.user) setUser(data.user);
      }
    } catch (err) {
      console.warn('checkAuth error', err);
    } finally {
      setLoading(false);
    }
  }, [refresh]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const isAuthenticated = Boolean(user);

  return { user, setAuth, logout, refresh, isAuthenticated, loading, checkAuth };
}
