import Link from "next/link";

import Cart from "./Cart";


export default function Navbar() {
  const cartItems = [
    { id: "1", name: "T-Rex Steak", price: 29.99, quantity: 2 },
    { id: "2", name: "Triceratops Salad", price: 19.99, quantity: 1 },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold tracking-tighter text-emerald-600 dark:text-emerald-500">
            DINO<span className="text-zinc-900 dark:text-white">STORE</span>
          </span>
        </div>
        <div className="flex items-center gap-6 text-sm font-medium">
          <Link href="#" className="hidden hover:text-emerald-600 sm:block">Catalog</Link> 
          <Link 
  href="/login" 
  className="hidden sm:block text-sm font-bold text-zinc-400 hover:text-emerald-400 transition-colors border border-zinc-800 px-4 py-2 rounded-xl hover:border-emerald-500/50"
>
  Login
</Link>
        </div>
        <Cart items={[
          { id: "1", name: "T-Rex Steak", price: 29.99, quantity: 2 },
          { id: "2", name: "Triceratops Salad", price: 19.99, quantity: 1 },
        ]} />
      </div>
    </nav>
  );
}