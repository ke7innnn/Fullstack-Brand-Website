"use client";

import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";

export default function Overlay() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    // Section 1: 0% - 20%
    const opacity1 = useTransform(scrollYProgress, [0, 0.1, 0.2], [1, 1, 0]);
    const y1 = useTransform(scrollYProgress, [0, 0.2], [0, -50]);

    // Section 2: 25% - 45%
    const opacity2 = useTransform(scrollYProgress, [0.25, 0.35, 0.45], [0, 1, 0]);
    const y2 = useTransform(scrollYProgress, [0.25, 0.45], [50, -50]);

    // Section 3: 50% - 70%
    const opacity3 = useTransform(scrollYProgress, [0.5, 0.6, 0.7], [0, 1, 0]);
    const y3 = useTransform(scrollYProgress, [0.5, 0.7], [50, -50]);

    return (
        <div ref={containerRef} className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-center">
            {/* Absolute positioning to place text in view */}

            {/* Slide 1 */}
            <motion.div
                style={{ opacity: opacity1, y: y1 }}
                className="fixed top-1/2 left-0 right-0 text-center transform -translate-y-1/2"
            >
                <h1 className="text-8xl font-light uppercase tracking-tighter text-white mix-blend-difference">
                    New Season <br /> Collection
                </h1>
                <p className="mt-4 text-sm uppercase tracking-[0.2em] text-neutral-400">
                    Designed for the bold
                </p>
            </motion.div>

            {/* Slide 2 */}
            <motion.div
                style={{ opacity: opacity2, y: y2 }}
                className="fixed top-1/2 left-10 md:left-32 transform -translate-y-1/2 text-left"
            >
                <h2 className="text-6xl font-thin text-white mix-blend-difference">
                    Sculpted <br /> Silhouettes
                </h2>
                <p className="mt-4 text-xs uppercase tracking-[0.2em] text-neutral-400">
                    Premium Fabrics / Archive Series
                </p>
            </motion.div>

            {/* Slide 3 */}
            <motion.div
                style={{ opacity: opacity3, y: y3 }}
                className="fixed top-1/2 right-10 md:right-32 transform -translate-y-1/2 text-right"
            >
                <h2 className="text-6xl font-thin text-white mix-blend-difference">
                    Street Meets <br /> Luxury
                </h2>
                <p className="mt-4 text-xs uppercase tracking-[0.2em] text-neutral-400">
                    Limited Edition / 001
                </p>
            </motion.div>
        </div>
    );
}
