import {create} from "zustand";
import { persist } from "zustand/middleware";
const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      loginUser: (userData) => set({ user: userData, isAuthenticated: true }),
      logoutUser: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: "auth" }
  )
);
export default useAuthStore;