'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from "next/link";
import SpecimenInventory from "@/components/AdminInventory";
import CreateSpecimenButton from "@/components/NewSpecimen";
import CreateAdminButton from "@/components/CreateAdminAccount"
import AdminOrders from "@/components/Order";

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
  onOrderStatusChange: (orderId: number, newStatus: string) => Promise<void>;
}

const STATUS_MAP: Record<string, { label: string, color: string, bg: string, border: string }> = {
  pending: { label: 'Pending', color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  complete: { label: 'Complete', color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  canceled: { label: 'Canceled', color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
};

const StatusDropdown = ({
  orderId,
  currentStatus,
  onChange
}: {
  orderId: number,
  currentStatus: string,
  onChange: (id: number, status: string) => Promise<void>
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const active = STATUS_MAP[currentStatus] || {
    label: currentStatus || 'Unknown',
    color: 'text-zinc-400',
    bg: 'bg-zinc-800/50',
    border: 'border-zinc-700'
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleUpdate = async (newStatus: string) => {
    if (newStatus === currentStatus) {
      setIsOpen(false);
      return;
    }
    setIsUpdating(true);
    await onChange(orderId, newStatus);
    setIsUpdating(false);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !isUpdating && setIsOpen(!isOpen)}
        disabled={isUpdating}
        className={`px-3 py-1.5 rounded text-[10px] font-black border uppercase tracking-widest flex items-center justify-between w-32 transition-all duration-200 outline-none 
          ${active.bg} ${active.color} ${active.border} 
          ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'hover:border-current cursor-pointer'}`}
      >
        {isUpdating ? 'Updating...' : active.label}
        {!isUpdating && (
          <span className={`ml-2 text-[8px] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
            ▼
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-32 rounded-lg border border-zinc-700 bg-zinc-900 shadow-2xl overflow-hidden">
          {Object.keys(STATUS_MAP).map((statusKey) => (
            <button
              key={statusKey}
              onClick={() => handleUpdate(statusKey)}
              className={`w-full text-left px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-colors hover:bg-zinc-800 ${STATUS_MAP[statusKey].color}`}
            >
              {STATUS_MAP[statusKey].label}
            </button>
          ))}
        </div>
      )}
    </div>
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

  const handleOrderStatusChange = async (orderId: number, newState: string) => {
    const token = localStorage.getItem('access_token');
    try {
      // 1. Ensure the URL is absolute if proxying isn't configured, 
      // and match the Flask route: /admin/change-order-status/<id>
      const res = await fetch(`/api/admin/change-order-status/${orderId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newState })
      });

      if (res.ok) {
        // 2. FIX: Update 'order_state' to match your Interface and DB column
        setOrders(prev => prev.map((order) =>
          order.order_id === orderId ? { ...order, order_state: newState } : order
        ));
      } else {
        const errorData = await res.json();
        console.error("Server Rejected Update:", errorData.details || errorData.error);
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
          <div className="lg:col-span-1 sticky top-8">
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