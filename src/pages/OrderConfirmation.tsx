import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { formatPrice } from '../utils/constants';
import '../styles/pages/OrderConfirmation.css';

const OrderConfirmation = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadOrder = async () => {
            if (!orderId) return;

            try {
                const orderRef = doc(db, 'orders', orderId);
                const orderSnap = await getDoc(orderRef);

                if (orderSnap.exists()) {
                    setOrder({ id: orderSnap.id, ...orderSnap.data() });
                }
            } catch (error) {
                console.error('Error loading order:', error);
            } finally {
                setLoading(false);
            }
        };

        loadOrder();
    }, [orderId]);

    if (loading) {
        return (
            <div className="order-confirmation-page">
                <div className="container">
                    <div className="confirmation-card">
                        <p>Loading order...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="order-confirmation-page">
                <div className="container">
                    <div className="confirmation-card">
                        <h1>Order Not Found</h1>
                        <p>We couldn't find the order you're looking for.</p>
                        <Link to="/shop" className="btn btn-primary">Continue Shopping</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="order-confirmation-page">
            <div className="container">
                <div className="confirmation-card">
                    <div className="success-icon">✓</div>
                    <h1>Order Confirmed!</h1>
                    <p className="confirmation-message">
                        Thank you for your order. We've received your order and will process it soon.
                    </p>

                    <div className="order-details">
                        <div className="order-info">
                            <h3>Order Number</h3>
                            <p className="order-number">{order.id}</p>
                        </div>

                        <div className="order-info">
                            <h3>Order Total</h3>
                            <p className="order-total">{formatPrice(order.total)}</p>
                        </div>

                        <div className="order-info">
                            <h3>Payment Method</h3>
                            <p>{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
                        </div>

                        <div className="order-info">
                            <h3>Delivery Address</h3>
                            <p>
                                {order.shippingAddress.fullName}<br />
                                {order.shippingAddress.address}<br />
                                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}<br />
                                {order.shippingAddress.phone}
                            </p>
                        </div>
                    </div>

                    <div className="order-items">
                        <h3>Order Items</h3>
                        {order.items.map((item: any) => (
                            <div key={item.id} className="confirmation-item">
                                <div className="item-details">
                                    <p className="item-name">{item.product.name}</p>
                                    <p className="item-options">{item.size} • {item.color} • Qty: {item.quantity}</p>
                                </div>
                                <p className="item-price">{formatPrice(item.product.price * item.quantity)}</p>
                            </div>
                        ))}
                    </div>

                    <div className="confirmation-actions">
                        <Link to="/orders" className="btn btn-outline">
                            View Orders
                        </Link>
                        <Link to="/shop" className="btn btn-primary">
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmation;
