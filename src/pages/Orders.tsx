import { useAuth } from '../contexts/AuthContext';
import { formatPrice } from '../utils/constants';
import { Link } from 'react-router-dom';
import '../styles/pages/Orders.css';

const Orders = () => {
    const { user } = useAuth();

    // Get orders from localStorage
    const ordersData = localStorage.getItem('vatsala_orders');
    const allOrders = ordersData ? JSON.parse(ordersData) : [];

    // Filter orders for current user
    const userOrders = allOrders.filter((order: any) => order.userId === user?.id);

    if (userOrders.length === 0) {
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
                <p className="orders-count">{userOrders.length} {userOrders.length === 1 ? 'order' : 'orders'}</p>

                <div className="orders-list">
                    {userOrders.reverse().map((order: any) => (
                        <div key={order.id} className="order-card">
                            <div className="order-header">
                                <div className="order-id">
                                    <span className="order-label">Order ID:</span>
                                    <span className="order-number">{order.id}</span>
                                </div>
                                <div className="order-date">
                                    {new Date(order.date).toLocaleDateString('en-IN', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </div>
                            </div>

                            <div className="order-items">
                                {order.items.map((item: any) => (
                                    <div key={item.id} className="order-item">
                                        <img src={item.product.image} alt={item.product.name} />
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
