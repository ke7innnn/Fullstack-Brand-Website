"use client";

import { motion } from "framer-motion";

export default function AboutSection() {
    return (
        <section id="about" className="relative z-20 bg-[#0A0A0A] py-32 px-6 md:px-12 border-t border-white/10">
            <div className="max-w-4xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-3xl md:text-4xl font-light uppercase tracking-widest text-white mb-12">
                        The Philosophy
                    </h2>
                    <p className="text-xl md:text-2xl text-white/70 font-light leading-relaxed mb-8">
                        LXRY is not just a brand; it is a movement towards a new aesthetic. We believe in the power of silence, the strength of structure, and the elegance of darkness.
                    </p>
                    <p className="text-sm md:text-base text-white/40 uppercase tracking-widest leading-loose">
                        Every piece is meticulously crafted to empower the wearer, blending the raw energy of the streets with the refined precision of high fashion. We don't chase trends; we define the future.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
