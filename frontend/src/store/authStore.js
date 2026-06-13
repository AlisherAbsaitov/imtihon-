import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Auth holati (Zustand + persist).
 * Token va user localStorage'da saqlanadi — sahifa yangilansa ham kirgan holat qoladi.
 */
export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,

      // Login/Register muvaffaqiyatli bo'lganda chaqiriladi
      setAuth: ({ user, token }) => set({ user, token }),

      // Profil yangilanganda foydalanuvchini yangilash
      updateUser: (user) => set({ user }),

      // Chiqish
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'auth-storage', // localStorage kaliti
    }
  )
);

// Yordamchi selector'lar
export const useIsAuth = () => useAuthStore((s) => Boolean(s.token));
export const useIsAdmin = () => useAuthStore((s) => s.user?.role === 'admin');
