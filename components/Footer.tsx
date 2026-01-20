"use client";

import { Instagram, Facebook, Linkedin, Twitter, Mail, Phone, MapPin, Clock } from "lucide-react";
import Link from "next/link";

export default function Footer() {
    return (
        <footer id="contact" className="relative z-20 bg-[#050505] text-white pt-24 pb-12 px-6 md:px-12 border-t border-white/10">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">

                {/* Brand Column */}
                <div className="space-y-6">
                    <h2 className="text-3xl font-bold uppercase tracking-tighter">LXRY</h2>
                    <p className="text-white/50 text-sm leading-relaxed max-w-xs">
                        Redefining the intersection of street culture and high fashion. Designed for the bold, constructed for the future.
                    </p>
                </div>

                {/* Contact Column */}
                <div className="space-y-6">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-white/40">Contact</h3>
                    <div className="space-y-4 text-sm">
                        <div className="flex items-center gap-3 text-white/80 hover:text-white transition-colors">
                            <Mail className="h-4 w-4" />
                            <a href="mailto:ke7inpimenta@gmail.com">ke7inpimenta@gmail.com</a>
                        </div>
                        <div className="flex items-center gap-3 text-white/80 hover:text-white transition-colors">
                            <Phone className="h-4 w-4" />
                            <span>+1 (555) 000-0000</span>
                        </div>
                        <div className="flex items-start gap-3 text-white/80">
                            <MapPin className="h-4 w-4 mt-1" />
                            <span>123 Fashion Ave, <br />New York, NY 10012</span>
                        </div>
                        <div className="flex items-center gap-3 text-white/80">
                            <Clock className="h-4 w-4" />
                            <span>Mon - Fri: 10am - 7pm EST</span>
                        </div>
                    </div>
                </div>

                {/* Social Column */}
                <div className="space-y-6">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-white/40">Follow Us</h3>
                    <ul className="space-y-3 text-sm">
                        <li>
                            <Link href="#" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors group">
                                <Instagram className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                <span>Instagram</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="#" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors group">
                                <Facebook className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                <span>Facebook</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="#" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors group">
                                <Linkedin className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                <span>LinkedIn</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="#" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors group">
                                <Twitter className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                <span>X / Twitter</span>
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Newsletter / Links */}
                <div className="space-y-6">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-white/40">Legal</h3>
                    <ul className="space-y-2 text-sm text-white/60">
                        <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                        <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
                        <li><Link href="#" className="hover:text-white transition-colors">Shipping & Returns</Link></li>
                    </ul>
                </div>

            </div>

            <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 text-xs text-white/30 uppercase tracking-widest">
                <p>&copy; 2026 LXRY Studios. All rights reserved.</p>
                <p>Designed by Antigravity</p>
            </div>
        </footer>
    );
}
