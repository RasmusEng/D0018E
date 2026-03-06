'use client';

import React, { useState, useRef, useEffect } from 'react';

export interface Order {
  order_id: number;
  user_id: number;
  order_state: 'pending' | 'complete' | 'canceled';
  order_date: string | null;
  shipped_date: string | null;
}

interface AdminOrdersProps {
  orders: Order[];
  onRefresh?: () => void;
  onOrderStatusChange: (orderId: number, newStatus: string) => Promise<void>;
}

const STATUS_MAP: Record<string, { label: string, color: string, bg: string, border: string }> = {
  pending: { label: 'Pending', color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  complete: { label: 'Complete', color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  canceled: { label: 'Canceled', color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
};

const StatusDropdown = ({
  orderId,
  currentStatus,
  onChange
}: {
  orderId: number,
  currentStatus: string,
  onChange: (id: number, status: string) => Promise<void>
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const active = STATUS_MAP[currentStatus] || {
    label: currentStatus || 'Unknown',
    color: 'text-zinc-400',
    bg: 'bg-zinc-800/50',
    border: 'border-zinc-700'
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleUpdate = async (newStatus: string) => {
    if (newStatus === currentStatus) {
      setIsOpen(false);
      return;
    }
    setIsUpdating(true);
    await onChange(orderId, newStatus);
    setIsUpdating(false);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !isUpdating && setIsOpen(!isOpen)}
        disabled={isUpdating}
        className={`px-3 py-1.5 rounded text-[10px] font-black border uppercase tracking-widest flex items-center justify-between w-32 transition-all duration-200 outline-none 
          ${active.bg} ${active.color} ${active.border} 
          ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'hover:border-current cursor-pointer'}`}
      >
        {isUpdating ? 'Updating...' : active.label}
        {!isUpdating && (
          <span className={`ml-2 text-[8px] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
            ▼
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-32 rounded-lg border border-zinc-700 bg-zinc-900 shadow-2xl overflow-hidden">
          {Object.keys(STATUS_MAP).map((statusKey) => (
            <button
              key={statusKey}
              onClick={() => handleUpdate(statusKey)}
              className={`w-full text-left px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-colors hover:bg-zinc-800 ${STATUS_MAP[statusKey].color}`}
            >
              {STATUS_MAP[statusKey].label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const AdminOrders: React.FC<AdminOrdersProps> = ({ orders, onRefresh, onOrderStatusChange }) => {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 h-[700px] flex flex-col shadow-2xl">
      {/* HEADER: shrink-0 keeps it from squashing */}
      <div className="flex justify-between items-center mb-6 shrink-0">
        <h2 className="text-xl font-black uppercase tracking-tighter text-zinc-100 flex items-center gap-3">
          <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
          Order Manifest
        </h2>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="text-zinc-500 text-[10px] font-black uppercase hover:text-white transition-colors tracking-widest"
          >
            Refresh Feed
          </button>
        )}
      </div>

      {/* SCROLLABLE AREA: flex-grow expands to fill the 700px card */}
      <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
        <table className="min-w-full border-collapse text-sm relative">
          <thead className="sticky top-0 z-20 bg-zinc-900">
            <tr className="border-b border-zinc-800 text-zinc-500 uppercase tracking-[0.2em] text-[10px]">
              <th className="py-3 text-left font-black bg-zinc-900">ID</th>
              <th className="py-3 text-left font-black bg-zinc-900">User</th>
              <th className="py-3 text-left font-black bg-zinc-900">Status</th>
              <th className="py-3 text-right font-black bg-zinc-900">Logged</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50 text-zinc-300">
            {orders.map((order) => (
              <tr key={order.order_id} className="hover:bg-zinc-800/20 transition-colors group">
                <td className="py-4 font-mono text-emerald-500 font-bold">#{order.order_id}</td>
                <td className="py-4 font-mono text-[10px] text-zinc-500 group-hover:text-zinc-400">U-{order.user_id}</td>
                <td className="py-4">
                  <StatusDropdown
                    orderId={order.order_id}
                    currentStatus={order.order_state}
                    onChange={onOrderStatusChange}
                  />
                </td>
                <td className="py-4 font-mono text-[10px] text-right text-zinc-500 group-hover:text-zinc-400">
                  {order.order_date ? new Date(order.order_date).toLocaleDateString() : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FOOTER: Quick stats at the bottom */}
      <div className="mt-4 pt-4 border-t border-zinc-800 shrink-0 flex justify-between text-[9px] font-black uppercase text-zinc-600 tracking-widest">
        <span>Records: {orders.length}</span>
        <span>Secure Stream Active</span>
      </div>

      {/* Inline Styles for Custom Scrollbar */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #27272a;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #3f3f46;
        }
      `}</style>
    </div>
  );
};

export default AdminOrders;