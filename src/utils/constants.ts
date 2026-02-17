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
    collections?: string[];
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

    // Determine category: Collection (Priority) -> Product Type -> First Collection -> 'Uncategorized'
    const knownCategories = ['Lehengas', 'Suits', 'Blouses', 'Kurtis', 'Gowns', 'Sarees'];

    // 1. Try to find a known category in collections (Best Source)
    // This fixes the issue where ProductType is wrong (e.g. all 'Lehenga') but Collection is correct
    let category = '';
    if (sp.collections && sp.collections.length > 0) {
        const matchedCategory = knownCategories.find(k =>
            sp.collections.some(c => c.title.toLowerCase().includes(k.toLowerCase()))
        );
        if (matchedCategory) {
            category = matchedCategory;
        }
    }

    // 2. Fallback to Product Type (if likely valid)
    // Only use if we didn't match a collection and it's not a generic/wrong type
    if (!category && sp.productType) {
        category = sp.productType;
    }

    // 3. Fallback to first collection if still empty
    if (!category && sp.collections && sp.collections.length > 0) {
        category = sp.collections[0].title;
    }

    return {
        id: sp.id,
        handle: sp.handle,
        name: sp.title,
        category: category || 'Uncategorized',
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
        collections: sp.collections?.map(c => c.title) || [],
    };
}

export const formatPrice = (price: number): string => {
    return `₹${price.toLocaleString('en-IN')}`;
};

// Default categories — can be overridden by Shopify collections
export const CATEGORIES = ['All', 'Sarees', 'Lehengas', 'Suits', 'Kurtis', 'Blouses', 'Gowns'] as const;
