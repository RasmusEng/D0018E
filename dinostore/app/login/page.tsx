"use client";

import { useState } from "react";
import Link from "next/link";

export default function AuthPage() {
  const [isRegister, setIsRegister] = useState(false); // Toggle between Login and Register
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    isAdmin: false, // New field for registration
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Dynamically choose endpoint based on mode
    const endpoint = isRegister ? "/auth/register" : "/auth/login";
    
    try {
      const response = await fetch(`http://127.0.0.1:5000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isRegister ? formData : { email: formData.email, password: formData.password }),
      });

      const data = await response.json(); 

      if (response.ok) {
        setMessage(isRegister ? "ACCOUNT CREATED. PROCEED TO LOGIN." : "SESSION INITIALIZED. REDIRECTING...");
        if (isRegister) setIsRegister(false); // Switch to login view after success
      } else {
        setMessage(data.error || "ACCESS DENIED.");
      }
    } catch (error) {
      setMessage("SYSTEM ERROR: UNABLE TO REACH SERVER.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6 selection:bg-emerald-500/30">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative">
        <div className="text-center mb-10">
          <Link href="/" className="text-3xl font-black tracking-tighter italic">
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">DINO</span>
            <span className="text-white">STORE</span>
          </Link>
          <p className="text-[10px] text-zinc-500 font-bold mt-2 tracking-[0.2em]">
            {isRegister ? "CREATE NEW GENETICIST PROFILE" : "RESTRICTED ACCESS TERMINAL"}
          </p>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-2xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 ml-1">
                Geneticist ID
              </label>
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="johnn@hammond.com"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 text-white placeholder:text-zinc-700 focus:outline-none focus:border-emerald-500/50 transition-all"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 ml-1">
                Access Phrase
              </label>
              <input 
                type="password" 
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="••••••••"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 text-white placeholder:text-zinc-700 focus:outline-none focus:border-emerald-500/50 transition-all"
              />
            </div>

            {/* Admin Toggle - Only visible when Registering */}
            {isRegister && (
              <div className="flex items-center space-x-3 px-1">
                <input 
                  id="isAdmin"
                  type="checkbox"
                  checked={formData.isAdmin}
                  onChange={(e) => setFormData({...formData, isAdmin: e.target.checked})}
                  className="w-4 h-4 rounded border-zinc-800 bg-zinc-950 text-emerald-500 focus:ring-emerald-500/50"
                />
                <label htmlFor="isAdmin" className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                  Request Administrative Clearances
                </label>
              </div>
            )}

            <button 
              disabled={loading}
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-black py-4 rounded-2xl transition-transform active:scale-[0.98] shadow-[0_0_20px_-5px_rgba(16,185,129,0.4)]"
            >
              {loading ? "PROCESSING..." : isRegister ? "CREATE ACCOUNT" : "INITIALIZE SESSION"}
            </button>
          </form>

          {message && (
            <p className="mt-4 text-center text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
              {message}
            </p>
          )}

          {/* Mode Toggle Link */}
          <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
            <button 
              onClick={() => {
                setIsRegister(!isRegister);
                setMessage("");
              }}
              className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
            >
              {isRegister ? "Already have access? Login" : "New Geneticist? Request DNA Access"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}