"use client";
import Image from "next/image";
import Link from "next/link";

interface Dinosaur {
  name: string;
  weight: string;
  height: string;
  diet: string;
  region: string;
  period: string;
  image: string;
  description: string;
  price: number;
  stock: number;
  type: string;
}

export default function ProductCard({ product }: { product: Dinosaur }) {
  // Skeleton Loader for missing product
  if (!product) return <div className="h-96 w-full animate-pulse rounded-3xl bg-zinc-900" />;

  const isCarnivore = product.diet.toLowerCase().includes("carnivore");
  const badgeStyle = isCarnivore 
    ? "bg-rose-500/20 text-rose-400 border-rose-500/30" 
    : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";

  // Robust slug: lowercase, replace spaces with hyphens, remove non-alphanumeric
  const slug = product.name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    console.log(`Added ${product.name} to cart`);
    // Add your toast notification or context call here
  };

  return (
    <Link href={`/dinosaurs/${slug}`} className="block group">
      <div className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 p-3 transition-all duration-300 hover:border-emerald-500/50 hover:shadow-[0_0_40px_-15px_rgba(16,185,129,0.3)]">
        
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-zinc-800/50">
          <Image 
            src={product.image} 
            alt={product.name} 
            fill 
            className="object-contain p-8 transition-transform duration-700 ease-out group-hover:scale-110" 
            unoptimized 
          />
          <div className={`absolute top-3 left-3 z-10 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest backdrop-blur-md ${badgeStyle}`}>
            {product.diet}
          </div>
        </div>

        {/* Content */}
        <div className="mt-4 flex flex-1 flex-col px-2 pb-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-xl font-black capitalize text-white group-hover:text-emerald-400 transition-colors leading-tight">
              {product.name}
            </h3>
            <span className="shrink-0 text-[9px] font-medium text-zinc-500 uppercase tracking-widest mt-1">
              {product.period}
            </span>
          </div>
          
          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-zinc-400">
            {product.description}
          </p>

          {/* Stats Bar */}
          <div className="mt-auto pt-4">
            <div className="grid grid-cols-4 gap-2 border-t border-zinc-800 pt-4 text-[9px] font-bold uppercase tracking-tighter">
              <Stat label="Weight" value={product.weight} color="text-emerald-500" />
              <Stat label="Origin" value={product.region} isLast={false} />
              <Stat label="Stock" value={product.stock?.toString() ?? "0"} />
              <Stat label="Cost" value={`$${product.price?.toLocaleString() ?? "???"}`} />
            </div>
            
            <button 
              onClick={handleAddToCart}
              className="mt-4 w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black py-3 rounded-2xl text-[10px] uppercase tracking-widest transition-all active:scale-[0.95] z-20">
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

// Small helper component for the stats to keep the JSX clean
function Stat({ label, value, color = "text-white", isLast = false }: { label: string; value: string; color?: string; isLast?: boolean }) {
  return (
    <div className={`flex flex-col ${!isLast ? "border-l border-zinc-800 pl-2 first:border-l-0 first:pl-0" : ""}`}>
      <span className="text-zinc-600 mb-0.5">{label}</span>
      <span className={`${color} truncate`}>{value}</span>
    </div>
  );
}