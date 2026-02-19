"use client";

import React, { useState, useEffect } from 'react';
import { ShoppingCart, X, Loader2 } from 'lucide-react'; 

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

interface CartProps {
    onRemove?: (id: string) => void;
}

const Cart: React.FC<CartProps> = ({ onRemove }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [items, setItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 1. Fetch Cart Data
    useEffect(() => {
        const fetchCart = async () => {
            setIsLoading(true);
            const token = localStorage.getItem('access_token'); // Or your preferred token storage
            console.log('Fetching cart with token:', token);
            try {
                const response = await fetch('/api/orders/getUsersCart', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },// Add this if the server expects a body
                });

                if (!response.ok) throw new Error('Failed to fetch cart');

                const data = await response.json();
                setItems(data.items || []);
            } catch (err) {
                setError('Could not load your specimen box.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCart();
    }, []);

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
                <ShoppingCart size={18} />
                <span>Cart</span>
                <span className="ml-1 rounded-md bg-emerald-500 px-1.5 py-0.5 text-[10px] text-white">
                    {items.length}
                </span>
            </button>

            {/* Sidebar */}
            <div className={`
                fixed right-0 top-0 h-screen w-full sm:w-96 bg-white dark:bg-zinc-950 
                border-l border-zinc-200 dark:border-zinc-800 
                shadow-[-20px_0_50px_rgba(0,0,0,0.2)] 
                transition-transform duration-300 ease-in-out z-[60]
                ${isOpen ? 'translate-x-0' : 'translate-x-full'}
            `}>
                <div className="flex h-full flex-col">
                    <div className="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-zinc-900">
                        <h2 className="text-xl font-black uppercase tracking-tight">Your Specimen Box</h2>
                        <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center h-40 gap-2">
                                <Loader2 className="animate-spin text-zinc-400" />
                                <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest">Excavating...</p>
                            </div>
                        ) : error ? (
                            <p className="text-rose-500 text-sm">{error}</p>
                        ) : items.length === 0 ? (
                            <p className="text-zinc-500 text-sm">Your cart is as empty as the Cretaceous period.</p>
                        ) : (
                            items.map(item => (
                                <div key={item.id} className="flex justify-between mb-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
                                    <div>
                                        <p className="font-bold text-sm">{item.name}</p>
                                        <p className="text-xs text-zinc-500">{item.quantity}x — ${item.price}</p>
                                    </div>
                                    <button
                                        onClick={() => onRemove?.(item.id)}
                                        className="text-[10px] font-bold text-rose-500 uppercase hover:underline"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="p-6 border-t border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/50">
                        <div className="flex justify-between mb-6">
                            <span className="text-zinc-500 uppercase text-xs font-black">Subtotal</span>
                            <span className="font-black text-lg">${total.toFixed(2)}</span>
                        </div>
                        <button
                            disabled={items.length === 0}
                            className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-700 disabled:text-zinc-500 text-black font-black py-4 rounded-xl uppercase text-xs tracking-widest transition-all"
                        >
                            Checkout
                        </button>
                    </div>
                </div>
            </div>

            {/* Overlay Logic */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-[55] bg-black/20 backdrop-blur-[2px]"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
};

export default Cart;