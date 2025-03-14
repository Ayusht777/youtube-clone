import { UserData } from "@/types";

export const AUTH_STORAGE_KEY = "auth_data";

export const authStorage = {
  setAuth: (data: UserData) => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
  },

  getAuth: (): UserData | null => {
    const data = localStorage.getItem(AUTH_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  },

  clearAuth: () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(AUTH_STORAGE_KEY);
  },
};
