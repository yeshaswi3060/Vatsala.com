import { useState, useEffect } from 'react';
import { fetchProductByHandle, type ShopifyProduct } from '../lib/shopify';

interface UseShopifyProductReturn {
    product: ShopifyProduct | null;
    loading: boolean;
    error: string | null;
}

export function useShopifyProduct(handle: string | undefined): UseShopifyProductReturn {
    const [product, setProduct] = useState<ShopifyProduct | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!handle) {
            setLoading(false);
            setError('No product handle provided');
            return;
        }

        let cancelled = false;
        setLoading(true);
        setError(null);

        fetchProductByHandle(handle)
            .then((data) => {
                if (!cancelled) {
                    setProduct(data);
                    setLoading(false);
                }
            })
            .catch((err) => {
                if (!cancelled) {
                    console.error('Failed to fetch Shopify product:', err);
                    setError(err.message || 'Failed to load product');
                    setLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [handle]);

    return { product, loading, error };
}
