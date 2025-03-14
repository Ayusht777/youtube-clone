import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserData } from "../types";

interface AuthState {
  user: UserData | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  login(data: UserData): void;
  logout(): void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null,
      login: (data: UserData) =>
        set({
          user: data,
          isAuthenticated: true,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        }),
      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          accessToken: null,
          refreshToken: null,
        }),
    }),
    {
      name: "auth-storage",
    }
  )
);
