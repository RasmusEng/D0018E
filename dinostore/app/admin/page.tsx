'use client';

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import SpecimenInventory from "@/components/AdminInventory";
import AdminOrders from "@/components/Order";

export default function AdminDashboard() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);

  const fetchMainframeData = useCallback(async () => {
    setLoading(true);
    console.log("[MAINFRAME] Initiating multi-system scan...");

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      if (!token) {
        alert("ACCESS DENIED: Level 5 Clearance Required.");
        window.location.href = '/login';
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const [invRes] = await Promise.all([
        fetch("/api/admin/inventory", { headers }),
      ]);

      if (invRes.status === 401) {
        window.location.href = '/login';
        return;
      }

      if (invRes.ok) setInventory(await invRes.json());

    } catch (error) {
      console.error("[MAINFRAME CRITICAL ERROR]:", error);
      alert(`CONNECTION ERROR: Links to backend unstable.`);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    console.log("[MAINFRAME] Initiating order scan...");

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      if (!token) {
        alert("ACCESS DENIED: Level 5 Clearance Required.");
        window.location.href = '/login';
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const [ordersRes] = await Promise.all([
        fetch("/api/admin/orders", { headers }),
      ]);
      
      if (ordersRes.status === 401) {
        window.location.href = '/login';
        return;
      }

      if (ordersRes.ok) setOrders(await ordersRes.json());
    } catch (error) {
      console.error("[MAINFRAME CRITICAL ERROR]:", error);
      alert(`CONNECTION ERROR: Links to backend unstable.`);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);        


  useEffect(() => {
    fetchMainframeData();
  }, [fetchMainframeData]);

  const handlePurge = async (id: number, name: string) => {
    if (!confirm(`AUTHORIZED PERSONNEL ONLY: Confirm termination of ${name} records?`)) return;
    const token = localStorage.getItem('access_token');

    try {
      const res = await fetch(`/api/admin/inventory/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (res.ok) {
        setInventory(prev => prev.filter((item: any) => item.id !== id));
      } else {
        const err = await res.json();
        alert(`PURGE REJECTED: ${err.error || 'Unknown error'}`);
      }
    } catch (err) {
      alert("CONNECTION ERROR: Mainframe link lost during purge.");
    }
  };

  const setSpecimenStatus = async (id: number, makePublic: boolean) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

    try {
      const res = await fetch(`/api/admin/change-product-status/${id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ published: makePublic }) 
      });

      if (res.ok) {
        setInventory(prev => prev.map((item: any) => 
          (item.product_id === id || item.id === id) 
            ? { ...item, published: makePublic } 
            : item
        ));
      } else {
        const err = await res.json();
        alert(`OVERRIDE FAILED: ${err.error}`);
      }
    } catch (err) {
      console.error(err);
      alert("CONNECTION ERROR: Mainframe link lost.");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="text-emerald-500 font-black animate-pulse tracking-widest uppercase">
        Initializing Mainframe Systems...
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans p-6 md:p-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b border-zinc-800 pb-8 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="h-3 w-3 rounded-full bg-rose-500 animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.6)]" />
            <span className="text-zinc-500 font-black uppercase tracking-[0.3em] text-[10px]">Level 5 Clearance Authorized</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">Facility Mainframe</h1>
        </div>

        <div className="flex gap-4">
          <Link href="/" className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-white px-6 py-3 rounded-xl font-bold uppercase text-xs transition-all">
            Exit
          </Link>
          <button className="bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-3 rounded-xl font-black uppercase text-xs transition-all">
            + New Specimen
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto space-y-12">
        {/* The Grid layout places Inventory on the left (2 columns wide) and Orders on the right (1 column wide) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2">
            <SpecimenInventory
              inventory={inventory}
              onRefresh={fetchMainframeData}
              onPurge={handlePurge}
              onStatusChange={setSpecimenStatus} // NEW ADDITION: Passed to component
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