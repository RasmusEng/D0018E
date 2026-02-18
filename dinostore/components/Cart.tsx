'use client';

import React, { useState } from 'react';

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

interface CartProps {
    items?: CartItem[];
    onRemove?: (id: string) => void;
}

const Cart: React.FC<CartProps> = ({ items = [], onRemove }) => {
    const [isOpen, setIsOpen] = useState(false);
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <>
            {/* Cart Button */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="rounded-full bg-zinc-900 px-4 py-2 text-white transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
                Cart ({items.length})
            </button>

            {/* Cart Modal */}
            {isOpen && (
                <div className="fixed right-0 top-16 z-50 w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-950 shadow-2xl">
                    {/* Header */}
                    <div className="border-b border-zinc-800 p-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-black text-white">Shopping Cart</h2>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="text-zinc-500 hover:text-white transition-colors"
                            >
                                
                            </button>
                        </div>
                    </div>

                    {/* Cart Items */}
                    <div className="max-h-96 overflow-y-auto p-6">
                        {items.length === 0 ? (
                            <p className="text-center text-zinc-500 py-8">Your cart is empty</p>
                        ) : (
                            <div className="space-y-4">
                                {items.map((item) => (
                                    <div 
                                        key={item.id}
                                        className="flex items-center justify-between rounded-2xl bg-zinc-900/50 p-4 border border-zinc-800"
                                    >
                                        <div className="flex-1">
                                            <h3 className="font-bold text-white">{item.name}</h3>
                                            <p className="text-sm text-zinc-400 mt-1">
                                                {item.quantity}x ${item.price.toFixed(2)}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-black text-emerald-400">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </p>
                                            {onRemove && (
                                                <button
                                                    onClick={() => onRemove(item.id)}
                                                    className="text-xs text-zinc-500 hover:text-rose-400 transition-colors mt-2"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer with Total and Checkout */}
                    {items.length > 0 && (
                        <div className="border-t border-zinc-800 p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-zinc-400 font-bold">Total:</span>
                                <span className="text-2xl font-black text-emerald-400">
                                    ${total.toFixed(2)}
                                </span>
                            </div>
                            <button className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black py-3 rounded-2xl transition-colors uppercase tracking-widest text-sm shadow-[0_0_30px_-5px_rgba(16,185,129,0.4)]">
                                Proceed to Checkout
                            </button>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default Cart;
