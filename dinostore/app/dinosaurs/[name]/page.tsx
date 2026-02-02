import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";

// 1. Fetching the specific dino data
async function getDinoData(name: string) {
  // We lowercase it here for the URL, but only after we're sure 'name' exists
  const res = await fetch(`https://dinoapi.brunosouzadev.com/api/dinosaurs/${name.toLowerCase()}`, {
    next: { revalidate: 3600 } 
  });
  
  if (!res.ok) return null;
  const data = await res.json();
  
  // If API returns an array [{...}], grab the first item. If it's an object, use it directly.
  return Array.isArray(data) ? data[0] : data;
}

export default async function DinoDetailPage({ params }: { params: Promise<{ name: string }> }) {
  // ✅ THE FIX: Await params before accessing .name
  const resolvedParams = await params;
  const dinoName = resolvedParams.name;

  const dino = await getDinoData(dinoName);

  if (!dino) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white p-6 text-center">
        <h1 className="text-4xl font-black mb-4">SPECIMEN NOT FOUND</h1>
        <p className="text-zinc-500 mb-8">The dinosaur "{dinoName}" is missing from our fossil records.</p>
        <Link href="/" className="bg-emerald-500 text-black px-8 py-3 rounded-2xl font-black uppercase text-xs">Return to Lab</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/30">
      <Navbar />
      
      <main className="mx-auto max-w-7xl px-6 py-20">
        <Link href="/" className="text-emerald-500 font-bold hover:text-white transition-colors mb-12 inline-block">
          ← Back to Catalog
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Scientific Image Display */}
          <div className="relative aspect-square rounded-[3rem] overflow-hidden border border-zinc-800 bg-zinc-900 shadow-2xl">
          <Image 
            src={dino.image} 
            alt={dino.name} 
            fill 
            className="object-contain p-8" // Change 'cover' to 'contain' and add padding
            unoptimized 
          />
          </div>

          {/* Biological Data */}
          <div className="flex flex-col">
            <div className="flex items-center gap-4 mb-6">
              <span className={`h-3 w-3 rounded-full ${dino.diet === 'carnivore' ? 'bg-rose-500' : 'bg-emerald-500'}`} />
              <span className="text-zinc-500 font-black uppercase tracking-[0.3em] text-xs">
                {dino.type || 'Terrestrial'} / {dino.diet}
              </span>
            </div>

            <h1 className="text-7xl font-black capitalize mb-8 leading-none">
              {dino.name}
            </h1>

            <div className="space-y-10">
              <div>
                <h2 className="text-zinc-600 font-black uppercase text-[10px] tracking-widest mb-4">Description</h2>
                <p className="text-zinc-400 text-lg leading-relaxed italic">
                  "{dino.description}"
                </p>
              </div>

              {/* Stats Matrix */}
              <div className="grid grid-cols-2 gap-px bg-zinc-800 border border-zinc-800 rounded-[2rem] overflow-hidden">
                <div className="bg-zinc-950 p-6">
                  <p className="text-zinc-600 text-[10px] font-black uppercase mb-1">Mass</p>
                  <p className="text-xl font-bold text-white">{dino.weight}</p>
                </div>
                <div className="bg-zinc-950 p-6">
                  <p className="text-zinc-600 text-[10px] font-black uppercase mb-1">Height</p>
                  <p className="text-xl font-bold text-white">{dino.height}</p>
                </div>
                <div className="bg-zinc-950 p-6">
                  <p className="text-zinc-600 text-[10px] font-black uppercase mb-1">Region</p>
                  <p className="text-xl font-bold text-emerald-400 capitalize">{dino.region}</p>
                </div>
                <div className="bg-zinc-950 p-6">
                  <p className="text-zinc-600 text-[10px] font-black uppercase mb-1">Length</p>
                  <p className="text-xl font-bold text-white">{dino.length}</p>
                </div>
              </div>
              
              <div className="pt-4">
                 <button className="w-full bg-white hover:bg-emerald-500 text-black font-black py-5 rounded-2xl transition-all hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.5)] uppercase tracking-widest text-xs">
                  Add to cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}