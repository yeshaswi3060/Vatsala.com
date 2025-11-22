import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { formatPrice } from '../utils/constants';
import '../styles/pages/Cart.css';

const Cart = () => {
    const { items, itemCount, total, removeFromCart, updateQuantity } = useCart();

    if (itemCount === 0) {
        return (
            <div className="cart-page">
                <div className="container">
                    <div className="empty-cart">
                        <div className="empty-cart-icon">🛍️</div>
                        <h2>Your Cart is Empty</h2>
                        <p>Add some beautiful traditional wear to your cart!</p>
                        <Link to="/shop" className="btn btn-primary">
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="container">
                <h1 className="page-title">Shopping Cart</h1>
                <p className="cart-count">{itemCount} {itemCount === 1 ? 'item' : 'items'}</p>

                <div className="cart-content">
                    <div className="cart-items">
                        {items.map((item) => (
                            <div key={item.id} className="cart-item">
                                <div className="cart-item-image">
                                    <img src={item.product.image} alt={item.product.name} />
                                </div>

                                <div className="cart-item-details">
                                    <h3>{item.product.name}</h3>
                                    <p className="cart-item-category">{item.product.category}</p>
                                    <div className="cart-item-options">
                                        <span>Size: {item.size}</span>
                                        <span>Color: {item.color}</span>
                                    </div>
                                </div>

                                <div className="cart-item-quantity">
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        className="quantity-btn"
                                    >
                                        −
                                    </button>
                                    <span className="quantity">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="quantity-btn"
                                    >
                                        +
                                    </button>
                                </div>

                                <div className="cart-item-price">
                                    <p className="price">{formatPrice(item.product.price * item.quantity)}</p>
                                    <p className="price-per-item">{formatPrice(item.product.price)} each</p>
                                </div>

                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="remove-btn"
                                    aria-label="Remove item"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary">
                        <h2>Order Summary</h2>

                        <div className="summary-row">
                            <span>Subtotal ({itemCount} items)</span>
                            <span>{formatPrice(total)}</span>
                        </div>

                        <div className="summary-row">
                            <span>Shipping</span>
                            <span className="free-shipping">FREE</span>
                        </div>

                        <div className="summary-divider"></div>

                        <div className="summary-row summary-total">
                            <span>Total</span>
                            <span>{formatPrice(total)}</span>
                        </div>

                        <Link to="/checkout" className="btn btn-primary btn-large">
                            Proceed to Checkout
                        </Link>

                        <Link to="/shop" className="continue-shopping">
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
