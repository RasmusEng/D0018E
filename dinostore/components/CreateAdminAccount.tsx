'use client';

import React, { useState } from 'react';

export default function CreateAdminButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [status, setStatus] = useState<{ type: 'idle' | 'loading' | 'error' | 'success', msg: string }>({ type: 'idle', msg: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: 'loading', msg: 'Transmitting credentials...' });

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

      const res = await fetch('/api/admin/create-admin', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus({ type: 'error', msg: data.error || 'Authorization failed.' });
        return;
      }

      setStatus({ type: 'success', msg: 'Admin personnel registered.' });

      // Auto-close after success
      setTimeout(() => {
        setIsOpen(false);
        setStatus({ type: 'idle', msg: '' });
        setFormData({ name: '', email: '', password: '' });
      }, 1500);

    } catch (err) {
      setStatus({ type: 'error', msg: 'Connection to mainframe lost.' });
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="bg-zinc-900 border border-zinc-700 text-zinc-300 px-4 py-2 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:border-emerald-500 hover:text-emerald-400 transition-all flex items-center gap-2"
      >
        <span className="text-emerald-500">+</span> New Admin
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl w-full max-w-sm shadow-[0_0_40px_rgba(0,0,0,0.8)] overflow-hidden">

            <div className="flex justify-between items-center p-4 border-b border-zinc-800 bg-zinc-900">
              <h3 className="text-zinc-100 text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
                <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
                Grant Clearance
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-zinc-500 hover:text-rose-500 transition-colors text-xs font-black p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1">Personnel Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 p-2 text-xs font-mono rounded outline-none focus:border-emerald-500 transition-colors"
                  placeholder="e.g. J. Doe"
                />
              </div>

              <div>
                <label className="block text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1">Official Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 p-2 text-xs font-mono rounded outline-none focus:border-emerald-500 transition-colors"
                  placeholder="admin@facility.net"
                />
              </div>

              <div>
                <label className="block text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1">Access Passcode</label>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 p-2 text-xs font-mono rounded outline-none focus:border-emerald-500 transition-colors"
                  placeholder="••••••••"
                />
              </div>

              {/* Status Messages */}
              {status.type !== 'idle' && (
                <div className={`text-[10px] font-mono font-bold uppercase p-2 border border-dashed rounded text-center
                  ${status.type === 'error' ? 'text-rose-500 border-rose-500/50 bg-rose-500/10' : ''}
                  ${status.type === 'loading' ? 'text-amber-500 border-amber-500/50 bg-amber-500/10 animate-pulse' : ''}
                  ${status.type === 'success' ? 'text-emerald-500 border-emerald-500/50 bg-emerald-500/10' : ''}
                `}>
                  {status.msg}
                </div>
              )}

              <button
                type="submit"
                disabled={status.type === 'loading' || status.type === 'success'}
                className="mt-2 w-full bg-zinc-100 text-black py-2.5 rounded font-black uppercase tracking-widest text-[10px] hover:bg-emerald-500 hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status.type === 'loading' ? 'Processing...' : 'Authorize Admin'}
              </button>
            </form>

          </div>
        </div>
      )}
    </>
  );
}