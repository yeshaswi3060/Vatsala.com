import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useToast } from '../contexts/ToastContext';
import ProductCard from '../components/ProductCard';
import ProductExtendedDetails from '../components/ProductExtendedDetails';
import { shopifyToProduct, formatPrice, type Product } from '../utils/constants';
import { fetchProductByHandle, fetchAllProducts } from '../lib/shopify';
import '../styles/pages/ProductDetail.css';

const ProductDetail = () => {
    const { id: handle } = useParams();
    const { addToCart, removeFromCart, items } = useCart();
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
    const [isAdded, setIsAdded] = useState(false);

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

        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000); // Reset 'Added' state after 2s to show 'Remove'

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

    // Helper to determine stock status
    const getStockStatus = () => {
        if (!product.variants || product.variants.length === 0) return { inStock: true, label: 'In Stock' }; // Fallback

        // 1. If options selected, check specific variant
        if (selectedSize || selectedColor) {
            const variant = product.variants.find(v => {
                const options = v.options || [];
                const sizeMatch = !selectedSize || options.some(opt => opt.name.toLowerCase() === 'size' && opt.value === selectedSize);
                const colorMatch = !selectedColor || options.some(opt => (opt.name.toLowerCase() === 'color' || opt.name.toLowerCase() === 'colour') && opt.value === selectedColor);
                return sizeMatch && colorMatch;
            });

            if (variant) {
                return {
                    inStock: variant.availableForSale,
                    label: variant.availableForSale ? 'In Stock' : 'Out of Stock'
                };
            }
        }

        // 2. If no options selected, or defaults, check if ANY variant is in stock
        const anyInStock = product.variants.some(v => v.availableForSale);
        return {
            inStock: anyInStock,
            label: anyInStock ? 'In Stock' : 'Out of Stock'
        };
    };

    const stockStatus = getStockStatus();

    return (
        <div className="product-detail-page">
            <div className="product-detail section">
                <div className="container">
                    <div className="product-detail-grid">
                        {/* Mobile Header Section (Visible only on mobile) */}
                        <div className="mobile-header-section">
                            <div className="product-header-row">
                                <span className="product-badge-pill">New Arrival</span>
                                <div className={`product-stock-status ${stockStatus.inStock ? 'in-stock' : 'out-of-stock'}`}>
                                    <span className="stock-dot"></span> {stockStatus.label}
                                </div>
                            </div>
                            <h1 className="product-title">{product.name}</h1>
                            <div className="product-meta-row">
                                <div className="review-stars">
                                    ★★★★★ <span className="review-count">4.8 (128 Reviews)</span>
                                </div>
                            </div>
                        </div>

                        <div className="product-image-section">
                            <div
                                className="product-image-viewport"
                                onTouchStart={(e) => {
                                    const touch = e.touches[0];
                                    e.currentTarget.dataset.touchStartX = touch.clientX.toString();
                                }}
                                onTouchEnd={(e) => {
                                    const touchStartX = parseFloat(e.currentTarget.dataset.touchStartX || '0');
                                    const touchEndX = e.changedTouches[0].clientX;
                                    const diff = touchStartX - touchEndX;

                                    if (Math.abs(diff) > 50) { // Threshold of 50px
                                        if (diff > 0) {
                                            // Swipe Left -> Next Image
                                            setSelectedImageIndex(selectedImageIndex === (product.images?.length || 1) - 1 ? 0 : selectedImageIndex + 1);
                                        } else {
                                            // Swipe Right -> Prev Image
                                            setSelectedImageIndex(selectedImageIndex === 0 ? (product.images?.length || 1) - 1 : selectedImageIndex - 1);
                                        }
                                    }
                                    e.currentTarget.dataset.touchStartX = '';
                                }}
                            >
                                {currentImage ? (
                                    <img
                                        key={selectedImageIndex}
                                        className="product-main-image animate-image-in"
                                        src={currentImage}
                                        alt={product.name}
                                        draggable="false"
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

                                {/* Prev / Next arrows */}
                                {product.images && product.images.length > 1 && (
                                    <>
                                        <button
                                            className="image-nav-btn image-nav-prev"
                                            onClick={() => setSelectedImageIndex(
                                                selectedImageIndex === 0 ? product.images.length - 1 : selectedImageIndex - 1
                                            )}
                                            aria-label="Previous image"
                                        >
                                            ‹
                                        </button>
                                        <button
                                            className="image-nav-btn image-nav-next"
                                            onClick={() => setSelectedImageIndex(
                                                selectedImageIndex === product.images.length - 1 ? 0 : selectedImageIndex + 1
                                            )}
                                            aria-label="Next image"
                                        >
                                            ›
                                        </button>
                                    </>
                                )}
                            </div>

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
                            <div className="product-info-card">
                                {/* Desktop Header Elements (Hidden on mobile) */}
                                <div className="desktop-header-elements">
                                    <div className="product-header-row">
                                        <span className="product-badge-pill">New Arrival</span>
                                        <div className={`product-stock-status ${stockStatus.inStock ? 'in-stock' : 'out-of-stock'}`}>
                                            <span className="stock-dot"></span> {stockStatus.label}
                                        </div>
                                    </div>

                                    <h1 className="product-title">{product.name}</h1>

                                    <div className="product-meta-row">
                                        <div className="review-stars">
                                            ★★★★★ <span className="review-count">4.8 (128 Reviews)</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="product-pricing-detail">
                                    <span className="product-price-large">{formatPrice(product.price)}</span>
                                    {product.originalPrice && (
                                        <span className="product-original-price-large">{formatPrice(product.originalPrice)}</span>
                                    )}
                                </div>

                                {/* Collapsible Details (Mobile & Desktop per user request "drop down button") */}
                                <div className="product-details-dropdown">
                                    <details>
                                        <summary>Product Details</summary>
                                        <div className="details-content">
                                            <p>
                                                {product.description || `Experience unparalleled quality with our flagship ${product.category?.toLowerCase() || 'premium'} collection. Featuring premium materials and authentic craftsmanship.`}
                                            </p>
                                        </div>
                                    </details>
                                </div>

                                <hr className="product-divider" />

                                {product.colors && product.colors.length > 0 && (
                                    <div className="product-options">
                                        <label>Select Color</label>
                                        <div className="color-options">
                                            {product.colors.map(color => (
                                                <button
                                                    key={color}
                                                    className={`color-btn ${selectedColor === color ? 'active' : ''}`}
                                                    onClick={() => setSelectedColor(color)}
                                                    title={color}
                                                >
                                                    {color}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {product.sizes && product.sizes.length > 0 && (
                                    <div className="product-options">
                                        <label>Select Size</label>
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

                                <div className="product-actions-row">
                                    {(() => {
                                        const currentItemId = `${product.id}-${selectedSize || 'One Size'}-${selectedColor || 'Default'}`;
                                        const cartItem = items.find(item => item.id === currentItemId);
                                        const isInCart = !!cartItem;

                                        if (isAdded) {
                                            return (
                                                <button className="btn btn-success btn-block" disabled>
                                                    Product Added ✓
                                                </button>
                                            );
                                        }

                                        return (
                                            <button
                                                className={`btn btn-block ${isInCart ? 'btn-remove-cart' : 'btn-primary'}`}
                                                onClick={() => {
                                                    if (isInCart) {
                                                        removeFromCart(currentItemId);
                                                        showToast('Removed from cart', 'info');
                                                    } else {
                                                        handleAddToCart();
                                                    }
                                                }}
                                            >
                                                {isInCart ? 'Remove from Cart' : 'Add to Cart'}
                                            </button>
                                        );
                                    })()}

                                    <button
                                        className={`wishlist-icon-btn ${isInWishlist(product.id) ? 'in-wishlist' : ''}`}
                                        onClick={handleWishlistToggle}
                                        title={isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                                    >
                                        {isInWishlist(product.id) ? '❤️' : '🤍'}
                                    </button>
                                </div>

                                <div className="product-trust-grid">
                                    <div className="trust-item">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="1" y="3" width="15" height="13"></rect>
                                            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                                            <circle cx="5.5" cy="18.5" r="2.5"></circle>
                                            <circle cx="18.5" cy="18.5" r="2.5"></circle>
                                        </svg>
                                        <span>Free Express Shipping</span>
                                    </div>
                                    <div className="trust-item">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                                            <path d="M21 7l-5-5m5 0l5 5"></path>
                                        </svg>
                                        <span>5-Day Returns</span>
                                    </div>
                                    <div className="trust-item">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                        </svg>
                                        <span>Authentic Products</span>
                                    </div>
                                    <div className="trust-item">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M2 22h20"></path>
                                            <path d="M12 2v20"></path>
                                        </svg>
                                        <span>Eco-friendly Packaging</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {product && <ProductExtendedDetails product={product} />}

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
