"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface IntroOverlayProps {
    onComplete: () => void;
}

export default function IntroOverlay({ onComplete }: IntroOverlayProps) {
    const [status, setStatus] = useState<"idle" | "transitioning" | "playing">("idle");
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const handleInteraction = () => {
            if (status === "idle") {
                setStatus("transitioning");
                // Start video logic after text fade
                setTimeout(() => {
                    setStatus("playing");
                }, 1000); // 1s transition matching the text fade out
            }
        };

        window.addEventListener("keydown", handleInteraction);
        window.addEventListener("click", handleInteraction);

        return () => {
            window.removeEventListener("keydown", handleInteraction);
            window.removeEventListener("click", handleInteraction);
        };
    }, [status]);

    useEffect(() => {
        if (status === "playing" && videoRef.current) {
            videoRef.current.play().catch(e => console.error("Video play failed", e));
        }
    }, [status]);

    return (
        <motion.div
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden"
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
        >
            {/* Video Layer - Always mounted to be ready, but visible only when playing */}
            {/* Using opacity to avoid DOM reconstruction flicker */}
            <div className={`absolute inset-0 transition-opacity duration-100 ${status === "playing" ? "opacity-100" : "opacity-0"}`}>
                <video
                    ref={videoRef}
                    src="/intro.mp4"
                    className="w-full h-full object-cover"
                    onEnded={onComplete}
                    muted={false}
                    playsInline
                    preload="auto"
                />
            </div>

            {/* Background Layer - Visible in idle and transitioning */}
            {status !== "playing" && (
                <div
                    className="absolute inset-0 z-10 bg-cover bg-center"
                    style={{ backgroundImage: "url('/intro-bg.png')" }}
                />
            )}

            {/* Text Layer - Animates out during transition */}
            <AnimatePresence>
                {(status === "idle" || status === "transitioning") && (
                    <div className="relative z-20 text-center">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={
                                status === "idle"
                                    ? { opacity: [0, 1, 0] }
                                    : {
                                        opacity: [1, 0, 1, 0, 1, 0], // Rapid flicker
                                        scaleX: [1, 1.5, 0.5, 1.2, 0], // Horizontal glitch stretching
                                        x: [0, 10, -10, 5, 0], // Jitter
                                        filter: ["none", "blur(2px)", "none", "blur(5px)", "none"]
                                    }
                            }
                            transition={
                                status === "idle"
                                    ? { duration: 0.8, repeat: Infinity, ease: "linear" }
                                    : { duration: 0.5, times: [0, 0.2, 0.4, 0.6, 0.8, 1] } // Fast 0.5s glitch
                            }
                            className="text-white text-2xl md:text-5xl font-bold uppercase tracking-[0.5em] cursor-pointer font-[family-name:var(--font-orbitron)] drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                        >
                            ENTER
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
