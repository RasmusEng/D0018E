// store/useAppStore.ts
import { create } from 'zustand';


interface AppState {
  cartUpdateTrigger: number;
  triggerCartRefresh: () => void;
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
  checkAuth: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  cartUpdateTrigger: 0,
  triggerCartRefresh: () => set((state) => ({ cartUpdateTrigger: state.cartUpdateTrigger + 1 })),
  isLoggedIn: false,
  login: () => set({ isLoggedIn: true }),
  logout: () => {
    localStorage.removeItem("access_token");
    set({ isLoggedIn: false });
  },
  checkAuth: () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem("access_token") : null;
    set({ isLoggedIn: !!token });
  }
}));