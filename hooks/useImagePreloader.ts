import { useEffect, useState } from "react";

export const useImagePreloader = (frameCount: number) => {
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const loadImages = async () => {
            const loadedImages: HTMLImageElement[] = [];

            // Preload all frames
            const promises = Array.from({ length: frameCount }).map((_, i) => {
                return new Promise<HTMLImageElement>((resolve, reject) => {
                    const img = new Image();
                    // Format based on actual file names: ezgif-frame-XXX.jpg
                    const frameIndex = (i + 1).toString().padStart(3, "0");
                    img.src = `/sequence/ezgif-frame-${frameIndex}.jpg`;
                    img.onload = () => resolve(img);
                    img.onerror = (e) => {
                        console.error(`Failed to load frame ${frameIndex}`, e);
                        // Resolve anyway to prevent blocking, maybe resolve null or placeholder
                        resolve(img);
                    };
                });
            });

            try {
                const result = await Promise.all(promises);
                if (isMounted) {
                    setImages(result);
                    setIsLoading(false);
                }
            } catch (error) {
                console.error("Error loading images", error);
                if (isMounted) setIsLoading(false);
            }
        };

        loadImages();

        return () => {
            isMounted = false;
        };
    }, [frameCount]);

    return { images, isLoading };
};
