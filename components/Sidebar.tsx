"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { X, Lock, Home, ShoppingBag, Info, Mail } from "lucide-react";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm"
                    />

                    {/* Sidebar Panel */}
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed top-0 left-0 bottom-0 z-[70] w-full max-w-sm bg-[#0A0A0A] border-r border-white/10 p-8 flex flex-col"
                    >
                        <div className="flex justify-between items-center mb-12">
                            <span className="text-2xl font-bold uppercase tracking-tighter text-white">LXRY</span>
                            <button
                                onClick={onClose}
                                className="p-2 text-white/60 hover:text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <nav className="flex-1">
                            <ul className="space-y-6">
                                <li>
                                    <Link href="/#home" onClick={onClose} className="flex items-center gap-4 text-2xl font-light uppercase tracking-widest text-white/80 hover:text-white transition-colors group">
                                        <Home className="w-5 h-5 text-white/40 group-hover:text-white transition-colors" />
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/#collection" onClick={onClose} className="flex items-center gap-4 text-2xl font-light uppercase tracking-widest text-white/80 hover:text-white transition-colors group">
                                        <ShoppingBag className="w-5 h-5 text-white/40 group-hover:text-white transition-colors" />
                                        Collection
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/#about" onClick={onClose} className="flex items-center gap-4 text-2xl font-light uppercase tracking-widest text-white/80 hover:text-white transition-colors group">
                                        <Info className="w-5 h-5 text-white/40 group-hover:text-white transition-colors" />
                                        About
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/#contact" onClick={onClose} className="flex items-center gap-4 text-2xl font-light uppercase tracking-widest text-white/80 hover:text-white transition-colors group">
                                        <Mail className="w-5 h-5 text-white/40 group-hover:text-white transition-colors" />
                                        Contact
                                    </Link>
                                </li>
                            </ul>
                        </nav>

                        <div className="pt-8 border-t border-white/10">
                            <Link href="/admin/login" onClick={onClose} className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors">
                                <Lock className="w-4 h-4" />
                                Admin Access
                            </Link>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
