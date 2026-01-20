"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Plus, Trash2, LogOut, Package, FileText, Upload } from "lucide-react";

export default function AdminDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'products' | 'blogs'>('products');

    // Product State
    const [products, setProducts] = useState<any[]>([]);
    const [newProduct, setNewProduct] = useState({ name: "", price: "", description: "", sale: false, discount: 0 });
    const [productImage, setProductImage] = useState<File | null>(null);

    // Blog State
    const [blogs, setBlogs] = useState<any[]>([]);
    const [newBlog, setNewBlog] = useState({ title: "", description: "", externalLink: "" });
    const [blogImage, setBlogImage] = useState<File | null>(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Auth Check
        const checkAuth = async () => {
            const authCookie = document.cookie.split('; ').find(row => row.startsWith('admin_auth='));

            // If manual login cookie exists, we are good
            if (authCookie) {
                fetchProducts();
                fetchBlogs();
                setLoading(false);
                return;
            }

            // If not, check NextAuth session
            // (We can assume if status is "loading" we wait, if "unauthenticated" we redirect)
            // However, status is available from hook, so we can use that outside too
        }
        checkAuth();
    }, []);

    // Redirect if no session and no cookie after loading
    useEffect(() => {
        if (status === "loading") return;

        const authCookie = document.cookie.split('; ').find(row => row.startsWith('admin_auth='));
        if (status === "unauthenticated" && !authCookie) {
            router.push('/admin/login');
        } else {
            // Load data if authenticated (and not already loaded)
            if (products.length === 0) {
                fetchProducts();
                fetchBlogs();
                setLoading(false);
            }
        }
    }, [status, router]);

    const fetchProducts = async () => {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data);
    };

    const fetchBlogs = async () => {
        const res = await fetch('/api/blogs');
        const data = await res.json();
        setBlogs(data);
    };

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!productImage) return alert("Please select an image");

        const formData = new FormData();
        formData.append('image', productImage);
        formData.append('name', newProduct.name);
        formData.append('price', newProduct.price);
        formData.append('description', newProduct.description);
        formData.append('sale', String(newProduct.sale));
        formData.append('discount', String(newProduct.discount));

        const res = await fetch('/api/products', {
            method: 'POST',
            body: formData,
        });

        if (res.ok) {
            setNewProduct({ name: "", price: "", description: "", sale: false, discount: 0 });
            setProductImage(null);
            fetchProducts();
        }
    };

    const handleDeleteProduct = async (id: number) => {
        if (!confirm("Are you sure?")) return;
        await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
        fetchProducts();
    };

    const handleAddBlog = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!blogImage) return alert("Please select an image");

        const formData = new FormData();
        formData.append('image', blogImage);
        formData.append('title', newBlog.title);
        formData.append('description', newBlog.description);
        formData.append('externalLink', newBlog.externalLink);

        const res = await fetch('/api/blogs', {
            method: 'POST',
            body: formData,
        });

        if (res.ok) {
            setNewBlog({ title: "", description: "", externalLink: "" });
            setBlogImage(null);
            fetchBlogs();
        }
    };

    const handleDeleteBlog = async (id: number) => {
        if (!confirm("Are you sure?")) return;
        await fetch(`/api/blogs?id=${id}`, { method: 'DELETE' });
        fetchBlogs();
    };

    if (status === "loading" || loading) {
        return <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-white">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white p-6 md:p-12">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-12">
                    <h1 className="text-3xl font-bold uppercase tracking-widest">Admin Dashboard</h1>
                    <button onClick={() => router.push('/')} className="flex items-center gap-2 text-white/50 hover:text-white transition-colors">
                        <LogOut className="w-4 h-4" /> Exit
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-8 border-b border-white/10 mb-12">
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`pb-4 px-2 uppercase tracking-widest text-sm font-bold transition-colors ${activeTab === 'products' ? 'border-b-2 border-white text-white' : 'text-white/40 hover:text-white'}`}
                    >
                        <div className="flex items-center gap-2">
                            <Package className="w-4 h-4" /> Products
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab('blogs')}
                        className={`pb-4 px-2 uppercase tracking-widest text-sm font-bold transition-colors ${activeTab === 'blogs' ? 'border-b-2 border-white text-white' : 'text-white/40 hover:text-white'}`}
                    >
                        <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4" /> Blogs
                        </div>
                    </button>
                </div>

                {activeTab === 'products' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Add Product Form */}
                        <div className="lg:col-span-1 bg-[#111] p-8 border border-white/10 h-fit sticky top-6">
                            <h2 className="text-xl font-bold uppercase tracking-widest mb-6">Add Product</h2>
                            <form onSubmit={handleAddProduct} className="space-y-4">
                                <div>
                                    <label className="block text-xs uppercase text-white/40 mb-2">Image</label>
                                    <div className="border border-dashed border-white/20 p-4 text-center cursor-pointer hover:border-white transition-colors relative">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setProductImage(e.target.files?.[0] || null)}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                        />
                                        <div className="py-4">
                                            {productImage ? (
                                                <span className="text-sm text-green-400">{productImage.name}</span>
                                            ) : (
                                                <div className="flex flex-col items-center gap-2 text-white/40">
                                                    <Upload className="w-6 h-6" />
                                                    <span className="text-xs">Click to Upload</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <input
                                    className="w-full bg-black/50 border border-white/10 p-3 text-white placeholder:text-white/30 outline-none focus:border-white transition-colors"
                                    placeholder="Product Name"
                                    value={newProduct.name}
                                    onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                                    required
                                />
                                <input
                                    className="w-full bg-black/50 border border-white/10 p-3 text-white placeholder:text-white/30 outline-none focus:border-white transition-colors"
                                    placeholder="Price (e.g. $120.00)"
                                    value={newProduct.price}
                                    onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                                    required
                                />
                                <textarea
                                    className="w-full bg-black/50 border border-white/10 p-3 text-white placeholder:text-white/30 outline-none focus:border-white transition-colors h-32 resize-none"
                                    placeholder="Description"
                                    value={newProduct.description}
                                    onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                                />
                                <div className="flex items-center gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={newProduct.sale}
                                            onChange={e => setNewProduct({ ...newProduct, sale: e.target.checked })}
                                            className="accent-white w-4 h-4"
                                        />
                                        <span className="text-xs uppercase">On Sale</span>
                                    </label>
                                    {newProduct.sale && (
                                        <input
                                            type="number"
                                            className="w-20 bg-black/50 border border-white/10 p-2 text-white outline-none"
                                            placeholder="%"
                                            value={newProduct.discount}
                                            onChange={e => setNewProduct({ ...newProduct, discount: Number(e.target.value) })}
                                        />
                                    )}
                                </div>
                                <button type="submit" className="w-full bg-white text-black py-3 font-bold uppercase tracking-widest hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2">
                                    <Plus className="w-4 h-4" /> Add Product
                                </button>
                            </form>
                        </div>

                        {/* Product List */}
                        <div className="lg:col-span-2 space-y-4">
                            {products.map((product) => (
                                <div key={product.id} className="flex items-center gap-4 bg-[#111] p-4 border border-white/10 hover:border-white/30 transition-colors">
                                    <img src={product.image} alt={product.name} className="w-16 h-20 object-cover bg-neutral-900" />
                                    <div className="flex-1">
                                        <h3 className="font-bold uppercase tracking-wide">{product.name}</h3>
                                        <p className="text-sm text-white/50">{product.price}</p>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteProduct(product.id)}
                                        className="p-2 text-white/30 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                            {products.length === 0 && <div className="text-white/30 text-sm">No products found.</div>}
                        </div>
                    </div>
                ) : (
                    // BLOGS TAB
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Add Blog Form */}
                        <div className="lg:col-span-1 bg-[#111] p-8 border border-white/10 h-fit sticky top-6">
                            <h2 className="text-xl font-bold uppercase tracking-widest mb-6">Post Blog</h2>
                            <form onSubmit={handleAddBlog} className="space-y-4">
                                <div>
                                    <label className="block text-xs uppercase text-white/40 mb-2">Cover Image</label>
                                    <div className="border border-dashed border-white/20 p-4 text-center cursor-pointer hover:border-white transition-colors relative">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setBlogImage(e.target.files?.[0] || null)}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                        />
                                        <div className="py-4">
                                            {blogImage ? (
                                                <span className="text-sm text-green-400">{blogImage.name}</span>
                                            ) : (
                                                <div className="flex flex-col items-center gap-2 text-white/40">
                                                    <Upload className="w-6 h-6" />
                                                    <span className="text-xs">Click to Upload</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <input
                                    className="w-full bg-black/50 border border-white/10 p-3 text-white placeholder:text-white/30 outline-none focus:border-white transition-colors"
                                    placeholder="Blog Title"
                                    value={newBlog.title}
                                    onChange={e => setNewBlog({ ...newBlog, title: e.target.value })}
                                    required
                                />
                                <textarea
                                    className="w-full bg-black/50 border border-white/10 p-3 text-white placeholder:text-white/30 outline-none focus:border-white transition-colors h-48 resize-none"
                                    placeholder="Blog Content..."
                                    value={newBlog.description}
                                    onChange={e => setNewBlog({ ...newBlog, description: e.target.value })}
                                    required
                                />
                                <input
                                    className="w-full bg-black/50 border border-white/10 p-3 text-white placeholder:text-white/30 outline-none focus:border-white transition-colors"
                                    placeholder="External Link (Optional)"
                                    value={newBlog.externalLink}
                                    onChange={e => setNewBlog({ ...newBlog, externalLink: e.target.value })}
                                />
                                <button type="submit" className="w-full bg-white text-black py-3 font-bold uppercase tracking-widest hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2">
                                    <Plus className="w-4 h-4" /> Post Story
                                </button>
                            </form>
                        </div>

                        {/* Blog List */}
                        <div className="lg:col-span-2 space-y-4">
                            {blogs.map((blog) => (
                                <div key={blog.id} className="flex items-start gap-4 bg-[#111] p-4 border border-white/10 hover:border-white/30 transition-colors">
                                    <img src={blog.image} alt={blog.title} className="w-24 h-16 object-cover bg-neutral-900" />
                                    <div className="flex-1">
                                        <h3 className="font-bold uppercase tracking-wide text-sm">{blog.title}</h3>
                                        <p className="text-xs text-white/50 line-clamp-2 mt-1">{blog.description}</p>
                                        <span className="text-[10px] text-white/30 mt-2 block">{blog.date}</span>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteBlog(blog.id)}
                                        className="p-2 text-white/30 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                            {blogs.length === 0 && <div className="text-white/30 text-sm">No stories posted yet.</div>}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
