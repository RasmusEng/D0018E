"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // 1. Import useRouter
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import Features from "@/components/Features";

export default function Home() {
  const router = useRouter(); // 2. Initialize the router
  const [dinosaurs, setDinosaurs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 3. Check for the token
    const token = sessionStorage.getItem("token");

    // 4. REDIRECT LOGIC: If no token, kick them to login
    if (!token) {
      router.push("/login");
      return; // Stop execution here
    }

    const fetchDinosaurs = async () => {
      try {
        // Use the /api proxy to avoid CORS
        const res = await fetch("/api/products/products", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
          },
        });

        if (res.ok) {
          const data = await res.json();
          setDinosaurs(data);
        } else if (res.status === 401) {
          // Token might be expired or invalid
          sessionStorage.removeItem("token");
          router.push("/login");
        }
      } catch (err) {
        console.error("System Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDinosaurs();
  }, [router]);

  // While redirecting or loading, show a neutral background so the page doesn't "flash"
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/30">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6">
        <header className="py-24 text-center">
          <h1 className="text-6xl font-black tracking-tighter sm:text-8xl">
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">
              Live
            </span>
            <br /> Inventory
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400">
            Welcome, Geneticist. Displaying <span className="text-white font-bold">{dinosaurs.length}</span> specimens.
          </p>
        </header>

        <section className="pb-24">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {dinosaurs.map((row: any) => {
              const product = {
                name: row.product_name,
                diet: row.diet,
                type: row.dino_type,
                period: "Late Cretaceous",
                image: row.image,
                description: row.description,
                region: row.region,
                height: String(row.height),
                length: String(row.length),
                weight: String(row.weight),
                price: Number(row.price),
                stock: Number(row.stock),
              };

              return <ProductCard key={row.product_id} product={product} />;
            })}
          </div>
        </section>

        <Features />
      </main>
    </div>
  );
}