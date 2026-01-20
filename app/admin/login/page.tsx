"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";

export default function AdminLogin() {
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (id === "admin" && password === "lxry2026") {
            // Set cookie manually for simplicity (in a real app, use HTTP-only cookies via API)
            document.cookie = "admin_auth=true; path=/; max-age=3600";
            router.push("/admin/dashboard");
        } else {
            setError("Invalid credentials");
        }
    };



    return (
        <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-[#111] border border-white/10 p-8"
            >
                <div className="flex flex-col items-center mb-8">
                    <Lock className="w-8 h-8 text-white mb-4" />
                    <h1 className="text-xl font-bold uppercase tracking-widest text-white">Admin Access</h1>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs uppercase tracking-widest text-center">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-white/60">Admin ID</label>
                        <input
                            type="text"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-white transition-colors outline-none"
                            placeholder="ENTER ID"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-white/60">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-white transition-colors outline-none"
                            placeholder="ENTER PASSWORD"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-white text-black font-bold uppercase tracking-widest py-4 hover:bg-neutral-200 transition-colors"
                    >
                        Enter Dashboard
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
