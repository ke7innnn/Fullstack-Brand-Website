"use client";

import { useCart } from "@/context/CartContext";
import { Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CartPage() {
    const { items, removeFromCart, updateQuantity, getCartTotal } = useCart();

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center text-white px-6">
                <h1 className="text-2xl font-bold uppercase tracking-widest mb-4">Your Cart is Empty</h1>
                <p className="text-white/40 mb-8 max-w-md text-center">It looks like you haven't added any pieces to your collection yet.</p>
                <Link href="/" className="bg-white text-black px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition-colors">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white pt-32 pb-20 px-6 md:px-12">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-light uppercase tracking-widest mb-16 border-b border-white/10 pb-6">
                    Your Collection
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-8">
                        {items.map((item) => (
                            <motion.div
                                key={item.cartId}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="flex gap-6 p-4 bg-[#111] border border-white/5"
                            >
                                <img src={item.image} alt={item.name} className="w-24 h-32 object-cover bg-neutral-900" />

                                <div className="flex-1 flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-bold uppercase tracking-tighter">{item.name}</h3>
                                            <p className="text-white/40 text-xs mt-1">SS26 Collection</p>
                                            {item.size && (
                                                <p className="text-white/60 text-xs mt-2 uppercase tracking-widest font-bold">
                                                    Size: <span className="text-white">{item.size}</span>
                                                </p>
                                            )}
                                        </div>
                                        <span className="text-lg font-light">{item.price}</span>
                                    </div>

                                    <div className="flex justify-between items-end">
                                        {/* Quantity Controls */}
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                                                className="w-6 h-6 flex items-center justify-center border border-white/20 hover:border-white transition-colors"
                                            >
                                                <Minus className="w-2 h-2" />
                                            </button>
                                            <span className="text-sm w-6 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                                                className="w-6 h-6 flex items-center justify-center border border-white/20 hover:border-white transition-colors"
                                            >
                                                <Plus className="w-2 h-2" />
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => removeFromCart(item.cartId)}
                                            className="text-white/40 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-[#111] border border-white/10 p-8 sticky top-32">
                            <h2 className="text-sm font-bold uppercase tracking-widest mb-8">Order Summary</h2>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-sm text-white/60">
                                    <span>Subtotal</span>
                                    <span>${getCartTotal().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-white/60">
                                    <span>Shipping</span>
                                    <span>Free</span>
                                </div>
                                <div className="flex justify-between text-sm text-white/60">
                                    <span>Taxes</span>
                                    <span>Calculated at checkout</span>
                                </div>
                            </div>

                            <div className="border-t border-white/10 pt-6 mb-8 flex justify-between items-baseline">
                                <span className="font-bold uppercase tracking-widest">Total</span>
                                <span className="text-xl font-light">${getCartTotal().toFixed(2)}</span>
                            </div>

                            <Link href="/checkout" className="w-full bg-white text-black py-4 flex items-center justify-center gap-2 uppercase tracking-widest font-bold hover:bg-neutral-200 transition-colors">
                                Checkout <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
