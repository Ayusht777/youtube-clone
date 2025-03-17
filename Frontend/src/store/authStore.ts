import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/api/userApi";
import {
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
} from "@/api/userApi";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshTokenApi: () => Promise<void>;
  verifyAuth: () => Promise<void>;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await loginUser({ email, password });
          set({
            user: {
              id: response.id,
              username: response.username,
              fullname: response.fullname,
              email: response.email,
              avatar: response.avatar,
              coverImage: response.coverImage,
            },
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: ApiError) {
          set({
            error: error.response?.data?.message || "Login failed",
            isLoading: false,
          });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await logoutUser();
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        } catch (error: ApiError) {
          set({
            error: error.response?.data?.message || "Logout failed",
            isLoading: false,
          });
          throw error;
        }
      },

      refreshTokenApi: async () => {
        set({ isLoading: true });
        try {
          const response = await refreshAccessToken();
          set({
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            isLoading: false,
          });
        } catch (error: ApiError) {
          set({
            error: error.response?.data?.message || "Token refresh failed",
            isLoading: false,
            isAuthenticated: false,
            user: null,
            accessToken: null,
            refreshToken: null,
          });
          throw error;
        }
      },

      verifyAuth: async () => {
        set({ isLoading: true });
        try {
          const { accessToken, refreshToken } = get();
          if (!accessToken && refreshToken) {
            await get().refreshTokenApi();
          }
          if (accessToken) {
            const user = await getCurrentUser();
            set({
              user,
              isAuthenticated: true,
              isLoading: false,
            });
          }
        } catch (error) {
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },
    }),
    {
      name: "auth-storage", // Persist to localStorage
    }
  )
);
