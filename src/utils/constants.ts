// Product data types and constants
import type { ShopifyProduct } from '../lib/shopify';

export interface Product {
    id: string;
    handle: string;
    name: string;
    category: string;
    price: number;
    originalPrice?: number;
    image: string;
    images: string[];
    badge?: 'NEW' | 'BESTSELLER' | 'SALE';
    description: string;
    fabric?: string;
    colors?: string[];
    sizes?: string[];
    // Shopify variant data for checkout
    variantId?: string;
    variants?: { id: string; title: string; availableForSale: boolean; price: number; compareAtPrice?: number; options: { name: string; value: string }[] }[];
}

/**
 * Convert a Shopify product to the local Product format.
 * This lets us keep CartContext, WishlistContext, and ProductCard working unchanged.
 */
export function shopifyToProduct(sp: ShopifyProduct): Product {
    const price = parseFloat(sp.priceRange.minVariantPrice.amount);
    const compareAt = parseFloat(sp.compareAtPriceRange?.maxVariantPrice?.amount || '0');
    const hasDiscount = compareAt > price;

    // Extract size/color options from Shopify variants
    const sizeOption = sp.options.find(o => o.name.toLowerCase() === 'size');
    const colorOption = sp.options.find(o => o.name.toLowerCase() === 'color' || o.name.toLowerCase() === 'colour');

    // Determine badge from tags
    let badge: Product['badge'] = undefined;
    const tags = sp.tags.map(t => t.toLowerCase());
    if (tags.includes('new')) badge = 'NEW';
    else if (tags.includes('bestseller') || tags.includes('best-seller')) badge = 'BESTSELLER';
    else if (hasDiscount || tags.includes('sale')) badge = 'SALE';

    // Find fabric in tags or metafields
    const fabricTag = sp.tags.find(t => t.toLowerCase().startsWith('fabric:'));
    const fabric = fabricTag ? fabricTag.split(':')[1].trim() : undefined;

    return {
        id: sp.id,
        handle: sp.handle,
        name: sp.title,
        category: sp.productType || 'Uncategorized',
        price,
        originalPrice: hasDiscount ? compareAt : undefined,
        image: sp.images[0]?.url || '',
        images: sp.images.map(img => img.url),
        badge,
        description: sp.description,
        fabric,
        colors: colorOption?.values,
        sizes: sizeOption?.values,
        variantId: sp.variants[0]?.id,
        variants: sp.variants.map(v => ({
            id: v.id,
            title: v.title,
            availableForSale: v.availableForSale,
            price: parseFloat(v.price.amount),
            compareAtPrice: v.compareAtPrice ? parseFloat(v.compareAtPrice.amount) : undefined,
            options: v.selectedOptions,
        })),
    };
}

export const formatPrice = (price: number): string => {
    return `₹${price.toLocaleString('en-IN')}`;
};

// Default categories — can be overridden by Shopify collections
export const CATEGORIES = ['All', 'Sarees', 'Lehengas', 'Suits', 'Kurtis'] as const;
