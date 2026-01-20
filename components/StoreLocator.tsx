"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export default function StoreLocator() {
    return (
        <section className="relative w-full h-[60vh] bg-[#0A0A0A] border-t border-white/10 group overflow-hidden">
            {/* Google Maps Iframe - SoHo NYC */}
            <div className="absolute inset-0 filter grayscale invert contrast-125 opacity-60 transition-all duration-700 group-hover:grayscale-0 group-hover:invert-0 group-hover:opacity-100">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3023.2384970425835!2d-74.00297042327092!3d40.72376693621458!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c2598c199e4f49%3A0xe546b53a06708bf9!2sSoHo%2C%20New%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1705590000000!5m2!1sen!2sus"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="pointer-events-none" // Disable interaction with iframe directly
                ></iframe>
            </div>

            {/* Overlay Content */}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="text-center"
                >
                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white mix-blend-difference mb-4">
                        Our Story
                    </h2>
                    <p className="text-sm md:text-base font-bold uppercase tracking-widest text-white mix-blend-difference">
                        Born in New York City
                    </p>
                </motion.div>
            </div>

            {/* Clickable Overlay */}
            <a
                href="https://www.google.com/maps/place/SoHo,+New+York,+NY"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 hover:bg-black/0 transition-colors cursor-pointer"
            >
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white text-black px-6 py-3 flex items-center gap-2 font-bold uppercase tracking-widest transform translate-y-4 group-hover:translate-y-0">
                    Open Map <ArrowUpRight className="w-4 h-4" />
                </div>
            </a>
        </section>
    );
}
