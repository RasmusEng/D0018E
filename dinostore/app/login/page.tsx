"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AuthPage() {
  // Use the proxy path defined in next.config.mjs
  const API_BASE_URL = "/api"; 
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('login');

  const [form, setForm] = useState({
    email: "",
    password: "",
    isAdmin: false
  });

  const [status, setStatus] = useState<{
    message: string;
    type: 'error' | 'success' | 'loading' | null
  }>({
    message: "",
    type: null
  });

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = event.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    // Path becomes /api/auth/login or /api/auth/register
    const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
    setStatus({ message: "SYNCHRONIZING WITH INGEN DATABASES...", type: 'loading' });

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      console.log("API Response:", data);

      if (response.ok) {
        if (mode === 'login') {
          // Store the JWT token
          sessionStorage.setItem("token", data.access_token);
          setStatus({ message: "ACCESS GRANTED. REDIRECTING...", type: 'success' });
          setTimeout(() => router.push("/"), 1000);
        } else {
          setStatus({ message: "GENETICIST REGISTERED. PLEASE LOGIN.", type: 'success' });
          setMode('login');
        }
      } else {
        setStatus({ message: data.msg || "CREDENTIAL VERIFICATION FAILED", type: 'error' });
      }
    } catch (error) {
      setStatus({ message: "SYSTEM ERROR: BACKEND UNREACHABLE", type: 'error' });
    }
  }

  async function testAdminAccess() {
    const token = sessionStorage.getItem("token");
    if (!token) {
      setStatus({ message: "NO ACTIVE SESSION FOUND", type: 'error' });
      return;
    }

    setStatus({ message: "REQUESTING LEVEL 5 CLEARANCE...", type: 'loading' });

    try {
      const response = await fetch(`${API_BASE_URL}/auth/verifyAdmin`, {
        method: "GET",
        headers: { 
          // Match your Bearer token requirement
          "Authorization": `Bearer ${token}` 
        }
      });

      if (response.ok) {
        setStatus({ message: "ADMIN ACCESS CONFIRMED", type: 'success' });
      } else {
        setStatus({ message: "INSUFFICIENT PERMISSIONS", type: 'error' });
      }
    } catch (error) {
      setStatus({ message: "VERIFICATION SYSTEM OFFLINE", type: 'error' });
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6 selection:bg-emerald-500/30">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-black tracking-tighter italic">
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">DINO</span>
            <span className="text-white">STORE</span>
          </Link>
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={() => setMode('login')}
              className={`text-[10px] font-black uppercase tracking-widest transition-colors ${mode === 'login' ? 'text-emerald-400' : 'text-zinc-600'}`}
            >
              Login
            </button>
            <button
              onClick={() => setMode('register')}
              className={`text-[10px] font-black uppercase tracking-widest transition-colors ${mode === 'register' ? 'text-emerald-400' : 'text-zinc-600'}`}
            >
              Register
            </button>
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-2xl">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 ml-1">Geneticist ID</label>
              <input name="email" required value={form.email} onChange={handleChange} placeholder="Email"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-zinc-800" />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 ml-1">Access Phrase</label>
              <input name="password" type="password" required value={form.password} onChange={handleChange} placeholder="••••••••"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-zinc-800" />
            </div>

            {mode === 'register' && (
              <div className="flex items-center justify-between px-2 py-2 bg-zinc-950/50 rounded-xl border border-zinc-800/50">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Request Admin Clearance?</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input name="isAdmin" type="checkbox" checked={form.isAdmin} onChange={handleChange} className="sr-only peer" />
                  <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-400 after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 peer-checked:after:bg-white"></div>
                </label>
              </div>
            )}

            <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black py-4 rounded-2xl transition-all shadow-[0_0_20px_-5px_rgba(16,185,129,0.4)]">
              {mode === 'login' ? "INITIALIZE SESSION" : "CREATE ACCOUNT"}
            </button>
          </form>

          <button
            onClick={testAdminAccess}
            className="w-full mt-4 border border-zinc-800 hover:bg-zinc-800 text-zinc-500 hover:text-white font-black py-3 rounded-2xl text-[10px] tracking-widest transition-all uppercase"
          >
            Verify Admin Status
          </button>

          {status.message && (
            <div className={`mt-6 p-3 rounded-xl border text-center text-[10px] font-bold uppercase tracking-widest animate-pulse
              ${status.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}
            `}>
              {status.message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}