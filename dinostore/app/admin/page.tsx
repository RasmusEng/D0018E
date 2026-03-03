import Link from "next/link";

// Mock Data (Replace with your actual database/API calls)
const facilityStats = [
  { label: "Active Specimens", value: "142", trend: "+3 this month" },
  { label: "Containment Breaches", value: "0", trend: "Last 30 days", highlight: true },
  { label: "Pending Transports", value: "8", trend: "Requires approval" },
  { label: "Total Revenue (Q1)", value: "$4.2B", trend: "+12% YoY" },
];

const inventory = [
  { id: "TRX-01", name: "Tyrannosaurus Rex", status: "Contained", stock: 2, price: "$45M" },
  { id: "VLR-04", name: "Velociraptor", status: "Breeding", stock: 14, price: "$8M" },
  { id: "TCK-02", name: "Triceratops", status: "Contained", stock: 6, price: "$12M" },
  { id: "SPN-01", name: "Spinosaurus", status: "Quarantine", stock: 1, price: "$55M" },
];

const recentOrders = [
  { id: "TRN-9921", buyer: "InGen Corp", item: "Velociraptor x2", status: "Processing" },
  { id: "TRN-9920", buyer: "BioSyn", item: "Triceratops x1", status: "Shipped" },
  { id: "TRN-9919", buyer: "Classified", item: "T-Rex Embryo", status: "Pending" },
];

export default async function AdminDashboard() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/30 p-6 md:p-12">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b border-zinc-800 pb-8 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="h-3 w-3 rounded-full bg-rose-500 animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.6)]" />
            <span className="text-zinc-500 font-black uppercase tracking-[0.3em] text-[10px]">
              Level 5 Clearance Required
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">
            Facility Mainframe
          </h1>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <Link href="/" className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-white px-6 py-3 rounded-xl font-bold uppercase text-xs transition-all text-center flex-1 md:flex-none">
            Exit to Store
          </Link>
          <button className="bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-3 rounded-xl font-black uppercase text-xs transition-all active:scale-[0.98] flex-1 md:flex-none">
            + New Specimen
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto space-y-12">
        
        {/* Stats Matrix */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {facilityStats.map((stat, i) => (
            <div key={i} className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl hover:bg-zinc-900 transition-colors">
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-2">{stat.label}</p>
              <p className="text-4xl font-black mb-2">{stat.value}</p>
              <p className={`text-xs font-bold ${stat.highlight ? 'text-emerald-500' : 'text-zinc-600'}`}>
                {stat.trend}
              </p>
            </div>
          ))}
        </section>

        {/* Two Column Layout for Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Inventory Management */}
          <section className="lg:col-span-2 bg-zinc-900/50 border border-zinc-800 rounded-[2rem] overflow-hidden">
            <div className="p-8 border-b border-zinc-800 flex justify-between items-center bg-zinc-900">
              <h2 className="text-xl font-black uppercase tracking-tighter">Specimen Inventory</h2>
              <button className="text-emerald-500 text-xs font-bold uppercase tracking-widest hover:text-emerald-400">View All →</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-950/50 border-b border-zinc-800 text-[10px] uppercase tracking-widest text-zinc-500">
                    <th className="p-6 font-black">ID</th>
                    <th className="p-6 font-black">Species</th>
                    <th className="p-6 font-black">Status</th>
                    <th className="p-6 font-black">Stock</th>
                    <th className="p-6 font-black">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50 text-sm font-medium">
                  {inventory.map((item) => (
                    <tr key={item.id} className="hover:bg-zinc-800/20 transition-colors group">
                      <td className="p-6 text-zinc-500 font-mono">{item.id}</td>
                      <td className="p-6 text-white font-bold">{item.name}</td>
                      <td className="p-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          item.status === 'Contained' ? 'bg-emerald-500/10 text-emerald-500' : 
                          item.status === 'Quarantine' ? 'bg-rose-500/10 text-rose-500' : 
                          'bg-amber-500/10 text-amber-500'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="p-6 text-zinc-300">{item.stock} Units</td>
                      <td className="p-6 text-zinc-300">{item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Transport Logs */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-[2rem] overflow-hidden flex flex-col">
            <div className="p-8 border-b border-zinc-800 bg-zinc-900">
              <h2 className="text-xl font-black uppercase tracking-tighter">Transport Logs</h2>
            </div>
            <div className="p-6 flex-1 flex flex-col gap-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="p-5 border border-zinc-800 rounded-2xl bg-zinc-950/50 hover:border-zinc-700 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-zinc-500 font-mono text-xs">{order.id}</span>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${
                      order.status === 'Shipped' ? 'text-emerald-500' : 
                      order.status === 'Processing' ? 'text-amber-500' : 'text-zinc-500'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-white font-bold mb-1">{order.item}</p>
                  <p className="text-zinc-500 text-xs uppercase tracking-widest">Dest: {order.buyer}</p>
                </div>
              ))}
            </div>
            <div className="p-6 border-t border-zinc-800 bg-zinc-900/50 text-center">
              <button className="text-emerald-500 text-xs font-bold uppercase tracking-widest hover:text-emerald-400">
                Open Logistics Bay
              </button>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}