import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Product } from '../utils/constants';

interface WishlistContextType {
    wishlist: Product[];
    addToWishlist: (product: Product) => void;
    removeFromWishlist: (productId: string) => void;
    isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within WishlistProvider');
    }
    return context;
};

interface WishlistProviderProps {
    children: ReactNode;
    userId: string | null;
}

export const WishlistProvider = ({ children, userId }: WishlistProviderProps) => {
    const [wishlist, setWishlist] = useState<Product[]>([]);

    // Sync wishlist with Firestore
    useEffect(() => {
        if (!userId) {
            // Load from localStorage for guest users
            const savedWishlist = localStorage.getItem('allcloths_wishlist');
            if (savedWishlist) {
                setWishlist(JSON.parse(savedWishlist));
            } else {
                setWishlist([]);
            }
            return;
        }

        // Real-time sync with Firestore for logged-in users
        const wishlistRef = doc(db, 'wishlists', userId);

        const unsubscribe = onSnapshot(wishlistRef, (docSnap) => {
            if (docSnap.exists()) {
                setWishlist(docSnap.data().items || []);
            } else {
                setWishlist([]);
            }
        });

        return () => unsubscribe();
    }, [userId]);

    // Save wishlist to Firestore or localStorage
    const saveWishlist = async (newWishlist: Product[]) => {
        if (userId) {
            const wishlistRef = doc(db, 'wishlists', userId);
            await setDoc(wishlistRef, { items: newWishlist, updatedAt: new Date() });
        } else {
            localStorage.setItem('allcloths_wishlist', JSON.stringify(newWishlist));
        }
    };

    const addToWishlist = async (product: Product) => {
        if (wishlist.find(p => p.id === product.id)) {
            return;
        }
        const newWishlist = [...wishlist, product];
        setWishlist(newWishlist);
        await saveWishlist(newWishlist);
    };

    const removeFromWishlist = async (productId: string) => {
        const newWishlist = wishlist.filter(p => p.id !== productId);
        setWishlist(newWishlist);
        await saveWishlist(newWishlist);
    };

    const isInWishlist = (productId: string) => {
        return wishlist.some(p => p.id === productId);
    };

    const value = {
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist
    };

    return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};
