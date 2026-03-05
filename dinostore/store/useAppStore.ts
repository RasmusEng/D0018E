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
  userId: number | null; // 1. ADDED THIS
  login: (token: string) => void; 
  logout: () => void;
  checkAuth: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  cartUpdateTrigger: 0,
  triggerCartRefresh: () => set((state) => ({ cartUpdateTrigger: state.cartUpdateTrigger + 1 })),
  
  isLoggedIn: false,
  isAdmin: false,
  userId: null, // 2. INITIALIZED THIS

  login: (token: string) => {
    localStorage.setItem("access_token", token);
    const decoded = parseJwt(token);
    
    const isAdminStatus = decoded?.is_administrator === true;
    const currentUserId = decoded?.sub ? parseInt(decoded.sub, 10) : null;
    
    if (currentUserId !== null) {
      localStorage.setItem("user_id", currentUserId.toString());
    }
    
    // 3. MUST SET userId HERE
    set({ isLoggedIn: true, isAdmin: isAdminStatus, userId: currentUserId });
  },

  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_id"); // 4. ALWAYS CLEAR ON LOGOUT
    set({ isLoggedIn: false, isAdmin: false, userId: null });
  },

  checkAuth: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem("access_token");
      if (token) {
        const decoded = parseJwt(token);
        const isAdminStatus = decoded?.is_administrator === true;
        const currentUserId = decoded?.sub ? parseInt(decoded.sub, 10) : null;
        
        // 5. MUST SET userId HERE TOO
        set({ isLoggedIn: true, isAdmin: isAdminStatus, userId: currentUserId });
      } else {
        set({ isLoggedIn: false, isAdmin: false, userId: null });
      }
    }
  }
}));