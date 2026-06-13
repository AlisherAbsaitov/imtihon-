import axios from 'axios';
import { useAuthStore } from '../store/authStore';

/**
 * Markaziy axios instance.
 * - baseURL .env dan olinadi
 * - request interceptor: har bir so'rovga JWT token qo'shadi
 * - response interceptor: 401 bo'lsa avtomatik logout qiladi
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Token qo'shish
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 401 — token eskirgan/yaroqsiz → logout
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    // Xato xabarini bir joydan qaytaramiz
    const message =
      error.response?.data?.message || error.message || 'Noma\'lum xato';
    return Promise.reject(new Error(message));
  }
);

export default api;
