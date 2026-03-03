"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Loader2, X } from "lucide-react"; // <-- Added X icon
import { useAppStore } from "@/store/useAppStore";

interface CartItem {
  product_id: number;
  product_name: string;
  quantity: number;
  total_price: number;
  unit_price: number;
  image_url: string;
}

interface CartTotals {
  total_price: number;
  total_weight: number;
}

export default function Cart() {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);
  const [totals, setTotals] = useState<CartTotals | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [removingId, setRemovingId] = useState<number | null>(null); // <-- Added state for deleting

  const dropdownRef = useRef<HTMLDivElement>(null);

  const { cartUpdateTrigger, triggerCartRefresh, isLoggedIn } = useAppStore();

  useEffect(() => {
    const fetchCartData = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/orders/getUsersCart', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setItems(data.items || []);
          setTotals(data.total_price || null);
        }
      } catch (error) {
        console.error("Failed to fetch secure cart data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoggedIn) {
      fetchCartData();
    } else {
      setItems([]);
      setTotals(null);
      setIsLoading(false);
    }
  }, [cartUpdateTrigger, isLoggedIn]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- NEW: Remove Item Function ---
  const handleRemoveItem = async (productId: number) => {
    setRemovingId(productId);
    const token = localStorage.getItem("access_token");

    try {
      const response = await fetch('/api/orders/removeFromCart', {
        method: 'POST', // Using POST to safely send the body
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ product_id: productId })
      });

      if (response.ok) {
        // Tell Zustand to wake up and fetch the fresh cart data!
        triggerCartRefresh();
      } else {
        console.error("Failed to remove specimen.");
      }
    } catch (error) {
      console.error("Error removing item:", error);
    } finally {
      setRemovingId(null);
    }
  };

  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  if (!isLoggedIn) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hidden sm:flex items-center gap-3 border border-zinc-800 px-4 py-2 rounded-xl bg-zinc-900/50 hover:border-emerald-500/50 transition-colors cursor-pointer group"
      >
        <span className="text-sm font-bold text-zinc-400 group-hover:text-emerald-400 transition-colors">
          INCUBATOR
        </span>
        <div className="flex h-6 min-w-[24px] items-center justify-center rounded-full bg-emerald-500/20 px-1.5 text-xs font-black text-emerald-400">
          {isLoading ? "..." : totalItemCount}
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-3 w-80 sm:w-96 rounded-2xl border border-zinc-800 bg-zinc-950/95 backdrop-blur-xl p-4 shadow-[0_0_50px_-12px_rgba(0,0,0,0.8)] z-50">
          <div className="mb-4 flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="font-bold text-white uppercase tracking-widest text-sm">Active Specimens</h3>
            <span className="text-xs text-zinc-500">{items.length} Unique Species</span>
          </div>

          <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-4">
            {items.length === 0 ? (
              <p className="text-center text-sm text-zinc-500 py-6 italic">Incubator is currently empty.</p>
            ) : (
              items.map((item, index) => (
                <div key={`${item.product_id}-${index}`} className="flex items-center gap-4 group/item">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-zinc-900 border border-zinc-800">
                    <Image
                      src={item.image_url}
                      alt={item.product_name}
                      fill
                      unoptimized
                      className="object-contain p-1"
                    />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <span className="text-sm font-bold text-white capitalize">{item.product_name}</span>
                    <span className="text-xs text-zinc-500">Qty: {item.quantity} × ${item.unit_price}</span>
                  </div>

                  <div className="text-right flex items-center gap-3">
                    <span className="text-sm font-bold text-emerald-400">${item.total_price}</span>

                    {/* NEW: The Remove Button */}
                    <button
                      onClick={() => handleRemoveItem(item.product_id)}
                      disabled={removingId === item.product_id}
                      className="text-zinc-600 hover:text-red-400 transition-colors disabled:opacity-50"
                      title="Remove specimen"
                    >
                      {removingId === item.product_id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {items.length > 0 && totals && (
            <div className="mt-4 border-t border-zinc-800 pt-4">
              <div className="flex justify-between text-xs text-zinc-400 mb-1 uppercase tracking-widest">
                <span>Total Biomass:</span>
                <span>{totals.total_weight.toLocaleString()} kg</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Subtotal:</span>
                <span className="text-xl font-black text-white">${totals.total_price.toLocaleString()}</span>
              </div>

              <form action="/checkout" className="mt-4 w-full">
                <button
                  type="submit"
                  className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black py-3 text-xs uppercase tracking-widest transition-all active:scale-[0.98]"
                >
                  Initialize Transport (Checkout)
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}