import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import Features from "@/components/Features";

// This function fetches the data from your API
async function getDinosaurs() {
  const base = process.env.NEXT_PUBLIC_API_BASE;
  if (!base) throw new Error("NEXT_PUBLIC_API_BASE is not set");

  const url = `${base}/api/products`;
  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Fetch failed ${res.status} ${res.statusText} from ${url}: ${text}`);
  }

  return res.json();
}


export default async function Home() {
  const dinosaurs = await getDinosaurs();

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

        {/* Dynamic Grid */}
        <section className="pb-24">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {dinosaurs.map((row: any) => {
              const product = {
                name: row.product_name,
                diet: row.diet,
                type: row.dino_type,       // map dino_type -> type
                period: "",                // you don't have this in DB (or set something else)
                image: row.image,
                description: row.description,
                region: row.region,
                height: String(row.height),
                length: String(row.length),
                weight: String(row.weight),
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
      
      </footer>
    </div>
  );
}