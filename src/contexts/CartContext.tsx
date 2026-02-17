import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Product } from '../utils/constants';

interface CartItem {
    id: string;
    product: Product;
    size: string;
    color: string;
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    itemCount: number;
    total: number;
    addToCart: (product: Product, size: string, color: string, quantity: number) => void;
    removeFromCart: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
};

interface CartProviderProps {
    children: ReactNode;
    userId: string | null;
}

export const CartProvider = ({ children, userId }: CartProviderProps) => {
    const [items, setItems] = useState<CartItem[]>([]);

    // Sync cart with Firestore when user changes
    useEffect(() => {
        if (!userId) {
            // Load from localStorage for guest users
            const savedCart = localStorage.getItem('allcloths_cart');
            if (savedCart) {
                setItems(JSON.parse(savedCart));
            } else {
                setItems([]);
            }
            return;
        }

        // Real-time sync with Firestore for logged-in users
        const cartRef = doc(db, 'carts', userId);

        const unsubscribe = onSnapshot(cartRef, (docSnap) => {
            if (docSnap.exists()) {
                setItems(docSnap.data().items || []);
            } else {
                setItems([]);
            }
        });

        return () => unsubscribe();
    }, [userId]);

    // Save cart to Firestore or localStorage
    const saveCart = async (newItems: CartItem[]) => {
        if (userId) {
            // Save to Firestore for logged-in users
            const cartRef = doc(db, 'carts', userId);
            await setDoc(cartRef, { items: newItems, updatedAt: new Date() });
        } else {
            // Save to localStorage for guest users
            localStorage.setItem('allcloths_cart', JSON.stringify(newItems));
        }
    };

    const addToCart = async (product: Product, size: string, color: string, quantity: number) => {
        const itemId = `${product.id}-${size}-${color}`;

        const newItems = [...items];
        const existingItem = newItems.find(item => item.id === itemId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            newItems.push({ id: itemId, product, size, color, quantity });
        }

        setItems(newItems);
        await saveCart(newItems);
    };

    const removeFromCart = async (itemId: string) => {
        const newItems = items.filter(item => item.id !== itemId);
        setItems(newItems);
        await saveCart(newItems);
    };

    const updateQuantity = async (itemId: string, quantity: number) => {
        if (quantity <= 0) {
            await removeFromCart(itemId);
            return;
        }

        const newItems = items.map(item =>
            item.id === itemId ? { ...item, quantity } : item
        );
        setItems(newItems);
        await saveCart(newItems);
    };

    const clearCart = async () => {
        setItems([]);
        await saveCart([]);
    };

    const itemCount = items.reduce((total, item) => total + item.quantity, 0);
    const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    const value = {
        items,
        itemCount,
        total,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
