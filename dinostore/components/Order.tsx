import React from 'react';

export interface Order {
  order_id: number;
  user_id: number;
  order_status: number;
  order_date: string | null;
  shipped_date: string | null;
}

interface AdminOrdersProps {
  orders: Order[];
}

const AdminOrders: React.FC<AdminOrdersProps> = ({ orders }) => {
  const getStatusBadge = (statusCode: number) => {
    switch (statusCode) {
      case 0:
        return <span className="px-2 py-1 rounded text-[10px] font-black bg-amber-500/10 text-amber-500 border border-amber-500/30 uppercase tracking-widest">Pending</span>;
      case 1:
        return <span className="px-2 py-1 rounded text-[10px] font-black bg-blue-500/10 text-blue-500 border border-blue-500/30 uppercase tracking-widest">Processing</span>;
      case 2:
        return <span className="px-2 py-1 rounded text-[10px] font-black bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 uppercase tracking-widest">Dispatched</span>;
      default:
        return <span className="px-2 py-1 rounded text-[10px] font-black bg-zinc-500/10 text-zinc-400 border border-zinc-500/30 uppercase tracking-widest">Code: {statusCode}</span>;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return <span className="text-zinc-600 italic">Unclassified</span>;
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 h-full">
      <h2 className="text-xl font-black uppercase tracking-tighter text-zinc-100 mb-6 flex items-center gap-3">
        <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
        Order Manifest
      </h2>
      
      {orders.length === 0 ? (
        <p className="text-zinc-500 text-sm font-mono">NO ACTIVE DISPATCHES FOUND.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-500 uppercase tracking-[0.2em] text-[10px]">
                <th className="py-3 text-left font-black">ID</th>
                <th className="py-3 text-left font-black">User</th>
                <th className="py-3 text-left font-black">Status</th>
                <th className="py-3 text-left font-black">Logged</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50 text-zinc-300">
              {orders.map((order) => (
                <tr key={order.order_id} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="py-4 font-mono text-emerald-500">{order.order_id}</td>
                  <td className="py-4 font-mono">U-{order.user_id}</td>
                  <td className="py-4">{getStatusBadge(order.order_status)}</td>
                  <td className="py-4 font-mono text-xs">{formatDate(order.order_date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;