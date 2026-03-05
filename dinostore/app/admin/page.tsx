'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from "next/link";
import SpecimenInventory from "@/components/AdminInventory";
import CreateSpecimenButton from "@/components/NewSpecimen";

export interface Order {
  order_id: number;
  user_id: number;
  order_status: number;
  order_date: string | null;
  shipped_date: string | null;
}

interface AdminOrdersProps {
  orders: Order[];
  onRefresh?: () => void;
  onOrderStatusChange?: (orderId: number, newStatus: number) => void; 
}

// --- Custom Dropdown Component ---
const StatusDropdown = ({ 
  orderId, 
  currentStatus, 
  onChange 
}: { 
  orderId: number, 
  currentStatus: number, 
  onChange?: (id: number, status: number) => void 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const alternatives = [
    { id: 0, label: 'Pending', color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
    { id: 1, label: 'Complete', color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
    { id: 2, label: 'Canceled', color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/30' }
  ];

  const active = alternatives.find(s => s.id === currentStatus) || alternatives[0];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => onChange && setIsOpen(!isOpen)}
        disabled={!onChange}
        className={`px-3 py-1.5 rounded text-[10px] font-black border uppercase tracking-widest flex items-center justify-between w-28 transition-all duration-200 outline-none ${active.bg} ${active.color} ${active.border} ${onChange ? 'hover:border-current cursor-pointer' : 'cursor-default'}`}
      >
        {active.label}
        {onChange && (
          <span className={`ml-2 text-[8px] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
            ▼
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-32 rounded-lg border border-zinc-700 bg-zinc-900 shadow-[0_0_15px_rgba(0,0,0,0.5)] overflow-hidden">
          <div className="py-1 flex flex-col">
            {alternatives.map((alt) => (
              <button
                key={alt.id}
                onClick={() => {
                  onChange?.(orderId, alt.id);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-colors hover:bg-zinc-800 ${alt.color}`}
              >
                {alt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// --- Admin Orders Component ---
const AdminOrders: React.FC<AdminOrdersProps> = ({ orders, onRefresh, onOrderStatusChange }) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return <span className="text-zinc-600 italic">Unclassified</span>;
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-black uppercase tracking-tighter text-zinc-100 flex items-center gap-3">
          <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
          Order Manifest
        </h2>
        {onRefresh && (
          <button 
            onClick={onRefresh} 
            className="text-zinc-500 text-xs font-bold uppercase hover:text-white transition-colors"
          >
            Refresh Feed
          </button>
        )}
      </div>
      
      {orders.length === 0 ? (
        <div className="flex-grow flex items-center justify-center border border-dashed border-zinc-800 rounded-lg p-12">
          <p className="text-zinc-600 text-xs font-black uppercase tracking-widest animate-pulse">NO ACTIVE DISPATCHES FOUND.</p>
        </div>
      ) : (
        <div className="w-full">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-500 uppercase tracking-[0.2em] text-[10px]">
                <th className="py-3 text-left font-black">ID</th>
                <th className="py-3 text-left font-black">User</th>
                <th className="py-3 text-left font-black">Status</th>
                <th className="py-3 text-right font-black">Logged</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50 text-zinc-300">
              {orders.map((order) => (
                <tr key={order.order_id} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="py-4 font-mono text-emerald-500 font-bold">#{order.order_id}</td>
                  <td className="py-4 font-mono text-xs">U-{order.user_id}</td>
                  <td className="py-4">
                    <StatusDropdown 
                      orderId={order.order_id} 
                      currentStatus={order.order_status} 
                      onChange={onOrderStatusChange} 
                    />
                  </td>
                  <td className="py-4 font-mono text-xs text-right">{formatDate(order.order_date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// --- Create Admin Button Component ---
const CreateAdminButton = () => {
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
      
      const res = await fetch('/api/create_admin', {
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
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-zinc-900 border border-zinc-800 text-zinc-300 px-4 py-3 rounded-xl font-bold uppercase text-[10px] hover:border-emerald-500 hover:text-emerald-400 transition-all flex items-center gap-2"
      >
        <span className="text-emerald-500 font-black">+</span> New Admin
      </button>

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
};

// --- MAIN DASHBOARD COMPONENT ---
export default function AdminDashboard() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);

  const fetchMainframeData = useCallback(async () => {
    setLoading(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
      const invRes = await fetch("/api/admin/inventory", { headers });

      if (invRes.status === 401) {
        window.location.href = '/login';
        return;
      }

      if (invRes.ok) setInventory(await invRes.json());
    } catch (error) {
      console.error("[MAINFRAME ERROR]:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;
      const res = await fetch("/api/admin/orders", { 
        headers: { 'Authorization': `Bearer ${token}` } 
      });
      if (res.ok) setOrders(await res.json());
    } catch (error) {
      console.error("[ORDER SCAN ERROR]:", error);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    fetchMainframeData();
  }, [fetchOrders, fetchMainframeData]);

  const handlePriceUpdate = async (id: number, newPrice: number) => {
    const token = localStorage.getItem('access_token');
    try {
      const res = await fetch(`/api/admin/change-product-price/${id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ price: newPrice }) 
      });

      if (res.ok) {
        setInventory(prev => prev.map((item: any) => 
          (item.product_id === id || item.id === id) ? { ...item, price: newPrice } : item
        ));
      }
    } catch (err) {
      alert("PRICE UPDATE FAILED: Link unstable.");
    }
  };

  const handleStockUpdate = async (id: number, newTotal: number) => {
    const token = localStorage.getItem('access_token');
    const currentItem = inventory.find(item => (item.product_id === id || item.id === id));
    if (!currentItem) return;

    const adjustment = newTotal - currentItem.stock;
    if (adjustment === 0) return;

    try {
      const res = await fetch(`/api/admin/change-product-stock/${id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ adjustment }) 
      });

      if (res.ok) {
        setInventory(prev => prev.map((item: any) => 
          (item.product_id === id || item.id === id) ? { ...item, stock: newTotal } : item
        ));
      }
    } catch (err) {
      alert("STOCK UPDATE FAILED.");
    }
  };

  const setSpecimenStatus = async (id: number, makePublic: boolean) => {
    const token = localStorage.getItem('access_token');
    try {
      const res = await fetch(`/api/admin/change-product-status/${id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: makePublic }) 
      });

      if (res.ok) {
        setInventory(prev => prev.map((item: any) => 
          (item.product_id === id || item.id === id) ? { ...item, published: makePublic } : item
        ));
      }
    } catch (err) {
      alert("STATUS OVERRIDE FAILED.");
    }
  };

  const handlePurge = async (id: number, name: string) => {
    if (!confirm(`Confirm termination of ${name}?`)) return;
    const token = localStorage.getItem('access_token');
    try {
      const res = await fetch(`/api/admin/remove-product/${id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setInventory(prev => prev.filter((item: any) => (item.product_id !== id && item.id !== id)));
      }
    } catch (err) {
      alert("PURGE FAILED.");
    }
  };

  const handleOrderStatusChange = async (orderId: number, newStatus: number) => {
    const token = localStorage.getItem('access_token');
    try {
      const res = await fetch(`/api/admin/change-order-status/${orderId}`, {
        method: 'POST', 
        headers: { 
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ status: newStatus }) 
      });

      if (res.ok) {
        setOrders(prev => prev.map((order: any) => 
          order.order_id === orderId ? { ...order, order_status: newStatus } : order
        ));
      } else {
        console.error("Failed to update order status on the server.");
      }
    } catch (err) {
      alert("ORDER STATUS OVERRIDE FAILED: Link unstable.");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="text-emerald-500 font-black animate-pulse tracking-widest uppercase">Initializing...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans p-6 md:p-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b border-zinc-800 pb-8 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="h-3 w-3 rounded-full bg-rose-500 animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.6)]" />
            <span className="text-zinc-500 font-black uppercase tracking-[0.3em] text-[10px]">Level 5 Clearance</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">Facility Mainframe</h1>
        </div>
        <div className="flex flex-wrap gap-4 items-center">
          <Link href="/" className="bg-zinc-900 border border-zinc-800 text-white px-6 py-3 rounded-xl font-bold uppercase text-xs hover:border-zinc-600 transition-all">Exit</Link>
          
          {/* New Admin Modal Button Injected Here */}
          <CreateAdminButton />

          <CreateSpecimenButton onSuccess={fetchMainframeData} />
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <SpecimenInventory
              inventory={inventory}
              onRefresh={fetchMainframeData}
              onPurge={handlePurge}
              onStatusChange={setSpecimenStatus}
              onStockChange={handleStockUpdate} 
              onPriceChange={handlePriceUpdate} 
            />
          </div>
          <div className="lg:col-span-1">
            <AdminOrders 
              orders={orders} 
              onRefresh={fetchOrders} 
              onOrderStatusChange={handleOrderStatusChange} 
            />
          </div>
        </div>
      </main>
    </div>
  );
}