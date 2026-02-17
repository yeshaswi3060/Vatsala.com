import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useToast } from '../contexts/ToastContext';
import ProductCard from '../components/ProductCard';
import { shopifyToProduct, formatPrice, type Product } from '../utils/constants';
import { fetchProductByHandle, fetchAllProducts } from '../lib/shopify';
import '../styles/pages/ProductDetail.css';

const ProductDetail = () => {
    const { id: handle } = useParams();
    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const { showToast } = useToast();

    const [product, setProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    useEffect(() => {
        if (!handle) return;

        setLoading(true);
        setError(null);
        setSelectedSize('');
        setSelectedColor('');
        setQuantity(1);
        setSelectedImageIndex(0);

        fetchProductByHandle(handle)
            .then((shopifyProduct) => {
                if (!shopifyProduct) {
                    setError('Product not found');
                    setLoading(false);
                    return;
                }

                const mapped = shopifyToProduct(shopifyProduct);
                setProduct(mapped);
                setLoading(false);

                // Fetch related products
                fetchAllProducts(20).then((allProducts) => {
                    const allMapped = allProducts.map(shopifyToProduct);
                    const related = allMapped
                        .filter(p => p.category === mapped.category && p.id !== mapped.id)
                        .slice(0, 3);
                    setRelatedProducts(related);
                });
            })
            .catch((err) => {
                console.error('Failed to fetch product:', err);
                setError(err.message || 'Failed to load product');
                setLoading(false);
            });
    }, [handle]);

    if (loading) {
        return (
            <div className="product-detail-page">
                <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
                    <div className="loading-spinner">Loading product...</div>
                </div>
            </div>
        );
    }

    if (error || !product) {
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

    const handleAddToCart = () => {
        if (product.sizes && product.sizes.length > 0 && !selectedSize) {
            showToast('Please select a size', 'warning');
            return;
        }
        if (product.colors && product.colors.length > 0 && !selectedColor) {
            showToast('Please select a color', 'warning');
            return;
        }

        // Find the specific variant ID for the selected options
        let selectedVariantId = product.variantId; // Default to first variant

        if (product.variants && product.variants.length > 0) {
            const matchedVariant = product.variants.find(variant => {
                const options = variant.options || [];
                const sizeMatch = !selectedSize || options.some(opt => opt.name.toLowerCase() === 'size' && opt.value === selectedSize);
                const colorMatch = !selectedColor || options.some(opt => (opt.name.toLowerCase() === 'color' || opt.name.toLowerCase() === 'colour') && opt.value === selectedColor);
                return sizeMatch && colorMatch;
            });

            if (matchedVariant) {
                selectedVariantId = matchedVariant.id;
            }
        }

        addToCart(
            product,
            selectedVariantId || '',
            selectedSize || 'One Size',
            selectedColor || 'Default',
            quantity
        );

        showToast(`${product.name} added to cart!`, 'success');
    };

    const handleWishlistToggle = () => {
        if (isInWishlist(product.id)) {
            removeFromWishlist(product.id);
            showToast('Removed from wishlist', 'info');
        } else {
            addToWishlist(product);
            showToast(`${product.name} added to wishlist ❤️`, 'success');
        }
    };

    const currentImage = product.images?.[selectedImageIndex] || product.image;

    return (
        <div className="product-detail-page">
            <div className="product-detail section">
                <div className="container">
                    <div className="product-detail-grid">
                        <div className="product-image-section">
                            {currentImage ? (
                                <img
                                    className="product-main-image"
                                    src={currentImage}
                                    alt={product.name}
                                />
                            ) : (
                                <div
                                    className="product-main-image"
                                    style={{
                                        background: getGradientForCategory(product.category)
                                    }}
                                >
                                    <span className="product-image-text">{product.category}</span>
                                </div>
                            )}

                            {/* Thumbnail gallery */}
                            {product.images && product.images.length > 1 && (
                                <div className="product-thumbnails">
                                    {product.images.map((img, index) => (
                                        <button
                                            key={index}
                                            className={`thumbnail-btn ${selectedImageIndex === index ? 'active' : ''}`}
                                            onClick={() => setSelectedImageIndex(index)}
                                        >
                                            <img src={img} alt={`${product.name} view ${index + 1}`} />
                                        </button>
                                    ))}
                                </div>
                            )}
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

                            <div className="product-quantity">
                                <label>Quantity:</label>
                                <div className="quantity-selector">
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                                    <span>{quantity}</span>
                                    <button onClick={() => setQuantity(quantity + 1)}>+</button>
                                </div>
                            </div>

                            <div className="product-actions">
                                <button className="btn btn-primary btn-large" onClick={handleAddToCart}>
                                    Add to Cart
                                </button>
                                <button
                                    className={`btn btn-outline btn-large wishlist-btn ${isInWishlist(product.id) ? 'in-wishlist' : ''}`}
                                    onClick={handleWishlistToggle}
                                >
                                    <span className="heart-icon">{isInWishlist(product.id) ? '❤️' : '🤍'}</span>
                                    {isInWishlist(product.id) ? 'In Wishlist' : 'Add to Wishlist'}
                                </button>
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
    const gradients: Record<string, string> = {
        'Sarees': 'linear-gradient(135deg, #C71585 0%, #FF1493 50%, #FFD700 100%)',
        'Lehengas': 'linear-gradient(135deg, #8B0000 0%, #DC143C 50%, #FFD700 100%)',
        'Suits': 'linear-gradient(135deg, #4B0082 0%, #9370DB 50%, #FFB6C1 100%)',
        'Kurtis': 'linear-gradient(135deg, #FF6347 0%, #FF8C00 50%, #FFD700 100%)'
    };
    return gradients[category] || gradients['Sarees'];
};

export default ProductDetail;
