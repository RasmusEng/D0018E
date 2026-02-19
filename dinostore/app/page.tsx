import { cookies } from "next/headers";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import Features from "@/components/Features";

async function getDinosaurs() {
  try {
    const response = await fetch(`/api/products/products`, {
      method: 'GET', // Changed to GET to retrieve the whole list
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Failed to fetch inventory');
// Log raw response for debugging
    console.log("Raw response:");
    // Actually return the parsed data so the component can use it
    return await response.json(); 
  } catch (error) {
    console.error('Error:', error);
    return []; // Return an empty array on failure to prevent .length and .map from crashing
  }
}

export default async function Home() {
  const dinosaurs = await getDinosaurs();
  console.log("Fetched Dinosaurs:", dinosaurs);

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
            Currently displaying <span className="text-white font-bold">{dinosaurs.length}</span> genetically verified specimens 
            retrieved from our secure data labs.
          </p>
        </header>

        <section className="pb-24">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {dinosaurs.map((row: any) => {
              // Mapping DB schema to Component Props
              const product = {
                id: row.product_id,
                name: row.product_name,
                diet: row.diet,
                type: row.dino_type,
                period: row.period || "Unknown Era", 
                image: row.image,
                description: row.description,
                region: row.region,
                height: `${row.height}m`,
                length: `${row.length}m`,
                weight: `${row.weight}kg`,
                price: Number(row.price),
                stock: Number(row.stock),
              };

              return (
                <ProductCard
                  key={row.product_id}
                  product={product}
                />
              );
            })}
          </div>
        </section>

        <Features />
      </main>

      <footer className="py-12 text-center text-xs text-zinc-600 uppercase tracking-widest border-t border-zinc-900">
        © 2026 InGen Procurement Division
      </footer>
    </div>
  );
}