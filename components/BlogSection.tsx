"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface Blog {
    id: string;
    title: string;
    image: string;
    description: string;
    date: string;
}

export default function BlogSection() {
    const [blogs, setBlogs] = useState<Blog[]>([]);

    useEffect(() => {
        fetch('/api/blogs')
            .then(res => res.json())
            .then(data => setBlogs(data));
    }, []);

    if (blogs.length === 0) return null;

    return (
        <section id="journal" className="bg-[#0A0A0A] py-24 border-t border-white/10 overflow-hidden">
            <div className="pl-6 md:pl-12 mb-12 flex justify-between items-end pr-6 md:pr-12">
                <h2 className="text-3xl font-light uppercase tracking-widest text-white/80">
                    Journal
                </h2>
                <div className="text-xs uppercase tracking-widest text-white/40">
                    Scroll &rarr;
                </div>
            </div>

            {/* Horizontal Scroll Container */}
            <div className="flex overflow-x-auto gap-8 px-6 md:px-12 pb-12 snap-x snap-mandatory scrollbar-hide">
                {blogs.map((blog, index) => (
                    <motion.div
                        key={blog.id}
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className="min-w-[300px] md:min-w-[400px] snap-start"
                    >
                        <Link href={`/blog/${blog.id}`} className="group cursor-pointer block h-full">
                            <motion.div
                                className="relative aspect-[16/9] mb-6 overflow-hidden bg-[#111] border border-white/10"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.4 }}
                            >
                                <div className="absolute inset-0 bg-red-600/0 group-hover:bg-red-600/10 mix-blend-overlay z-10 transition-colors duration-500" />
                                <motion.img
                                    src={blog.image}
                                    alt={blog.title}
                                    className="w-full h-full object-cover opacity-80"
                                    whileHover={{ scale: 1.1, filter: "grayscale(0%) contrast(1.1)" }}
                                    initial={{ filter: "grayscale(30%) contrast(1)" }}
                                    transition={{ duration: 0.7, ease: "easeOut" }}
                                />
                                {/* "Read" badge appearing on hover */}
                                <div className="absolute top-4 right-4 z-20 bg-white text-black text-[10px] font-bold px-3 py-1 uppercase tracking-widest opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                    Read Now
                                </div>
                            </motion.div>

                            <div className="relative pl-2 border-l border-transparent group-hover:border-white/50 transition-colors duration-300">
                                <span className="text-[10px] text-white/40 uppercase tracking-widest mb-2 block">{blog.date}</span>
                                <h3 className="text-xl font-bold uppercase tracking-wide mb-3 text-white group-hover:text-red-500 transition-colors duration-300">
                                    {blog.title}
                                </h3>
                                <p className="text-sm text-white/50 line-clamp-2 leading-relaxed font-light group-hover:text-white/80 transition-colors">
                                    {blog.description}
                                </p>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
