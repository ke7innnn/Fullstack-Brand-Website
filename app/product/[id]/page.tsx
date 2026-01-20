"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, Plus, Minus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signIn } from "next-auth/react";
import { useCart } from "@/context/CartContext";

interface Product {
    id: string;
    name: string;
    price: string;
    image: string;
    description: string;
    sale: boolean;
    discount: number;
}

const SIZES = ["S", "M", "L", "XL", "XXL"];

// Simple Size Guide Modal Component
function SizeGuideModal({ onClose }: { onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-[#111] border border-white/10 p-8 w-full max-w-lg relative" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-white/40 hover:text-white">
                    <X className="w-6 h-6" />
                </button>
                <h3 className="text-xl font-bold uppercase tracking-widest text-white mb-6">Size Guide</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-white/70">
                        <thead className="uppercase tracking-widest text-white/40 border-b border-white/10">
                            <tr>
                                <th className="pb-3">Size</th>
                                <th className="pb-3">Chest (in)</th>
                                <th className="pb-3">Length (in)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <tr><td className="py-3 font-bold">S</td><td className="py-3">34 - 36</td><td className="py-3">27</td></tr>
                            <tr><td className="py-3 font-bold">M</td><td className="py-3">38 - 40</td><td className="py-3">28</td></tr>
                            <tr><td className="py-3 font-bold">L</td><td className="py-3">42 - 44</td><td className="py-3">29</td></tr>
                            <tr><td className="py-3 font-bold">XL</td><td className="py-3">46 - 48</td><td className="py-3">30</td></tr>
                            <tr><td className="py-3 font-bold">XXL</td><td className="py-3">50 - 52</td><td className="py-3">31</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default function ProductPage() {
    const params = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [showSizeGuide, setShowSizeGuide] = useState(false);
    const { data: session } = useSession();
    const { addToCart } = useCart();
    const [added, setAdded] = useState(false);
    const [error, setError] = useState("");

    // ... (useEffect remains the same)

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch('/api/products');
                const products = await res.json();
                const found = products.find((p: any) => p.id === params.id);
                setProduct(found || null);
            } catch (error) {
                console.error("Failed to fetch product", error);
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchProduct();
        }
    }, [params.id]);


    const handleAddToCart = () => {
        if (!session) {
            signIn("google");
            return;
        }

        if (!selectedSize) {
            setError("Please select a size");
            setTimeout(() => setError(""), 3000);
            return;
        }

        if (!product) return;
        addToCart(product, quantity, selectedSize);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    if (loading) {
        return <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-white/20 uppercase tracking-widest text-xs animate-pulse">Loading Product...</div>;
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center text-white gap-4">
                <div className="text-white/40 uppercase tracking-widest">Product Not Found</div>
                <Link href="/" className="text-xs uppercase border-b border-white pb-1">Return Home</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white pt-32 pb-20 px-6 md:px-12">

            <AnimatePresence>
                {showSizeGuide && <SizeGuideModal onClose={() => setShowSizeGuide(false)} />}
            </AnimatePresence>

            <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-12 transition-colors uppercase tracking-widest text-xs">
                <ArrowLeft className="w-4 h-4" /> Back to Collection
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-6xl mx-auto items-start">
                {/* Image */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative aspect-[3/4] bg-[#111] overflow-hidden border border-white/10"
                >
                    {product.sale && (
                        <div className="absolute top-4 right-4 z-10 bg-white text-black text-xs font-bold px-3 py-1 uppercase tracking-widest">
                            {product.discount}% OFF
                        </div>
                    )}
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </motion.div>

                {/* Details */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="space-y-8 sticky top-32"
                >
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter mb-4">{product.name}</h1>
                        <p className="text-2xl font-light text-white/80">{product.price}</p>
                    </div>

                    <div className="space-y-4 pt-8 border-t border-white/10">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Description</h3>
                        <p className="text-white/70 leading-relaxed font-light">
                            {product.description}
                        </p>
                    </div>

                    {/* Size Selection */}
                    <div className="pt-8">
                        <div className="flex justify-between items-center mb-3">
                            <label className="text-xs font-bold uppercase tracking-widest text-white/40 block">Size</label>
                            <button
                                onClick={() => setShowSizeGuide(true)}
                                className="text-[10px] uppercase tracking-widest text-white/60 hover:text-white underline decoration-white/30 hover:decoration-white transition-colors"
                            >
                                Size Guide
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {SIZES.map(size => (
                                <button
                                    key={size}
                                    onClick={() => { setSelectedSize(size); setError(""); }}
                                    className={`w-12 h-12 flex items-center justify-center border transition-all duration-300 text-xs font-bold uppercase ${selectedSize === size
                                        ? "bg-white text-black border-white"
                                        : "bg-transparent text-white border-white/20 hover:border-white/50"
                                        }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                        {error && (
                            <p className="mt-2 text-xs text-red-500 uppercase tracking-widest">{error}</p>
                        )}
                    </div>

                    {/* Quantity */}
                    <div className="pt-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-white/40 block mb-3">Quantity</label>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="w-10 h-10 flex items-center justify-center border border-white/20 hover:border-white transition-colors"
                            >
                                <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xl font-light w-8 text-center">{quantity}</span>
                            <button
                                onClick={() => setQuantity(quantity + 1)}
                                className="w-10 h-10 flex items-center justify-center border border-white/20 hover:border-white transition-colors"
                            >
                                <Plus className="w-3 h-3" />
                            </button>
                        </div>
                    </div>

                    <div className="pt-8">
                        <button
                            onClick={handleAddToCart}
                            disabled={added}
                            className={`w-full h-14 flex items-center justify-center gap-3 uppercase tracking-widest font-bold transition-colors disabled:opacity-80 disabled:cursor-not-allowed ${added ? "bg-[#222] text-white" : "bg-white text-black hover:bg-neutral-200"
                                }`}
                        >
                            {added ? (
                                "Added to Cart"
                            ) : (
                                <>
                                    <ShoppingBag className="w-4 h-4" /> Add to Cart
                                </>
                            )}
                        </button>
                        <p className="mt-4 text-center text-[10px] text-white/30 uppercase tracking-widest">
                            Free Worldwide Shipping on orders over $500
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
