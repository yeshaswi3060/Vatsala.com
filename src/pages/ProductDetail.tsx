import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import ProductCard from '../components/ProductCard';
import { PRODUCTS, formatPrice } from '../utils/constants';
import '../styles/pages/ProductDetail.css';

const ProductDetail = () => {
    const { id } = useParams();
    const product = PRODUCTS.find(p => p.id === id);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');

    if (!product) {
        return (
            <div className="product-not-found">
                <div className="container">
                    <h1>Product Not Found</h1>
                    <p>Sorry, we couldn't find the product you're looking for.</p>
                    <Link to="/shop" className="btn btn-primary">Back to Shop</Link>
                </div>
            </div>
        );
    }

    const relatedProducts = PRODUCTS
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 3);

    return (
        <div className="product-detail-page">
            <div className="product-detail section">
                <div className="container">
                    <div className="product-detail-grid">
                        <div className="product-image-section">
                            <div
                                className="product-main-image"
                                style={{
                                    background: getGradientForCategory(product.category)
                                }}
                            >
                                <span className="product-image-text">{product.category}</span>
                            </div>
                        </div>

                        <div className="product-info-section">
                            <div className="product-breadcrumb">
                                <Link to="/shop">Shop</Link> / <Link to={`/shop?category=${product.category}`}>{product.category}</Link> / {product.name}
                            </div>

                            <h1 className="product-title">{product.name}</h1>

                            <div className="product-pricing-detail">
                                <span className="product-price-large">{formatPrice(product.price)}</span>
                                {product.originalPrice && (
                                    <span className="product-original-price-large">{formatPrice(product.originalPrice)}</span>
                                )}
                            </div>

                            {product.badge && (
                                <span className={`product-badge-large badge-${product.badge.toLowerCase()}`}>
                                    {product.badge}
                                </span>
                            )}

                            <p className="product-description-detail">{product.description}</p>

                            {product.fabric && (
                                <div className="product-detail-item">
                                    <strong>Fabric:</strong> {product.fabric}
                                </div>
                            )}

                            {product.colors && product.colors.length > 0 && (
                                <div className="product-options">
                                    <label>Select Color:</label>
                                    <div className="color-options">
                                        {product.colors.map(color => (
                                            <button
                                                key={color}
                                                className={`color-btn ${selectedColor === color ? 'active' : ''}`}
                                                onClick={() => setSelectedColor(color)}
                                            >
                                                {color}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {product.sizes && product.sizes.length > 0 && (
                                <div className="product-options">
                                    <label>Select Size:</label>
                                    <div className="size-options">
                                        {product.sizes.map(size => (
                                            <button
                                                key={size}
                                                className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                                                onClick={() => setSelectedSize(size)}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="product-actions">
                                <button className="btn btn-primary btn-large">Add to Cart</button>
                                <button className="btn btn-outline btn-large">Add to Wishlist</button>
                            </div>

                            <div className="product-features">
                                <div className="feature-item">
                                    <span className="feature-icon">✓</span>
                                    <span>Authentic Traditional Wear</span>
                                </div>
                                <div className="feature-item">
                                    <span className="feature-icon">✓</span>
                                    <span>Premium Quality Fabric</span>
                                </div>
                                <div className="feature-item">
                                    <span className="feature-icon">✓</span>
                                    <span>Free Shipping on Orders Above ₹2,999</span>
                                </div>
                                <div className="feature-item">
                                    <span className="feature-icon">✓</span>
                                    <span>Easy Returns & Exchange</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {relatedProducts.length > 0 && (
                <section className="related-products section">
                    <div className="container">
                        <h2 className="section-title">You May Also Like</h2>
                        <div className="products-grid">
                            {relatedProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};

const getGradientForCategory = (category: string): string => {
    const gradients = {
        'Sarees': 'linear-gradient(135deg, #C71585 0%, #FF1493 50%, #FFD700 100%)',
        'Lehengas': 'linear-gradient(135deg, #8B0000 0%, #DC143C 50%, #FFD700 100%)',
        'Suits': 'linear-gradient(135deg, #4B0082 0%, #9370DB 50%, #FFB6C1 100%)',
        'Kurtis': 'linear-gradient(135deg, #FF6347 0%, #FF8C00 50%, #FFD700 100%)'
    };
    return gradients[category as keyof typeof gradients] || gradients['Sarees'];
};

export default ProductDetail;
