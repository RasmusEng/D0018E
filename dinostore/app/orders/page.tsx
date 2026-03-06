"use client";

import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";

interface OrderItem {
  product_name: string;
  quantity: number;
  list_price: number;
  item_total: number;
}

interface Order {
  order_id: number;
  order_date: string;
  order_state: string;
  shipped_date: string | null;
  items: OrderItem[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      // Use your working token logic
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

      if (!token) {
        setError("Please login to view your order history.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://127.0.0.1:5000/orders", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.status === 422) {
          throw new Error("Session invalid or malformed request (422). Please re-login.");
        }

        if (!response.ok) {
          throw new Error(`Failed to load orders: ${response.status}`);
        }

        const data = await response.json();
        setOrders(data.orders);
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl p-6 text-center">
        <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-red-600">
          <p className="font-bold uppercase tracking-widest">Error Encountered</p>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar></Navbar>
      <div className="mx-auto max-w-5xl p-6">
        <header className="mb-10">
          <h1 className="text-4xl font-black tracking-tighter text-zinc-900 dark:text-white">
            YOUR <span className="text-emerald-600">ORDERS</span>
          </h1>
          <p className="text-zinc-500">Track your prehistoric acquisitions</p>
        </header>

        {orders.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-zinc-200 p-20 text-center">
            <p className="text-zinc-400 font-medium">No orders found in the database.</p>
          </div>
        ) : (
          <div className="grid gap-8">
            {orders.map((order) => (
              <div
                key={order.order_id}
                className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-all hover:border-emerald-500/50 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-950"
              >
                {/* Order Meta Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-100 bg-zinc-50/50 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                  <div className="flex gap-8">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Date</p>
                      <p className="text-sm font-semibold">{new Date(order.order_date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Order ID</p>
                      <p className="text-sm font-mono font-bold">#DINO-{order.order_id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${order.order_state === 'pending'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                        : order.order_state === 'canceled'
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                      }`}>
                      {order.order_state}
                    </span>
                  </div>
                </div>

                {/* Items List */}
                <div className="p-6">
                  <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-100 text-xl dark:bg-zinc-900">
                            🦖
                          </div>
                          <div>
                            <p className="font-bold uppercase tracking-tight text-zinc-800 dark:text-zinc-200">{item.product_name}</p>
                            <p className="text-xs text-zinc-500">Qty: {item.quantity} × ${item.list_price}</p>
                          </div>
                        </div>
                        <p className="text-lg font-black text-emerald-600">${item.item_total}</p>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Footer / Summary */}
                <div className="flex items-center justify-between border-t border-zinc-100 px-6 py-4 dark:border-zinc-800">
                  <p className="text-xs text-zinc-400 italic">
                    {order.shipped_date ? `Shipped: ${order.shipped_date}` : "Processing at Dino-Hub..."}
                  </p>
                  <div className="text-right">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Total Charged</p>
                    <p className="text-xl font-black text-zinc-900 dark:text-white">
                      ${order.items.reduce((acc, curr) => acc + curr.item_total, 0)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}