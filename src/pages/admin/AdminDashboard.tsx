import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { formatPrice } from '../../utils/constants';
import '../../styles/pages/admin/AdminDashboard.css';

const AdminDashboard = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);

    // Fetch all orders in real-time
    useEffect(() => {
        const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const ordersData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setOrders(ordersData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const updateStatus = async (orderId: string, newStatus: string) => {
        try {
            const orderRef = doc(db, 'orders', orderId);
            await updateDoc(orderRef, {
                status: newStatus
            });
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        }
    };

    const stats = {
        totalOrders: orders.length,
        totalRevenue: orders.reduce((sum, order) => sum + (order.total || 0), 0),
        pendingOrders: orders.filter(o => o.status === 'pending').length
    };

    if (loading) return <div className="loading-spinner">Loading dashboard...</div>;

    return (
        <div className="admin-dashboard">
            <div className="container">
                <div className="admin-header">
                    <h1>Admin Dashboard</h1>
                    <p>Manage orders and view store performance</p>
                </div>

                {/* Stats Cards */}
                <div className="admin-stats">
                    <div className="stat-card">
                        <div className="stat-icon">📦</div>
                        <div className="stat-info">
                            <h3>Total Orders</h3>
                            <p>{stats.totalOrders}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">💰</div>
                        <div className="stat-info">
                            <h3>Total Revenue</h3>
                            <p>{formatPrice(stats.totalRevenue)}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">⏳</div>
                        <div className="stat-info">
                            <h3>Pending Orders</h3>
                            <p>{stats.pendingOrders}</p>
                        </div>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="admin-orders">
                    <div className="orders-header">
                        <h2>Recent Orders</h2>
                    </div>
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Date</th>
                                    <th>Customer</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.id}>
                                        <td>#{order.id.slice(0, 8)}</td>
                                        <td>
                                            {order.createdAt?.toDate ?
                                                order.createdAt.toDate().toLocaleDateString() :
                                                new Date().toLocaleDateString()
                                            }
                                        </td>
                                        <td>{order.shippingAddress?.fullName || 'Unknown'}</td>
                                        <td>{formatPrice(order.total)}</td>
                                        <td>
                                            <select
                                                value={order.status}
                                                onChange={(e) => updateStatus(order.id, e.target.value)}
                                                className={`status-select ${order.status}`}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="shipped">Shipped</option>
                                                <option value="delivered">Delivered</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                        <td>
                                            <button
                                                className="view-btn"
                                                onClick={() => setSelectedOrder(order)}
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="order-modal-overlay" onClick={() => setSelectedOrder(null)}>
                    <div className="order-modal" onClick={e => e.stopPropagation()}>
                        <button className="close-modal" onClick={() => setSelectedOrder(null)}>&times;</button>

                        <h2>Order Details</h2>
                        <p className="text-muted">ID: {selectedOrder.id}</p>

                        <div className="modal-section">
                            <h3>Customer Information</h3>
                            <p><strong>Name:</strong> {selectedOrder.shippingAddress?.fullName}</p>
                            <p><strong>Email:</strong> {selectedOrder.shippingAddress?.email}</p>
                            <p><strong>Phone:</strong> {selectedOrder.shippingAddress?.phone}</p>
                            <p><strong>Address:</strong> {selectedOrder.shippingAddress?.address}, {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.pincode}</p>
                        </div>

                        <div className="modal-section">
                            <h3>Order Items</h3>
                            {selectedOrder.items?.map((item: any, index: number) => (
                                <div key={index} className="modal-item">
                                    <span>{item.product.name} ({item.size}, {item.color}) x{item.quantity}</span>
                                    <span>{formatPrice(item.product.price * item.quantity)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="modal-section">
                            <div className="modal-item">
                                <strong>Total Amount</strong>
                                <strong>{formatPrice(selectedOrder.total)}</strong>
                            </div>
                            <div className="modal-item">
                                <strong>Payment Method</strong>
                                <span style={{ textTransform: 'capitalize' }}>{selectedOrder.paymentMethod}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
