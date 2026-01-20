"use client";

import { useRef, useEffect, useState } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import { useImagePreloader } from "@/hooks/useImagePreloader";
import { clsx } from "clsx";

interface ScrollyCanvasProps {
    frameCount: number;
}

export default function ScrollyCanvas({ frameCount }: ScrollyCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    const { images, isLoading } = useImagePreloader(frameCount);

    // Render loop
    useEffect(() => {
        if (!canvasRef.current || images.length === 0) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Handle Resize
        const handleResize = () => {
            if (!canvas) return;
            // Set canvas size to window size for high quality
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            // Initial draw to avoid blank screen
            const currentProgress = scrollYProgress.get();
            const frameIndex = Math.min(
                frameCount - 1,
                Math.floor(currentProgress * (frameCount - 1))
            );
            renderFrame(frameIndex);
        };

        const renderFrame = (index: number) => {
            const img = images[index];
            if (!img || !ctx || !canvas) return;

            // Draw image cover logic
            const hRatio = canvas.width / img.width;
            const vRatio = canvas.height / img.height;
            const ratio = Math.max(hRatio, vRatio);

            const centerShift_x = (canvas.width - img.width * ratio) / 2;
            const centerShift_y = (canvas.height - img.height * ratio) / 2;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(
                img,
                0,
                0,
                img.width,
                img.height,
                centerShift_x,
                centerShift_y,
                img.width * ratio,
                img.height * ratio
            );
        };

        window.addEventListener("resize", handleResize);
        handleResize(); // Initial resize

        // Subscribe to scroll changes
        const unsubscribe = scrollYProgress.on("change", (latest) => {
            const frameIndex = Math.min(
                frameCount - 1,
                Math.floor(latest * (frameCount - 1))
            );
            requestAnimationFrame(() => renderFrame(frameIndex));
        });

        return () => {
            window.removeEventListener("resize", handleResize);
            unsubscribe();
        };
    }, [images, scrollYProgress, frameCount]);

    return (
        <div ref={containerRef} className="relative h-[500vh] bg-[#0A0A0A]">
            <div className="sticky top-0 h-screen w-full overflow-hidden">
                {isLoading && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#0A0A0A] text-white">
                        <div className="text-xs uppercase tracking-widest animate-pulse">Loading Collection...</div>
                    </div>
                )}
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 h-full w-full object-cover"
                />
            </div>
        </div>
    );
}
