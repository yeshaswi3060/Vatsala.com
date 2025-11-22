import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../utils/constants';

export interface CartItem {
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
}

export const CartProvider = ({ children }: CartProviderProps) => {
    const [items, setItems] = useState<CartItem[]>([]);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('vatsala_cart');
        if (savedCart) {
            setItems(JSON.parse(savedCart));
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('vatsala_cart', JSON.stringify(items));
    }, [items]);

    const addToCart = (product: Product, size: string, color: string, quantity: number) => {
        setItems(currentItems => {
            // Check if item with same product, size, and color already exists
            const existingItemIndex = currentItems.findIndex(
                item => item.product.id === product.id && item.size === size && item.color === color
            );

            if (existingItemIndex > -1) {
                // Update quantity of existing item
                const newItems = [...currentItems];
                newItems[existingItemIndex].quantity += quantity;
                return newItems;
            } else {
                // Add new item
                const newItem: CartItem = {
                    id: `${product.id}-${size}-${color}-${Date.now()}`,
                    product,
                    size,
                    color,
                    quantity
                };
                return [...currentItems, newItem];
            }
        });
    };

    const removeFromCart = (itemId: string) => {
        setItems(currentItems => currentItems.filter(item => item.id !== itemId));
    };

    const updateQuantity = (itemId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(itemId);
            return;
        }

        setItems(currentItems =>
            currentItems.map(item =>
                item.id === itemId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
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
