import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { formatPrice } from '../utils/constants';
import '../styles/pages/Checkout.css';

const Checkout = () => {
    const { items, total, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: user?.name || '',
        email: user?.email || '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        paymentMethod: 'cod'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Create order
        const order = {
            id: `ORD${Date.now()}`,
            userId: user?.id,
            items: items,
            total: total,
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
            date: new Date().toISOString()
        };

        // Save order to localStorage
        const ordersData = localStorage.getItem('vatsala_orders');
        const orders = ordersData ? JSON.parse(ordersData) : [];
        orders.push(order);
        localStorage.setItem('vatsala_orders', JSON.stringify(orders));

        // Clear cart
        clearCart();

        // Navigate to order confirmation
        navigate('/order-confirmation', { state: { order } });
    };

    return (
        <div className="checkout-page">
            <div className="container">
                <h1 className="page-title">Checkout</h1>

                <div className="checkout-content">
                    <form onSubmit={handleSubmit} className="checkout-form">
                        <div className="form-section">
                            <h2>Shipping Information</h2>

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
                                    <img src={item.product.image} alt={item.product.name} />
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
                                <span className="free-shipping">FREE</span>
                            </div>
                            <div className="summary-divider"></div>
                            <div className="summary-row summary-total">
                                <span>Total</span>
                                <span>{formatPrice(total)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
