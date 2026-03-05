import React, { useState, useRef, useEffect } from 'react';

export interface Order {
  order_id: number;
  user_id: number;
  order_status: number;
  order_date: string | null;
  shipped_date: string | null;
}

interface AdminOrdersProps {
  orders: Order[];
  onRefresh?: () => void;
  onOrderStatusChange?: (orderId: number, newStatus: number) => void;
}

// --- NEW: Custom Dropdown Component ---
const StatusDropdown = ({
  orderId,
  currentStatus,
  onChange
}: {
  orderId: number,
  currentStatus: number,
  onChange?: (id: number, status: number) => void
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close the dropdown if the user clicks outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Our strictly defined alternatives
  const alternatives = [
    { id: 0, label: 'Pending', color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
    { id: 1, label: 'Complete', color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
    { id: 2, label: 'Canceled', color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/30' }
  ];

  const active = alternatives.find(s => s.id === currentStatus) || alternatives[0];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => onChange && setIsOpen(!isOpen)}
        disabled={!onChange}
        className={`px-3 py-1.5 rounded text-[10px] font-black border uppercase tracking-widest flex items-center justify-between w-28 transition-all duration-200 outline-none ${active.bg} ${active.color} ${active.border} ${onChange ? 'hover:border-current cursor-pointer' : 'cursor-default'}`}
      >
        {active.label}
        {onChange && (
          <span className={`ml-2 text-[8px] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
            ▼
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-32 rounded-lg border border-zinc-700 bg-zinc-900 shadow-[0_0_15px_rgba(0,0,0,0.5)] overflow-hidden">
          <div className="py-1 flex flex-col">
            {alternatives.map((alt) => (
              <button
                key={alt.id}
                onClick={() => {
                  onChange?.(orderId, alt.id);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-colors hover:bg-zinc-800 ${alt.color}`}
              >
                {alt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// --- MAIN COMPONENT ---
const AdminOrders: React.FC<AdminOrdersProps> = ({ orders, onRefresh, onOrderStatusChange }) => {

  const formatDate = (dateString: string | null) => {
    if (!dateString) return <span className="text-zinc-600 italic">Unclassified</span>;
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-black uppercase tracking-tighter text-zinc-100 flex items-center gap-3">
          <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
          Order Manifest
        </h2>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="text-zinc-500 text-xs font-bold uppercase hover:text-white transition-colors"
          >
            Refresh Feed
          </button>
        )}
      </div>

      {orders.length === 0 ? (
        <div className="flex-grow flex items-center justify-center border border-dashed border-zinc-800 rounded-lg p-12">
          <p className="text-zinc-600 text-xs font-black uppercase tracking-widest animate-pulse">NO ACTIVE DISPATCHES FOUND.</p>
        </div>
      ) : (
        // FIX: Removed "pb-32", "min-h-[250px]", and any "overflow" classes entirely.
        // The table will now size naturally and allow the dropdown to float above everything else.
        <div className="w-full">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-500 uppercase tracking-[0.2em] text-[10px]">
                <th className="py-3 text-left font-black">ID</th>
                <th className="py-3 text-left font-black">User</th>
                <th className="py-3 text-left font-black">Status</th>
                <th className="py-3 text-right font-black">Logged</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50 text-zinc-300">
              {orders.map((order) => (
                <tr key={order.order_id} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="py-4 font-mono text-emerald-500 font-bold">#{order.order_id}</td>
                  <td className="py-4 font-mono text-xs">U-{order.user_id}</td>
                  <td className="py-4">
                    <StatusDropdown
                      orderId={order.order_id}
                      currentStatus={order.order_status}
                      onChange={onOrderStatusChange}
                    />
                  </td>
                  <td className="py-4 font-mono text-xs text-right">{formatDate(order.order_date)}</td>
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