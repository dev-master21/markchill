import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';
import authService from '../services/auth.service';

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  checkAuth: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,
      
      login: async (email: string, password: string) => {
        try {
          const { token, user } = await authService.login({ email, password });
          set({ user, token, isAuthenticated: true });
          
          // Логируем для отладки
          console.log('Login successful, user role:', user.role);
        } catch (error) {
          throw error;
        }
      },
      
      register: async (data: any) => {
        try {
          const { token, user } = await authService.register(data);
          set({ user, token, isAuthenticated: true });
        } catch (error) {
          throw error;
        }
      },
      
      logout: () => {
        authService.logout();
        set({ user: null, token: null, isAuthenticated: false });
      },
      
      updateProfile: async (data: Partial<User>) => {
        try {
          const user = await authService.updateProfile(data);
          set({ user });
        } catch (error) {
          throw error;
        }
      },
      
      refreshUserData: async () => {
        try {
          const token = localStorage.getItem('token');
          if (token) {
            const user = await authService.getProfile();
            set({ user });
            console.log('User data refreshed, role:', user.role);
          }
        } catch (error) {
          console.error('Failed to refresh user data:', error);
          // Если токен невалидный, выходим
          get().logout();
        }
      },
      
      checkAuth: async () => {
        const token = localStorage.getItem('token');
        
        if (token) {
          try {
            // Загружаем актуальные данные пользователя с сервера
            const user = await authService.getProfile();
            set({ user, token, isAuthenticated: true, isLoading: false });
            console.log('Auth check successful, user role:', user.role);
          } catch (error) {
            console.error('Auth check failed:', error);
            // Если токен невалидный, очищаем
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            set({ user: null, token: null, isAuthenticated: false, isLoading: false });
          }
        } else {
          set({ isLoading: false });
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      })
    }
  )
);