import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { shopifyToProduct, type Product } from '../utils/constants';
import { fetchAllProducts, fetchAllCollections } from '../lib/shopify';
import '../styles/pages/Shop.css';

const Shop = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
    const [sortBy, setSortBy] = useState('featured');
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<string[]>(['All']);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const category = searchParams.get('category');
        if (category) {
            setSelectedCategory(category);
        }
    }, [searchParams]);

    useEffect(() => {
        setLoading(true);
        setError(null);

        Promise.all([fetchAllProducts(50), fetchAllCollections()])
            .then(([shopifyProducts, shopifyCollections]) => {
                const mapped = shopifyProducts.map(shopifyToProduct);
                setProducts(mapped);

                // Build category list from Shopify collections (prepend "All")
                const collectionTitles = shopifyCollections.map(c => c.title);
                setCategories(['All', ...collectionTitles]);

                setLoading(false);
            })
            .catch((err) => {
                console.error('Failed to fetch products:', err);
                setError(err.message || 'Failed to load products');
                setLoading(false);
            });
    }, []);

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        if (category === 'All') {
            searchParams.delete('category');
        } else {
            searchParams.set('category', category);
        }
        setSearchParams(searchParams);
    };

    // Filter by checking if the product belongs to the selected collection
    const filteredProducts = selectedCategory === 'All'
        ? products
        : products.filter(p =>
            p.collections?.some(c => c === selectedCategory)
        );

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return 0; // featured
    });

    if (loading) {
        return (
            <div className="shop-page">
                <div className="shop-hero">
                    <div className="container">
                        <h1>Shop Traditional Wear</h1>
                        <p>Discover our complete collection of authentic Indian clothing</p>
                    </div>
                </div>
                <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
                    <div className="loading-spinner">Loading products...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="shop-page">
                <div className="shop-hero">
                    <div className="container">
                        <h1>Shop Traditional Wear</h1>
                        <p>Discover our complete collection of authentic Indian clothing</p>
                    </div>
                </div>
                <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
                    <div className="error-message">
                        <p>⚠️ {error}</p>
                        <p style={{ fontSize: '0.9rem', marginTop: '0.5rem', opacity: 0.7 }}>
                            Please check that your Shopify store domain is configured in the .env file.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="shop-page">
            <div className="shop-hero">
                <div className="container">
                    <h1>Shop Traditional Wear</h1>
                    <p>Discover our complete collection of authentic Indian clothing</p>
                </div>
            </div>

            <div className="shop-content section">
                <div className="container">
                    <div className="shop-controls">
                        <div className="category-filters">
                            {categories.map(category => (
                                <button
                                    key={category}
                                    className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                                    onClick={() => handleCategoryChange(category)}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>

                        <div className="sort-control">
                            <label htmlFor="sort">Sort by:</label>
                            <select
                                id="sort"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="sort-select"
                            >
                                <option value="featured">Featured</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="name">Name: A to Z</option>
                            </select>
                        </div>
                    </div>

                    <div className="products-count">
                        Showing {sortedProducts.length} {sortedProducts.length === 1 ? 'product' : 'products'}
                    </div>

                    <div className="products-grid">
                        {sortedProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

                    {sortedProducts.length === 0 && (
                        <div className="no-products">
                            <p>No products found in this category.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Shop;
