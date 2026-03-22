import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  user: { email: string } | null;
  token: string | null;
  login: (data: { email: string; token: string }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,

      login: ({ email, token }) =>
        set({
          user: { email },
          token,
        }),

      logout: () =>
        set({
          user: null,
          token: null,
        }),
    }),
    {
      name: "africonnect-auth",
    }
  )
);