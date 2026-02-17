import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { formatPrice } from '../utils/constants';
import { createCheckout } from '../lib/shopify';
import '../styles/pages/Checkout.css';

const Checkout = () => {
    const { items, total } = useCart();
    const { user } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleShopifyCheckout = async () => {
        if (!user) {
            showToast('Please login to place an order', 'error');
            navigate('/login');
            return;
        }

        if (items.length === 0) {
            showToast('Your cart is empty', 'warning');
            return;
        }

        setLoading(true);
        try {
            // Map cart items to Shopify line items
            // We need variantId for Shopify checkout
            const lineItems = items.map(item => {
                if (!item.variantId) {
                    throw new Error(`Product ${item.product.name} is missing variant ID`);
                }
                return {
                    variantId: item.variantId,
                    quantity: item.quantity
                };
            });

            console.log('Creating checkout with items:', lineItems);
            const checkoutUrl = await createCheckout(lineItems);

            // Redirect to Shopify Checkout
            window.location.href = checkoutUrl;
        } catch (error) {
            console.error('Checkout error:', error);
            showToast('Failed to start checkout. Please try again.', 'error');
            setLoading(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="checkout-page">
                <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
                    <h1>Your Cart is Empty</h1>
                    <button onClick={() => navigate('/shop')} className="btn btn-primary" style={{ marginTop: '1rem' }}>
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <div className="container">
                <h1 className="page-title">Review & Checkout</h1>

                <div className="checkout-content" style={{ display: 'block', maxWidth: '800px', margin: '0 auto' }}>
                    <div className="order-summary-sidebar" style={{ width: '100%' }}>
                        <h2>Order Summary</h2>

                        <div className="summary-items">
                            {items.map((item) => (
                                <div key={item.id} className="summary-item">
                                    <div className="summary-image">
                                        <img src={item.product.image} alt={item.product.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                                    </div>
                                    <div className="summary-item-details">
                                        <p className="summary-item-name">{item.product.name}</p>
                                        <p className="summary-item-options">
                                            {item.size} • {item.color} • Qty: {item.quantity}
                                        </p>
                                    </div>
                                    <p className="summary-item-price">{formatPrice(item.product.price * item.quantity)}</p>
                                </div>
                            ))}
                        </div>

                        <div className="summary-totals">
                            <div className="summary-row">
                                <span>Subtotal</span>
                                <span>{formatPrice(total)}</span>
                            </div>
                            <div className="summary-row">
                                <span>Shipping</span>
                                <span className="free-shipping">Calculated at next step</span>
                            </div>
                            <div className="summary-divider"></div>
                            <div className="summary-row summary-total">
                                <span>Total</span>
                                <span>{formatPrice(total)}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleShopifyCheckout}
                            disabled={loading}
                            className="btn btn-primary btn-large"
                            style={{ width: '100%', marginTop: '2rem' }}
                        >
                            {loading ? 'Redirecting to Secure Checkout...' : 'Proceed to Checkout'}
                        </button>

                        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem', color: '#888' }}>
                            You will be redirected to our secure checkout page to complete your purchase.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
