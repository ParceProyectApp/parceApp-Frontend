import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthState, User, LoginCredentials, RegisterCredentials } from '../types/auth.types';
import { api } from '@/lib/api';

interface AuthStore extends AuthState {
    // Acciones 
    setUser: (user: User) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (credentials: RegisterCredentials) => Promise<void>;
    logout: () => void;
    clearError: () => void;
    forgotPassword: (email: string) => Promise<void>;
    resetPassword: (token: string, password: string) => Promise<void>;
    verifyEmail: (token: string, email: string) => Promise<void>;
    resendVerification: (email: string) => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user 
      }),
      
      setLoading: (isLoading) => set({ isLoading }),
      
      setError: (error) => set({ error }),
      
      clearError: () => set({ error: null }),

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });

        try {
          const response = await api.post('/auth/login', credentials);
          
          // El backend envuelve la respuesta en { data: { user, token }, statusCode, message, timestamp }
          if (!response.data || !response.data.user) {
            throw new Error('Respuesta inválida del servidor: no se encontró user en la respuesta');
          }
          
          const user: User = {
            id: response.data.user.id,
            email: response.data.user.email,
            firstName: response.data.user.firstName,
            lastName: response.data.user.lastName,
            role: response.data.user.role as 'ADMIN' | 'OWNER',
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          
          // Guardar token en cookies para que el middleware pueda verificar autenticación
          if (typeof document !== 'undefined') {
            document.cookie = `auth_token=${response.data.token}; path=/; max-age=${7 * 24 * 60 * 60}; secure=${process.env.NODE_ENV === 'production'}; samesite=lax`;
          }
          
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Error al iniciar sesión',
            isLoading: false 
          });
          throw error;
        }
      },

      register: async (credentials: RegisterCredentials) => {
        set({ isLoading: true, error: null });
        
        try {
          const { passwordConfirm, ...registerData } = credentials;
          const response = await api.post('/auth/register', registerData);
          
          // El backend envuelve la respuesta en { data: { user, token }, statusCode, message, timestamp }
          // No autenticar automáticamente si el token es null (requiere verificación de email)
          if (response.data && response.data.token) {
            const user: User = {
              id: response.data.user.id,
              email: response.data.user.email,
              firstName: response.data.user.firstName,
              lastName: response.data.user.lastName,
              role: response.data.user.role as 'ADMIN' | 'OWNER',
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            set({ user, isAuthenticated: true, isLoading: false });
          } else {
            // Requiere verificación de email
            set({ isLoading: false });
          }
          
          return response;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Error al registrarse',
            isLoading: false 
          });
          throw error;
        }
      },

      logout: () => {
        // Eliminar token de cookies
        if (typeof document !== 'undefined') {
          document.cookie = 'auth_token=; path=/; max-age=0';
          document.cookie = 'user_role=; path=/; max-age=0';
        }
        
        set({ 
          user: null, 
          isAuthenticated: false,
          error: null 
        });

        // Redirigir a sign-in para forzar la actualización
        if (typeof window !== 'undefined') {
          window.location.href = '/sign-in';
        }
      },

      forgotPassword: async (email: string) => {
        set({ isLoading: true, error: null });
        
        try {
          await api.post('/auth/forgot-password', { email });
          set({ isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Error al enviar email',
            isLoading: false 
          });
          throw error;
        }
      },

      resetPassword: async (token: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          await api.post('/auth/reset-password', { token, password });
          set({ isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Error al cambiar password',
            isLoading: false 
          });
          throw error;
        }
      },

      verifyEmail: async (token: string, email: string) => {
        set({ isLoading: true, error: null });
        
        try {
          await api.post('/auth/verify-email', { token, email });
          set({ isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Error al verificar email',
            isLoading: false 
          });
          throw error;
        }
      },

      resendVerification: async (email: string) => {
        set({ isLoading: true, error: null });
        
        try {
          await api.post('/auth/resend-verification', { email });
          set({ isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Error al reenviar email',
            isLoading: false 
          });
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);