import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../contexts/ProfileContext';
import { useToast } from '../contexts/ToastContext';
import { formatPrice } from '../utils/constants';
import '../styles/pages/Checkout.css';

const Checkout = () => {
    const { items, total, clearCart } = useCart();
    const { user } = useAuth();
    const { getShippingInfo, saveShippingInfo } = useProfile();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const [promoCode, setPromoCode] = useState('');
    const [discount, setDiscount] = useState<{ type: string; value: number; code: string } | null>(null);
    const [promoLoading, setPromoLoading] = useState(false);

    // ... (existing useEffect)

    const handleApplyPromo = async () => {
        if (!promoCode.trim()) {
            showToast('Please enter a promo code', 'error');
            return;
        }

        setPromoLoading(true);
        try {
            const q = query(
                collection(db, 'promoCodes'),
                where('code', '==', promoCode.toUpperCase()),
                where('isActive', '==', true)
            );
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                showToast('Invalid promo code', 'error');
                setDiscount(null);
            } else {
                const promoData = querySnapshot.docs[0].data();
                const expiryDate = new Date(promoData.expiryDate);

                if (expiryDate < new Date()) {
                    showToast('Promo code has expired', 'error');
                    setDiscount(null);
                } else {
                    setDiscount({
                        type: promoData.discountType,
                        value: promoData.discountValue,
                        code: promoData.code
                    });
                    showToast('Promo code applied successfully!', 'success');
                }
            }
        } catch (error) {
            console.error('Error applying promo code:', error);
            showToast('Failed to apply promo code', 'error');
        } finally {
            setPromoLoading(false);
        }
    };

    const calculateTotal = () => {
        if (!discount) return total;

        let discountAmount = 0;
        if (discount.type === 'percentage') {
            discountAmount = (total * discount.value) / 100;
        } else {
            discountAmount = discount.value;
        }

        return Math.max(0, total - discountAmount);
    };

    const finalTotal = calculateTotal();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            showToast('Please login to place an order', 'error');
            navigate('/login');
            return;
        }

        try {
            // Save shipping info to profile
            await saveShippingInfo({
                fullName: formData.fullName,
                address: formData.address,
                city: formData.city,
                state: formData.state,
                pincode: formData.pincode,
                phone: formData.phone
            });

            // Create order in Firestore
            const orderData = {
                userId: user.id,
                items: items,
                subtotal: total,
                discount: discount ? {
                    code: discount.code,
                    amount: total - finalTotal
                } : null,
                total: finalTotal,
                shippingAddress: {
                    fullName: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address,
                    city: formData.city,
                    state: formData.state,
                    pincode: formData.pincode
                },
                paymentMethod: formData.paymentMethod,
                status: 'pending',
                createdAt: serverTimestamp()
            };

            const docRef = await addDoc(collection(db, 'orders'), orderData);

            // Clear cart
            await clearCart();

            showToast('Order placed successfully!', 'success');

            // Navigate to order confirmation
            navigate(`/order-confirmation/${docRef.id}`);
        } catch (error) {
            console.error('Error placing order:', error);
            showToast('Failed to place order. Please try again.', 'error');
        }
    };

    // ... (existing render logic)

    return (
        <div className="checkout-page">
            <div className="container">
                <h1 className="page-title">Checkout</h1>

                <div className="checkout-content">
                    {/* ... (existing form) ... */}
                    <form onSubmit={handleSubmit} className="checkout-form">
                        {/* ... (existing form fields) ... */}
                        <div className="form-section">
                            <h2>Shipping Information</h2>
                            {/* ... (shipping fields) ... */}
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="fullName">Full Name *</label>
                                    <input
                                        type="text"
                                        id="fullName"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email">Email *</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="phone">Phone Number *</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    placeholder="+91 XXXXX XXXXX"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="address">Address *</label>
                                <textarea
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                    rows={3}
                                    placeholder="Street address, apartment, suite, etc."
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="city">City *</label>
                                    <input
                                        type="text"
                                        id="city"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="state">State *</label>
                                    <input
                                        type="text"
                                        id="state"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="pincode">Pincode *</label>
                                    <input
                                        type="text"
                                        id="pincode"
                                        name="pincode"
                                        value={formData.pincode}
                                        onChange={handleChange}
                                        required
                                        pattern="[0-9]{6}"
                                        placeholder="XXXXXX"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-section">
                            <h2>Payment Method</h2>
                            <div className="payment-options">
                                <label className="payment-option">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="cod"
                                        checked={formData.paymentMethod === 'cod'}
                                        onChange={handleChange}
                                    />
                                    <span>Cash on Delivery</span>
                                </label>

                                <label className="payment-option">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="online"
                                        checked={formData.paymentMethod === 'online'}
                                        onChange={handleChange}
                                    />
                                    <span>Online Payment (UPI/Card)</span>
                                </label>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary btn-large">
                            Place Order
                        </button>
                    </form>

                    <div className="order-summary-sidebar">
                        <h2>Order Summary</h2>

                        <div className="summary-items">
                            {items.map((item) => (
                                <div key={item.id} className="summary-item">
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

                        <div className="promo-code-section">
                            <div className="promo-input-group">
                                <input
                                    type="text"
                                    placeholder="Promo Code"
                                    value={promoCode}
                                    onChange={(e) => setPromoCode(e.target.value)}
                                    disabled={!!discount}
                                />
                                {discount ? (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setDiscount(null);
                                            setPromoCode('');
                                        }}
                                        className="btn-remove-promo"
                                    >
                                        Remove
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleApplyPromo}
                                        disabled={promoLoading || !promoCode}
                                        className="btn-apply-promo"
                                    >
                                        {promoLoading ? '...' : 'Apply'}
                                    </button>
                                )}
                            </div>
                            {discount && (
                                <p className="promo-success-msg">
                                    Code <strong>{discount.code}</strong> applied!
                                </p>
                            )}
                        </div>

                        <div className="summary-totals">
                            <div className="summary-row">
                                <span>Subtotal</span>
                                <span>{formatPrice(total)}</span>
                            </div>
                            {discount && (
                                <div className="summary-row discount-row">
                                    <span>Discount</span>
                                    <span>-{formatPrice(total - finalTotal)}</span>
                                </div>
                            )}
                            <div className="summary-row">
                                <span>Shipping</span>
                                <span className="free-shipping">FREE</span>
                            </div>
                            <div className="summary-divider"></div>
                            <div className="summary-row summary-total">
                                <span>Total</span>
                                <span>{formatPrice(finalTotal)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
