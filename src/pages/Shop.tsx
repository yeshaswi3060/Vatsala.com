import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { CATEGORIES, PRODUCTS } from '../utils/constants';
import '../styles/pages/Shop.css';

const Shop = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
    const [sortBy, setSortBy] = useState('featured');
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const category = searchParams.get('category');
        if (category) {
            setSelectedCategory(category);
        }
    }, [searchParams]);

    useEffect(() => {
        // Use local data for guaranteed visibility
        setLoading(true);
        // Simulate a small delay for better UX
        setTimeout(() => {
            setProducts(PRODUCTS);
            setLoading(false);
        }, 300);
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

    const filteredProducts = selectedCategory === 'All'
        ? products
        : products.filter(p => p.category === selectedCategory);

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
                            {CATEGORIES.map(category => (
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
