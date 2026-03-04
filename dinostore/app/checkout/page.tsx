"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ShieldCheck, Loader2, Truck, AlertTriangle } from "lucide-react";
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

export default function CheckoutPage() {
  const router = useRouter();
  const { isLoggedIn, triggerCartRefresh } = useAppStore();
  
  const [items, setItems] = useState<CartItem[]>([]);
  const [totals, setTotals] = useState<CartTotals | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [destination, setDestination] = useState("");
  const [sector, setSector] = useState("Sector 4");

  useEffect(() => {
    // Redirect if not logged in
    if (!isLoggedIn && typeof window !== 'undefined') {
      const token = localStorage.getItem("access_token");
      if (!token) {
        router.push("/login");
        return;
      }
    }

    const fetchCartData = async () => {
      const token = localStorage.getItem("access_token");
      try {
        const response = await fetch('/api/orders/getUsersCart', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          setItems(data.items || []);
          setTotals(data.total_price || null);
        }
      } catch (error) {
        console.error("Failed to fetch checkout data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartData();
  }, [isLoggedIn, router]);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = localStorage.getItem("access_token");

    try {
      // Hit our new finalize endpoint
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ destination, sector })
      });

      if (response.ok) {
        // Order complete! Refresh the global cart (it will drop to 0)
        triggerCartRefresh();
        // Send them back home or to a success page
        alert("Transport Authorized. Specimens are en route.");
        router.push("/");
      } else {
        alert("Transport Authorization Failed. Check clearance.");
      }
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-emerald-500">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-zinc-400 gap-4">
        <AlertTriangle className="h-12 w-12 text-zinc-600" />
        <h1 className="text-xl font-bold text-white uppercase tracking-widest">Incubator is Empty</h1>
        <button onClick={() => router.push("/")} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-4">
          Return to Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/30 py-12 px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Left Side: Secure Transport Form */}
        <section>
          <div className="mb-8 flex items-center gap-3 border-b border-zinc-800 pb-4">
            <ShieldCheck className="h-6 w-6 text-emerald-500" />
            <h1 className="text-2xl font-black uppercase tracking-widest">Transport Manifest</h1>
          </div>

          <form onSubmit={handleCheckout} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Target Facility Name</label>
              <input 
                required
                type="text" 
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Isla Nublar Research Facility"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Drop Zone / Sector</label>
              <select 
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              >
                <option>Sector 1 - Herbivore Plains</option>
                <option>Sector 2 - Aviary</option>
                <option>Sector 3 - Aquatic Center</option>
                <option>Sector 4 - Maximum Security</option>
              </select>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex gap-4 text-sm text-emerald-200">
              <Truck className="h-5 w-5 shrink-0 text-emerald-500" />
              <p>Standard heavy-lift helicopter transport is included. Ensure reinforced paddocks are prepared prior to arrival.</p>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-800 disabled:text-zinc-600 text-black font-black py-4 rounded-xl text-sm uppercase tracking-widest transition-all active:scale-[0.98]"
            >
              {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Authorizing...</> : "Authorize Transport"}
            </button>
          </form>
        </section>

        {/* Right Side: Order Summary */}
        <section className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 h-fit sticky top-24">
          <h2 className="text-sm font-bold text-white uppercase tracking-widest mb-6 border-b border-zinc-800 pb-4">Specimen Summary</h2>
          
          <div className="space-y-4 max-h-[40vh] overflow-y-auto custom-scrollbar pr-2">
            {items.map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="relative h-12 w-12 shrink-0 rounded-lg bg-zinc-900 border border-zinc-800">
                  <Image src={item.image_url} alt={item.product_name} fill unoptimized className="object-contain p-1" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold capitalize text-white">{item.product_name}</p>
                  <p className="text-xs text-zinc-500">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-bold text-emerald-400">${item.total_price.toLocaleString()}</p>
              </div>
            ))}
          </div>

          {totals && (
            <div className="mt-6 pt-6 border-t border-zinc-800 space-y-2">
              <div className="flex justify-between text-sm text-zinc-400">
                <span>Total Biomass</span>
                <span>{totals.total_weight.toLocaleString()} kg</span>
              </div>
              <div className="flex justify-between text-sm text-zinc-400">
                <span>Logistics Fees</span>
                <span className="text-emerald-500">Included</span>
              </div>
              <div className="flex justify-between items-end pt-4 border-t border-zinc-800 mt-4">
                <span className="text-sm font-bold text-white uppercase tracking-widest">Total Authorization</span>
                <span className="text-3xl font-black text-white">${totals.total_price.toLocaleString()}</span>
              </div>
            </div>
          )}
        </section>

      </div>
    </div>
  );
}