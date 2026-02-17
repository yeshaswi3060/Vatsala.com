import { useState, useEffect } from 'react';
import { fetchAllProducts, type ShopifyProduct } from '../lib/shopify';

interface UseShopifyProductsReturn {
    products: ShopifyProduct[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

export function useShopifyProducts(limit: number = 50): UseShopifyProductsReturn {
    const [products, setProducts] = useState<ShopifyProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [fetchKey, setFetchKey] = useState(0);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError(null);

        fetchAllProducts(limit)
            .then((data) => {
                if (!cancelled) {
                    setProducts(data);
                    setLoading(false);
                }
            })
            .catch((err) => {
                if (!cancelled) {
                    console.error('Failed to fetch Shopify products:', err);
                    setError(err.message || 'Failed to load products');
                    setLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [limit, fetchKey]);

    const refetch = () => setFetchKey((k) => k + 1);

    return { products, loading, error, refetch };
}
