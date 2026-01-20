"use client";

import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Script from "next/script";

export default function CheckoutPage() {
    const { items, getCartTotal, clearCart } = useCart();
    const router = useRouter();
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        address: "",
        city: "",
        zip: "",
        phone: ""
    });

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
            alert("Razorpay Key ID is not configured");
            return;
        }

        const amount = getCartTotal();

        // 1. Create Order via API
        try {
            const res = await fetch("/api/razorpay", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount }),
            });
            const order = await res.json();

            if (order.error) {
                alert("Payment processing error: " + order.error);
                return;
            }

            // 2. Open Razorpay
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Frontend key
                amount: order.amount,
                currency: order.currency,
                name: "LXRY Clothing",
                description: "Order Payment",
                order_id: order.id,
                handler: function (response: any) {
                    // Payment Success
                    console.log("Payment Successful", response);
                    setSuccess(true);
                    clearCart();
                },
                prefill: {
                    name: formData.name,
                    email: formData.email,
                    contact: formData.phone,
                },
                theme: {
                    color: "#000000",
                },
            };

            if (!(window as any).Razorpay) {
                alert("Razorpay SDK is still loading. Please try again in 3 seconds.");
                return;
            }

            const rzp1 = new (window as any).Razorpay(options);
            rzp1.open();
        } catch (error: any) {
            console.error("Payment Error:", error);
            alert("Payment Initialization Failed: " + (error?.message || error));
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center text-white p-6">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-[#111] p-12 border border-white/10 max-w-md w-full text-center"
                >
                    <div className="flex justify-center mb-6">
                        <CheckCircle className="w-16 h-16 text-green-500" />
                    </div>
                    <h1 className="text-2xl font-bold uppercase tracking-widest mb-4">Order Confirmed</h1>
                    <p className="text-white/60 mb-8">Thank you for your purchase. We will contact you regarding your delivery.</p>
                    <Link href="/" className="inline-block bg-white text-black px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition-colors">
                        Return Home
                    </Link>
                </motion.div>
            </div>
        )
    }

    if (items.length === 0) {
        router.push('/cart');
        return null;
    }

    return (
        <>
            {/* Load Razorpay Script */}
            {/* Load Razorpay Script */}
            <Script
                src="https://checkout.razorpay.com/v1/checkout.js"
                strategy="lazyOnload"
            />

            <div className="min-h-screen bg-[#0A0A0A] text-white pt-32 pb-20 px-6 md:px-12">
                <div className="max-w-6xl mx-auto">
                    <Link href="/cart" className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-12 transition-colors uppercase tracking-widest text-xs">
                        <ArrowLeft className="w-4 h-4" /> Back to Cart
                    </Link>

                    <h1 className="text-3xl font-light uppercase tracking-widest mb-16 border-b border-white/10 pb-6">
                        Secure Checkout
                    </h1>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        {/* Form */}
                        <div>
                            <h2 className="text-sm font-bold uppercase tracking-widest mb-6">Shipping Details</h2>
                            <form onSubmit={handlePayment} className="space-y-6">
                                {/* ... [Existing Inputs kept same, just verify they bind to formData] ... */}
                                {/* Re-rendering inputs for clarity as ReplaceBlock needs exact match or full replacement */}
                                <div className="space-y-2">
                                    <label className="text-xs uppercase text-white/40">Full Name</label>
                                    <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-white transition-colors outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase text-white/40">Email</label>
                                    <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-white transition-colors outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase text-white/40">Address</label>
                                    <input required value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-white transition-colors outline-none" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs uppercase text-white/40">City</label>
                                        <input required value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-white transition-colors outline-none" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs uppercase text-white/40">Zip Code</label>
                                        <input required value={formData.zip} onChange={e => setFormData({ ...formData, zip: e.target.value })} className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-white transition-colors outline-none" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase text-white/40">Phone</label>
                                    <input type="tel" required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-white transition-colors outline-none" />
                                </div>

                                <div className="pt-8 mt-8 border-t border-white/10">
                                    <h2 className="text-sm font-bold uppercase tracking-widest mb-6">Payment Method</h2>
                                    <div className="border border-white/20 bg-white/5 p-4 flex items-center gap-4">
                                        <div className="w-4 h-4 rounded-full border-[5px] border-white bg-transparent"></div>
                                        <span className="uppercase tracking-widest text-sm font-bold">Razorpay Secure</span>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-white text-black py-4 mt-8 font-bold uppercase tracking-widest hover:bg-neutral-200 transition-colors"
                                >
                                    Pay Now &mdash; ${getCartTotal().toFixed(2)}
                                </button>
                            </form>
                        </div>

                        {/* Summary */}
                        <div className="bg-[#111] p-8 border border-white/10 h-fit">
                            <h2 className="text-sm font-bold uppercase tracking-widest mb-6 border-b border-white/10 pb-4">Your Order</h2>
                            <div className="space-y-4 mb-6">
                                {items.map(item => (
                                    <div key={item.id} className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-neutral-800 flex items-center justify-center relative">
                                                <img src={item.image} className="w-full h-full object-cover opacity-60" />
                                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-white text-black text-[9px] flex items-center justify-center rounded-full font-bold">
                                                    {item.quantity}
                                                </span>
                                            </div>
                                            <span className="text-white/80">{item.name}</span>
                                        </div>
                                        <span className="text-white/60">{item.price}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between items-center border-t border-white/10 pt-4">
                                <span className="text-sm uppercase text-white/60">Total to Pay</span>
                                <span className="text-xl">${getCartTotal().toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
