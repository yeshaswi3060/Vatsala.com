// Product data types and constants

export interface Product {
    id: string;
    name: string;
    category: 'Sarees' | 'Lehengas' | 'Suits' | 'Kurtis';
    price: number;
    originalPrice?: number;
    image: string;
    badge?: 'NEW' | 'BESTSELLER' | 'SALE';
    description: string;
    fabric?: string;
    colors?: string[];
    sizes?: string[];
}

export const PRODUCTS: Product[] = [
    {
        id: '1',
        name: 'Kanjivaram Silk Saree',
        category: 'Sarees',
        price: 12999,
        originalPrice: 15999,
        image: '/product-saree-1.jpg',
        badge: 'BESTSELLER',
        description: 'Exquisite Kanjivaram silk saree with traditional gold zari work and intricate motifs',
        fabric: 'Pure Silk',
        colors: ['Maroon', 'Gold'],
        sizes: ['Free Size']
    },
    {
        id: '2',
        name: 'Designer Bridal Lehenga',
        category: 'Lehengas',
        price: 24999,
        originalPrice: 29999,
        image: '/product-lehenga-1.jpg',
        badge: 'NEW',
        description: 'Stunning bridal lehenga with heavy embroidery and embellishments',
        fabric: 'Silk & Velvet',
        colors: ['Red', 'Gold'],
        sizes: ['S', 'M', 'L', 'XL']
    },
    {
        id: '3',
        name: 'Anarkali Suit Set',
        category: 'Suits',
        price: 4999,
        image: '/product-suit-1.jpg',
        description: 'Elegant anarkali suit with beautiful embroidery and dupatta',
        fabric: 'Georgette',
        colors: ['Pink', 'Blue', 'Green'],
        sizes: ['S', 'M', 'L', 'XL']
    },
    {
        id: '4',
        name: 'Banarasi Silk Saree',
        category: 'Sarees',
        price: 8999,
        image: '/product-saree-2.jpg',
        badge: 'BESTSELLER',
        description: 'Traditional Banarasi silk saree with classic patterns',
        fabric: 'Banarasi Silk',
        colors: ['Royal Blue', 'Gold'],
        sizes: ['Free Size']
    },
    {
        id: '5',
        name: 'Party Wear Lehenga',
        category: 'Lehengas',
        price: 15999,
        image: '/product-lehenga-2.jpg',
        description: 'Contemporary lehenga perfect for parties and celebrations',
        fabric: 'Net & Silk',
        colors: ['Peach', 'Gold'],
        sizes: ['S', 'M', 'L', 'XL']
    },
    {
        id: '6',
        name: 'Cotton Kurti',
        category: 'Kurtis',
        price: 1499,
        image: '/product-kurti-1.jpg',
        badge: 'NEW',
        description: 'Comfortable cotton kurti for everyday wear',
        fabric: 'Pure Cotton',
        colors: ['White', 'Yellow', 'Pink'],
        sizes: ['S', 'M', 'L', 'XL', 'XXL']
    },
    {
        id: '7',
        name: 'Chanderi Silk Saree',
        category: 'Sarees',
        price: 6999,
        image: '/product-saree-3.jpg',
        description: 'Lightweight Chanderi silk saree with elegant design',
        fabric: 'Chanderi Silk',
        colors: ['Mint Green', 'Gold'],
        sizes: ['Free Size']
    },
    {
        id: '8',
        name: 'Palazzo Suit Set',
        category: 'Suits',
        price: 3999,
        image: '/product-suit-2.jpg',
        badge: 'SALE',
        description: 'Trendy palazzo suit set with modern prints',
        fabric: 'Rayon',
        colors: ['Multi'],
        sizes: ['S', 'M', 'L', 'XL']
    }
];

export const formatPrice = (price: number): string => {
    return `₹${price.toLocaleString('en-IN')}`;
};

export const CATEGORIES = ['All', 'Sarees', 'Lehengas', 'Suits', 'Kurtis'] as const;
