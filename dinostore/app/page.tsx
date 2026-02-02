import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import Features from "@/components/Features";

// This function fetches the data from your API
async function getDinosaurs() {
  const res = await fetch("https://dinoapi.brunosouzadev.com/api/dinosaurs", {
    next: { revalidate: 3600 } // Refresh data every hour
  });
  
  if (!res.ok) throw new Error("Failed to fetch fossils");
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
            {dinosaurs.map((dino: any) => (
              <ProductCard key={dino._id} product={dino} />
            ))}
          </div>
        </section>

        <Features />
      </main>

      <footer className="py-12 text-center text-xs text-zinc-600 uppercase tracking-widest border-t border-zinc-900">
      
      </footer>
    </div>
  );
}