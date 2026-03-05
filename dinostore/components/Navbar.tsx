"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import Cart from "./Cart";
import { useAppStore } from "@/store/useAppStore"; // Adjust import path if needed

export default function Navbar() {
  const router = useRouter();

  const { isLoggedIn, isAdmin, checkAuth, logout } = useAppStore();

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

          {/* FACILITY MAINFRAME BUTTON (Admins Only) */}
          {isLoggedIn && isAdmin && (
            <Link
              href="/admin"
              className="hidden sm:flex items-center gap-2 text-sm font-black text-amber-500 hover:text-amber-400 transition-colors border border-amber-900/30 px-4 py-2 rounded-xl hover:bg-amber-500/10"
            >
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
              MAINFRAME
            </Link>
          )}

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