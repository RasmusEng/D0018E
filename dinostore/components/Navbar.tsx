"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import Cart from "./Cart";
import { useAppStore } from "@/store/useAppStore"; // Adjust import path if needed

export default function Navbar() {
  const router = useRouter();
  
  // Hook into our global store
  const { isLoggedIn, checkAuth, logout } = useAppStore();

  // Check auth status on initial load
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl font-bold tracking-tighter text-emerald-600 dark:text-emerald-500 group-hover:italic transition-all">
            DINO<span className="text-zinc-900 dark:text-white">STORE</span>
          </span>
        </Link>

        <div className="flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="hidden hover:text-emerald-600 sm:block transition-colors">
            Catalog
          </Link>

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="hidden sm:block text-sm font-bold text-red-400 hover:text-red-300 transition-colors border border-red-900/30 px-4 py-2 rounded-xl hover:bg-red-500/10"
            >
              LOGOUT
            </button>
          ) : (
            <Link
              href="/login"
              className="hidden sm:block text-sm font-bold text-zinc-400 hover:text-emerald-400 transition-colors border border-zinc-800 px-4 py-2 rounded-xl hover:border-emerald-500/50"
            >
              LOGIN
            </Link>
          )}

          <Cart />
        </div>
      </div>
    </nav>
  );
}