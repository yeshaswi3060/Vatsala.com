import { Link } from 'react-router-dom';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';
import { formatPrice } from '../utils/constants';
import '../styles/pages/Wishlist.css';

const Wishlist = () => {
    const { wishlist, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();
    const { showToast } = useToast();

    const handleAddToCart = (product: any) => {
        addToCart(product, 'One Size', 'Default', 1);
        showToast(`${product.name} added to cart!`, 'success');
    };

    const handleRemove = (product: any) => {
        removeFromWishlist(product.id);
        showToast(`${product.name} removed from wishlist`, 'info');
    };

    if (wishlist.length === 0) {
        return (
            <div className="wishlist-page">
                <div className="wishlist-empty section">
                    <div className="container">
                        <div className="empty-state">
                            <div className="empty-icon">🤍</div>
                            <h1>Your Wishlist is Empty</h1>
                            <p>Save your favorite items to your wishlist and shop them later!</p>
                            <Link to="/shop" className="btn btn-primary btn-large">
                                Start Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="wishlist-page">
            <section className="wishlist-section section">
                <div className="container">
                    <div className="wishlist-header">
                        <h1>My Wishlist</h1>
                        <p className="wishlist-count">{wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}</p>
                    </div>

                    <div className="wishlist-grid">
                        {wishlist.map(product => (
                            <div key={product.id} className="wishlist-item">
                                <Link to={`/product/${product.id}`} className="wishlist-item-image">
                                    <div
                                        className="product-image-placeholder"
                                        style={{
                                            background: getGradientForCategory(product.category)
                                        }}
                                    >
                                        <span className="category-label">{product.category}</span>
                                    </div>
                                </Link>

                                <div className="wishlist-item-info">
                                    <Link to={`/product/${product.id}`}>
                                        <h3 className="wishlist-item-name">{product.name}</h3>
                                    </Link>
                                    <p className="wishlist-item-category">{product.category}</p>
                                    <div className="wishlist-item-price">
                                        <span className="price">{formatPrice(product.price)}</span>
                                        {product.originalPrice && (
                                            <span className="original-price">{formatPrice(product.originalPrice)}</span>
                                        )}
                                    </div>

                                    <div className="wishlist-item-actions">
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => handleAddToCart(product)}
                                        >
                                            Add to Cart
                                        </button>
                                        <button
                                            className="btn btn-outline"
                                            onClick={() => handleRemove(product)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
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

export default Wishlist;
