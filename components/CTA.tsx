"use client";

import { motion } from "framer-motion";
import { useState } from "react";

import Link from "next/link";

export default function CTA() {
    return (
        <section className="relative z-20 flex min-h-screen flex-col items-center justify-center bg-[#0A0A0A] px-6 text-center">
            <motion.h2
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="mb-12 text-7xl font-bold uppercase leading-none tracking-tighter text-white md:text-9xl mix-blend-difference"
            >
                Wear The <br /> Future
            </motion.h2>

            <div className="flex flex-col gap-6 md:flex-row">
                <MagneticButton text="Shop Collection" href="/#collection" primary />
                <MagneticButton text="View Journal" href="/#journal" />
            </div>
        </section>
    );
}

function MagneticButton({ text, href, primary = false }: { text: string; href: string; primary?: boolean }) {
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, clientY, currentTarget } = e;
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        const x = (clientX - (left + width / 2)) * 0.2;
        const y = (clientY - (top + height / 2)) * 0.2;
        setPosition({ x, y });
    };

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 });
    };

    return (
        <Link href={href} legacyBehavior>
            <motion.a
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                animate={{ x: position.x, y: position.y }}
                transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
                className={`
            relative overflow-hidden rounded-full px-12 py-4 text-sm font-medium uppercase tracking-widest transition-colors duration-300 inline-block cursor-pointer
            ${primary
                        ? "bg-white text-black hover:bg-neutral-200"
                        : "border border-white/20 text-white hover:bg-white/10 hover:border-white/40"}
          `}
            >
                <span className="relative z-10">{text}</span>
            </motion.a>
        </Link>
    );
}
