import { create } from 'zustand';

const parseJwt = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

interface AppState {
  cartUpdateTrigger: number;
  triggerCartRefresh: () => void;
  isLoggedIn: boolean;
  isAdmin: boolean;
  login: (token: string) => void; 
  logout: () => void;
  checkAuth: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  cartUpdateTrigger: 0,
  triggerCartRefresh: () => set((state) => ({ cartUpdateTrigger: state.cartUpdateTrigger + 1 })),
  
  isLoggedIn: false,
  isAdmin: false,

  login: (token: string) => {
    localStorage.setItem("access_token", token);
    const decoded = parseJwt(token);
    
    // MATCHES YOUR FLASK BACKEND EXACTLY
    const isAdminStatus = decoded?.is_administrator === true || false;
    
    set({ isLoggedIn: true, isAdmin: isAdminStatus });
  },

  logout: () => {
    localStorage.removeItem("access_token");
    set({ isLoggedIn: false, isAdmin: false });
  },

  checkAuth: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem("access_token");
      if (token) {
        const decoded = parseJwt(token);
        // MATCHES YOUR FLASK BACKEND EXACTLY
        const isAdminStatus = decoded?.is_administrator === true || false;
        
        set({ isLoggedIn: true, isAdmin: isAdminStatus });
      } else {
        set({ isLoggedIn: false, isAdmin: false });
      }
    }
  }
}));