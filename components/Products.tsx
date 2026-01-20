"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface Product {
    id: string;
    name: string;
    price: string;
    image: string;
    description: string;
    sale: boolean;
    discount: number;
}

import { Suspense } from "react";

export default function Products() {
    return (
        <Suspense fallback={<div className="text-center text-white/20 py-20 uppercase tracking-widest text-xs">Loading Collection...</div>}>
            <ProductList />
        </Suspense>
    );
}

function ProductList() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const query = searchParams.get("q");
                const url = query ? `/api/products?q=${encodeURIComponent(query)}` : '/api/products';
                const res = await fetch(url);
                const data = await res.json();
                setProducts(data);
            } catch (error) {
                console.error("Failed to load products", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [searchParams]);

    if (loading) {
        return (
            <section className="relative z-20 bg-[#0A0A0A] py-32 px-6 md:px-12 min-h-[50vh] flex items-center justify-center">
                <div className="text-white/20 animate-pulse uppercase tracking-widest text-xs">Loading Collection...</div>
            </section>
        )
    }

    return (
        <section id="collection" className="relative z-20 bg-[#0A0A0A] py-32 px-6 md:px-12">
            <div className="max-w-7xl mx-auto">
                <h3 className="mb-16 text-3xl font-light uppercase tracking-widest text-white/80">
                    Selected Works
                </h3>

                {products.length === 0 ? (
                    <div className="text-center text-white/40 py-20 uppercase tracking-widest text-sm">No items available.</div>
                ) : (
                    <div className="grid grid-cols-1 gap-y-16 gap-x-8 md:grid-cols-2 lg:grid-cols-4">
                        {products.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                            >
                                <Link href={`/product/${product.id}`} className="group relative cursor-pointer block">
                                    <div className="relative aspect-[3/4] overflow-hidden bg-neutral-900 border border-white/10 transition-colors duration-300 group-hover:border-white/30">
                                        {/* Sale Tag */}
                                        {product.sale && (
                                            <div className="absolute top-2 right-2 z-10 bg-white text-black text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
                                                {product.discount}% OFF
                                            </div>
                                        )}

                                        {/* Image Placeholder */}
                                        <div className="absolute inset-0 bg-neutral-800 animate-pulse group-hover:animate-none transition-opacity duration-500" />
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 group-hover:brightness-110"
                                        />

                                        {/* Overlay Gradient */}
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                        {/* Shop Now Button */}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100">
                                            <span className="bg-white/90 backdrop-blur-sm text-black px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors">
                                                Shop Now
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex justify-between items-start">
                                        <div>
                                            <h4 className="text-lg font-normal text-white">{product.name}</h4>
                                            <p className="text-sm text-white/50">{product.description || "SS26 Collection"}</p>
                                        </div>
                                        <span className="text-lg font-light text-white">{product.price}</span>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
