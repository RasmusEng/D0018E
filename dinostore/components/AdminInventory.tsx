'use client';

// Updated interface to match your exact JSON output
interface Specimen {
  product_id: number;
  product_name: string;
  stock: number;
  price: number;
  published: boolean;
  // Note: 'status' is removed because it wasn't in your JSON payload. 
  // We'll calculate a visual status based on stock/published status instead.
}

interface SpecimenInventoryProps {
  inventory: Specimen[];
  onRefresh: () => void;
  onPurge: (id: number, name: string) => void;
  onStatusChange: (id: number, makePublic: boolean) => void;
}

export default function SpecimenInventory({ inventory, onRefresh, onPurge, onStatusChange }: SpecimenInventoryProps) {
  // Helper function to format the integer price into a currency string
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <section className="bg-zinc-900/50 border border-zinc-800 rounded-[2rem] overflow-hidden">
      <div className="p-8 border-b border-zinc-800 flex justify-between items-center bg-zinc-900">
        <h2 className="text-xl font-black uppercase tracking-tighter">Active Stock</h2>
        <button 
          onClick={onRefresh} 
          className="text-zinc-500 text-xs font-bold uppercase hover:text-white transition-colors"
        >
          Refresh Feed
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-950/50 border-b border-zinc-800 text-[10px] uppercase tracking-widest text-zinc-500">
              <th className="p-6 font-black">ID</th>
              <th className="p-6 font-black">Species</th>
              <th className="p-6 font-black">Quantity</th>
              <th className="p-6 font-black">Value</th>
              <th className="p-6 font-black">Network</th>
              <th className="p-6 font-black text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50 text-sm">
            {inventory.map((item) => (
              <tr key={item.product_id} className="hover:bg-zinc-800/20 transition-colors group">
                <td className="p-6 text-zinc-500 font-mono">#{item.product_id}</td>
                <td className="p-6 text-white font-bold capitalize">{item.product_name}</td>
              
                <td className={`p-6 font-bold ${item.stock < 5 ? 'text-rose-500 animate-pulse' : 'text-zinc-300'}`}>
                  {item.stock} Units
                </td>
                <td className="p-6 text-zinc-300 font-mono">{formatPrice(item.price)}</td>
                
                <td className="p-6">
                  <select
                    value={item.published ? "true" : "false"}
                    onChange={(e) => {
                      const isPublishing = e.target.value === "true";
                      onStatusChange(item.product_id, isPublishing);
                    }}
                    className={`px-3 py-1.5 rounded text-[10px] font-black uppercase tracking-widest border transition-all cursor-pointer outline-none appearance-none ${
                      item.published 
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30 hover:border-emerald-500' 
                        : 'bg-zinc-900 text-zinc-500 border-zinc-700 hover:border-zinc-500'
                    }`}
                  >
                    <option value="true" className="bg-zinc-900 text-emerald-500">Live (Public)</option>
                    <option value="false" className="bg-zinc-900 text-zinc-500">Draft (Hidden)</option>
                  </select>
                </td>

                <td className="p-6 text-right">
                  <button
                    onClick={() => onPurge(item.product_id, item.product_name)}
                    className="text-rose-500 text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity hover:underline"
                  >
                    Purge
                  </button>
                </td>
              </tr>
            ))}
            {inventory.length === 0 && (
              <tr>
                <td colSpan={6} className="p-12 text-center text-zinc-600 font-black uppercase tracking-widest text-xs">
                  No Specimens Detected in Database
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}