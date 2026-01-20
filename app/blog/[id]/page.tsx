"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

interface Blog {
    id: number;
    title: string;
    image: string;
    description: string;
    date: string;
    externalLink?: string;
}

export default function BlogPage() {
    const params = useParams();
    const [blog, setBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/blogs')
            .then(res => res.json())
            .then((data: Blog[]) => {
                const found = data.find(b => b.id === Number(params.id));
                setBlog(found || null);
                setLoading(false);
            });
    }, [params.id]);

    if (loading) {
        return <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-white/20 uppercase tracking-widest text-xs animate-pulse">Loading Story...</div>;
    }

    if (!blog) {
        return (
            <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center text-white gap-4">
                <div className="text-white/40 uppercase tracking-widest">Story Not Found</div>
                <Link href="/" className="text-xs uppercase border-b border-white pb-1">Return Home</Link>
            </div>
        );
    }

    return (
        <article className="min-h-screen bg-[#0A0A0A] text-white">
            {/* Header Image */}
            <div className="relative h-[60vh] w-full">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent z-10" />
                <Link href="/" className="absolute top-8 left-8 z-20 inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors uppercase tracking-widest text-xs mix-blend-difference">
                    <ArrowLeft className="w-4 h-4" /> Back
                </Link>
                <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
            </div>

            {/* Content */}
            <div className="max-w-3xl mx-auto px-6 -mt-32 relative z-20 pb-32">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="bg-[#0A0A0A] p-8 md:p-12 border border-white/10">
                        <span className="block text-xs uppercase tracking-widest text-white/40 mb-6">{blog.date}</span>
                        <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-tighter mb-12 leading-tight">
                            {blog.title}
                        </h1>

                        <div className="prose prose-invert prose-lg text-white/70 leading-relaxed font-light whitespace-pre-wrap">
                            {blog.description}
                        </div>

                        {blog.externalLink && (
                            <div className="mt-12 pt-8 border-t border-white/10">
                                <a
                                    href={blog.externalLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-white border-b border-white pb-1 hover:opacity-70 transition-opacity uppercase tracking-widest text-sm font-bold"
                                >
                                    Visit Source <ArrowUpRight className="w-4 h-4" />
                                </a>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </article>
    );
}
