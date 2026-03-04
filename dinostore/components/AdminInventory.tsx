'use client';

interface Specimen {
  product_id: number;
  product_name: string;
  stock: number;
  price: number;
  published: boolean;
}

interface SpecimenInventoryProps {
  inventory: Specimen[];
  onRefresh: () => void;
  onPurge: (id: number, name: string) => void;
  onStatusChange: (id: number, makePublic: boolean) => void;
  onStockChange: (id: number, newStock: number) => void;
  // NEW: Prop to handle price updates
  onPriceChange: (id: number, newPrice: number) => void;
}

export default function SpecimenInventory({
  inventory,
  onRefresh,
  onPurge,
  onStatusChange,
  onStockChange,
  onPriceChange // Destructured here
}: SpecimenInventoryProps) {

  return (
    <section className="bg-zinc-900/50 border border-zinc-800 rounded-[2rem] overflow-hidden">
      <div className="p-8 border-b border-zinc-800 flex justify-between items-center bg-zinc-900">
        <h2 className="text-xl font-black uppercase tracking-tighter text-white">Active Stock</h2>
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
              <th className="p-6 font-black">Value (USD)</th>
              <th className="p-6 font-black">Network</th>
              <th className="p-6 font-black text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50 text-sm">
            {inventory.map((item) => (
              <tr key={item.product_id} className="hover:bg-zinc-800/20 transition-colors group">
                <td className="p-6 text-zinc-500 font-mono">#{item.product_id}</td>
                <td className="p-6 text-white font-bold capitalize">{item.product_name}</td>

                {/* INTERACTIVE STOCK CELL */}
                <td className="p-6">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      value={item.stock}
                      onChange={(e) => onStockChange(item.product_id, parseInt(e.target.value) || 0)}
                      className={`w-20 bg-zinc-950 border border-zinc-800 rounded px-2 py-1 font-mono font-bold outline-none transition-colors focus:border-white ${
                        item.stock < 5 ? 'text-rose-500' : 'text-zinc-300'
                      }`}
                    />
                    <span className="text-[10px] text-zinc-600 font-black uppercase">Units</span>
                  </div>
                </td>

                {/* INTERACTIVE PRICE CELL */}
                <td className="p-6">
                  <div className="flex items-center gap-2 group/price">
                    <span className="text-zinc-500 font-mono font-bold">$</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.price}
                      onChange={(e) => onPriceChange(item.product_id, parseFloat(e.target.value) || 0)}
                      className="w-24 bg-zinc-950/50 border border-zinc-800 rounded px-2 py-1 font-mono text-zinc-300 focus:border-emerald-500/50 outline-none transition-all"
                    />
                  </div>
                </td>

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
          </tbody>
        </table>
      </div>
    </section>
  );
}