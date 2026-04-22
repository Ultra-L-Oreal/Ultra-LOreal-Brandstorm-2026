// frontend/src/services/api/httpClient.ts
//axios wrapper with token helpers
import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  withCredentials: true, // allow refresh cookie if backend uses it
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// token in memory
let accessToken: string | null = null;

export function setAccessToken(token: string) {
  accessToken = token;
  axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
}

export function clearAccessToken() {
  accessToken = null;
  delete axiosInstance.defaults.headers.common.Authorization;
}

// Optional interceptor
axiosInstance.interceptors.request.use((config) => {
  if (accessToken && config.headers) {
    // ensure Authorization header is set at runtime
    // headers is a loose object at runtime so this is safe
    // TypeScript checks are removed at compile time
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Clean API wrapper
/**
 * httpClient - typed wrapper around axios
 */
const api = {
  get: async <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const res = await axiosInstance.get<T>(url, config);
    return res.data;
  },

  post: async <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    const res = await axiosInstance.post<T>(url, data, config);
    return res.data;
  },

  put: async <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    const res = await axiosInstance.put<T>(url, data, config);
    return res.data;
  },

  delete: async <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const res = await axiosInstance.delete<T>(url, config);
    return res.data;
  },

  // expose raw axios instance
  raw: axiosInstance,

  // Attach helpers to the default export so callers using api.setAccessToken() work
  setAccessToken,
  clearAccessToken,
};

// example interceptor for auth token if you add auth later
/*http.interceptors.request.use((config) => {
  // const token = localStorage.getItem('auth_token')
  // if (token) config.headers.Authorization = `Bearer ${token}`
  return config;
});*/

export default api;
