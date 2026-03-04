'use client';

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import SpecimenInventory from "@/components/AdminInventory";
import AdminOrders from "@/components/Order";

export default function AdminDashboard() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);

  // --- DATA ACQUISITION ---

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

  // --- ACTIONS ---

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
      const res = await fetch(`/api/admin/inventory/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setInventory(prev => prev.filter((item: any) => (item.product_id !== id && item.id !== id)));
      }
    } catch (err) {
      alert("PURGE FAILED.");
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
        <div className="flex gap-4">
          <Link href="/" className="bg-zinc-900 border border-zinc-800 text-white px-6 py-3 rounded-xl font-bold uppercase text-xs hover:border-zinc-600 transition-all">Exit</Link>
          <button className="bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-3 rounded-xl font-black uppercase text-xs transition-all">+ New Specimen</button>
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
              onPriceChange={handlePriceUpdate} // NEW PROP
            />
          </div>
          <div className="lg:col-span-1">
            <AdminOrders orders={orders} onRefresh={fetchOrders} />
          </div>
        </div>
      </main>
    </div>
  );
}