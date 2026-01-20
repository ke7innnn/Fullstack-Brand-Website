"use client";

import { Search, ShoppingBag, User, Menu } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";

import { Suspense } from "react";

export default function Header() {
    return (
        <Suspense fallback={<div className="fixed top-0 left-0 right-0 h-20 bg-[#1a1a1a] z-50"></div>}>
            <HeaderContent />
        </Suspense>
    );
}

function HeaderContent() {
    const { data: session } = useSession();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const { totalItems } = useCart();

    useEffect(() => {
        setSearchQuery(searchParams.get("q") || "");
    }, [searchParams]);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (searchQuery.length > 1) {
                try {
                    const res = await fetch(`/api/products?q=${encodeURIComponent(searchQuery)}`);
                    const data = await res.json();
                    setSuggestions(data.slice(0, 5)); // Limit to 5 suggestions
                    setShowDropdown(true);
                } catch (error) {
                    console.error("Failed to fetch suggestions", error);
                }
            } else {
                setSuggestions([]);
                setShowDropdown(false);
            }
        };

        const debounceTimer = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(debounceTimer);
    }, [searchQuery]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);

        // Update URL immediately for grid filtering (as per previous request)
        if (query) {
            router.push(`/?q=${encodeURIComponent(query)}`, { scroll: false });
        } else {
            router.push("/", { scroll: false });
        }
    };

    const handleSuggestionClick = (id: number) => {
        router.push(`/product/${id}`);
        setShowDropdown(false);
        setSuggestions([]);
    };

    return (
        <>
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <motion.header
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 md:px-12 bg-[#1a1a1a]/90 backdrop-blur-md border-b border-white/5"
            >
                {/* Left: Brand & Menu */}
                <div className="flex items-center gap-4 md:gap-8">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="text-white hover:text-white/70 transition-colors"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <Link href="/" className="text-2xl font-bold uppercase tracking-tighter text-white">
                        LXRY
                    </Link>
                </div>

                {/* Center / Search - Hidden on mobile, visible on md+ */}
                <div className="hidden md:flex items-center gap-2 border-b border-white/20 px-2 pb-1 mx-auto w-64 hover:border-white transition-colors duration-300 group relative">
                    <Search className="h-4 w-4 text-white/50 group-hover:text-white transition-colors" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearch}
                        onFocus={() => { if (suggestions.length > 0) setShowDropdown(true); }}
                        onBlur={() => setTimeout(() => setShowDropdown(false), 200)} // Delay to allow click
                        placeholder="SEARCH COLLECTION"
                        className="bg-transparent border-none outline-none text-xs tracking-widest text-white placeholder:text-white/30 w-full uppercase"
                    />

                    {/* Search Dropdown */}
                    <AnimatePresence>
                        {showDropdown && suggestions.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute top-full left-0 right-0 mt-4 bg-[#111] border border-white/10 shadow-2xl overflow-hidden z-50"
                            >
                                {suggestions.map((product) => (
                                    <div
                                        key={product.id}
                                        onClick={() => handleSuggestionClick(product.id)}
                                        className="flex items-center gap-3 p-3 hover:bg-white/5 cursor-pointer transition-colors border-b border-white/5 last:border-none"
                                    >
                                        <img src={product.image} alt={product.name} className="w-8 h-10 object-cover bg-neutral-800" />
                                        <div className="flex-1 min-w-0">
                                            <div className="text-[10px] font-bold text-white uppercase truncate">{product.name}</div>
                                            <div className="text-[10px] text-white/50">{product.price}</div>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Right / Cart & Auth */}
                <div className="flex items-center gap-6">
                    {session ? (
                        <div className="hidden md:flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                {session.user?.image ? (
                                    <img
                                        src={session.user.image}
                                        alt={session.user.name || "User"}
                                        className="h-6 w-6 rounded-full border border-white/20"
                                    />
                                ) : (
                                    <User className="h-4 w-4 text-white" />
                                )}
                                <span className="text-xs uppercase text-white tracking-widest">{session.user?.name?.split(" ")[0]}</span>
                            </div>
                            <button
                                onClick={() => signOut()}
                                className="text-xs font-medium uppercase tracking-widest text-white/60 hover:text-white transition-colors"
                            >
                                Sign Out
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => signIn("google")}
                            className="hidden md:block text-xs font-medium uppercase tracking-widest text-white hover:opacity-70 transition-opacity"
                        >
                            Account
                        </button>
                    )}

                    <Link href="/cart" className="flex items-center gap-2 text-white hover:opacity-70 transition-opacity">
                        <span className="hidden md:block text-xs font-medium uppercase tracking-widest">Cart</span>
                        <div className="relative">
                            <ShoppingBag className="h-5 w-5" />
                            <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-white text-[8px] font-bold text-black">
                                {totalItems}
                            </span>
                        </div>
                    </Link>
                </div>
            </motion.header>
        </>
    );
}
