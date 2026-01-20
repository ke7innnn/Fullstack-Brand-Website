"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface CartItem {
    id: string;
    cartId: string; // Unique ID for the cart (id + size)
    name: string;
    price: string;
    image: string;
    quantity: number;
    size?: string;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (product: any, quantity: number, size?: string) => void;
    removeFromCart: (cartId: string) => void;
    updateQuantity: (cartId: string, quantity: number) => void;
    clearCart: () => void;
    getCartTotal: () => number;
    totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);

    useEffect(() => {
        const savedCart = localStorage.getItem("lxry_cart");
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (e) {
                console.error("Failed to parse cart", e);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("lxry_cart", JSON.stringify(items));
    }, [items]);

    const addToCart = (product: any, quantity: number, size?: string) => {
        setItems((prev) => {
            const cartId = size ? `${product.id}-${size}` : `${product.id}`;
            const existing = prev.find((item) => item.cartId === cartId);

            if (existing) {
                return prev.map((item) =>
                    item.cartId === cartId
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prev, { ...product, quantity, size, cartId }];
        });
    };

    const removeFromCart = (cartId: string) => {
        setItems((prev) => prev.filter((item) => item.cartId !== cartId));
    };

    const updateQuantity = (cartId: string, quantity: number) => {
        if (quantity < 1) return;
        setItems((prev) =>
            prev.map((item) => (item.cartId === cartId ? { ...item, quantity } : item))
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    const getCartTotal = () => {
        return items.reduce((total, item) => {
            const price = parseFloat(item.price.replace(/[^0-9.]/g, ""));
            return total + price * item.quantity;
        }, 0);
    };

    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                getCartTotal,
                totalItems,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
