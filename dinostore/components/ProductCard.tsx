import Image from "next/image";
import Link from "next/link"; // 1. Import Link

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
  type: string; // Added back as per previous requirements
}

export default function ProductCard({ product }: { product: Dinosaur }) {
  if (!product) return <div className="h-96 w-full animate-pulse rounded-3xl bg-zinc-900" />;

  const isCarnivore = product.diet.toLowerCase().includes("carnivore");
  const badgeStyle = isCarnivore 
    ? "bg-rose-500/20 text-rose-400 border-rose-500/30" 
    : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";

  return (
    /* 2. Wrap the entire card in a Link to the dynamic route */
    <Link href={`/dinosaurs/${product.name.toLowerCase()}`}>
      <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 p-3 transition-all hover:border-emerald-500/50 hover:shadow-[0_0_40px_-15px_rgba(16,185,129,0.3)] cursor-pointer">
        
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-zinc-800">
          <Image 
            src={product.image} 
            alt={product.name} 
            fill 
            className="object-contain p-8" // Change 'cover' to 'contain' and add padding
            unoptimized 
          />
          <div className={`absolute top-3 left-3 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest backdrop-blur-md ${badgeStyle}`}>
            {product.diet}
          </div>
        </div>

        {/* Content */}
        <div className="mt-4 flex flex-1 flex-col px-2 pb-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black capitalize text-white group-hover:text-emerald-400 transition-colors">
              {product.name}
            </h3>
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-tighter">{product.period}</span>
          </div>
          
          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-zinc-400">
            {product.description}
          </p>

          {/* Stats Bar */}
          <div className="mt-auto pt-4">
            <div className="flex items-center gap-4 border-t border-zinc-800 pt-4 text-[10px] font-bold uppercase tracking-tighter text-zinc-500">
              <div className="flex flex-col">
                <span className="text-zinc-600">Weight</span>
                <span className="text-emerald-500">{product.weight}</span>
              </div>
              <div className="flex flex-col border-l border-zinc-800 pl-4">
                <span className="text-zinc-600">Origin</span>
                <span className="text-white">{product.region}</span>
              </div>
              <div className="flex flex-col border-l border-zinc-800 pl-4">
                <span className="text-zinc-600">Stock</span>
                <span className="text-white">{product.stock ? product.stock.toLocaleString() : "x"}</span>
              </div>
              <div className="flex flex-col border-l border-zinc-800 pl-4">
                <span className="text-zinc-600">Cost</span>
              <span className="text-white whitespace-nowrap">
              ${product.price ? product.price.toLocaleString() : "xxx"}
            </span>
              </div>
            </div>
            
            {/* Action Button */}
            <div className="mt-4">
               <button className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black py-3 rounded-2xl text-[10px] uppercase tracking-widest transition-colors">
                Add to cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}