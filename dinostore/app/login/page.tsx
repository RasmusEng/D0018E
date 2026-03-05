"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AuthPage() {
  // Use the proxy path defined in next.config.mjs
  const API_BASE_URL = "http://127.0.0.1:5000";
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('login');

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
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
          localStorage.setItem("access_token", data.access_token);
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
    try {
      const response = await fetch('/api/auth/checkAdminCredentials', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      // Check if the response is actually JSON before parsing
      const contentType = response.headers.get("content-type");
      const data = contentType?.includes("application/json") ? await response.json() : null;

      // Check BOTH response.ok AND the actual isAdmin boolean from the backend
      if (response.ok && data?.isAdmin === true) {
        setStatus({ message: "ADMIN ACCESS CONFIRMED", type: 'success' });
        // Usually, you'd save a token here: localStorage.setItem('token', data.token);
      } else {
        // Use the error message from the server if available, otherwise default to INSUFFICIENT PERMISSIONS
        const errorMsg = data?.message || "INSUFFICIENT PERMISSIONS";
        setStatus({ message: errorMsg.toUpperCase(), type: 'error' });
      }
    } catch (error) {
      console.error("Connection Error:", error);
      setStatus({ message: "VERIFICATION SYSTEM OFFLINE", type: 'error' });
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6 selection:bg-emerald-500/30">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <span className="bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">DINO</span>
          <span className="text-white">STORE</span>
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

            {/* Added Name Field (Only renders on Register) */}
            {mode === 'register' && (
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 ml-1">Full Name</label>
                <input name="name" required value={form.name} onChange={handleChange} placeholder="Dr. Henry Wu"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-zinc-800" />
              </div>
            )}

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