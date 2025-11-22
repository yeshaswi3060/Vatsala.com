import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { formatPrice } from '../utils/constants';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import '../styles/pages/Orders.css';

const Orders = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user?.id) {
                setLoading(false);
                return;
            }

            try {
                const ordersRef = collection(db, 'orders');
                const q = query(
                    ordersRef,
                    where('userId', '==', user.id)
                );

                const querySnapshot = await getDocs(q);
                const fetchedOrders = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                // Sort by date manually since we might need an index for compound queries
                fetchedOrders.sort((a: any, b: any) => {
                    const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.date || 0);
                    const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.date || 0);
                    return dateB - dateA;
                });

                setOrders(fetchedOrders);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user]);

    if (loading) {
        return (
            <div className="orders-page">
                <div className="container">
                    <div className="loading-orders">
                        <p>Loading your orders...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="orders-page">
                <div className="container">
                    <h1 className="page-title">My Orders</h1>
                    <div className="empty-orders">
                        <div className="empty-orders-icon">📦</div>
                        <h2>No Orders Yet</h2>
                        <p>Start shopping to see your orders here!</p>
                        <Link to="/shop" className="btn btn-primary">
                            Browse Products
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="orders-page">
            <div className="container">
                <h1 className="page-title">My Orders</h1>
                <p className="orders-count">{orders.length} {orders.length === 1 ? 'order' : 'orders'}</p>

                <div className="orders-list">
                    {orders.map((order) => (
                        <div key={order.id} className="order-card">
                            <div className="order-header">
                                <div className="order-id">
                                    <span className="order-label">Order ID:</span>
                                    <span className="order-number">{order.id}</span>
                                </div>
                                <div className="order-date">
                                    {order.createdAt?.toDate ?
                                        order.createdAt.toDate().toLocaleDateString('en-IN', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        }) :
                                        new Date().toLocaleDateString('en-IN')
                                    }
                                </div>
                            </div>

                            <div className="order-items">
                                {order.items.map((item: any) => (
                                    <div key={item.id} className="order-item">
                                        <div className="order-item-details">
                                            <p className="order-item-name">{item.product.name}</p>
                                            <p className="order-item-options">
                                                {item.size} • {item.color} • Qty: {item.quantity}
                                            </p>
                                        </div>
                                        <p className="order-item-price">{formatPrice(item.product.price * item.quantity)}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="order-footer">
                                <div className="order-status">
                                    <span className={`status-badge status-${order.status}`}>
                                        {order.status === 'pending' ? 'Processing' : order.status}
                                    </span>
                                </div>
                                <div className="order-total">
                                    <span className="total-label">Total:</span>
                                    <span className="total-amount">{formatPrice(order.total)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Orders;
