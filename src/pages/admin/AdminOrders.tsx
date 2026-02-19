import { useState, useEffect } from 'react';
import { fetchRecentOrders, type AdminOrder } from '../../lib/shopifyAdmin';
import { formatPrice } from '../../utils/constants';
import '../../styles/pages/admin/AdminDashboard.css'; // Reusing dashboard styles for table

// NOTE: The Storefront API (public key) CANNOT fetch all shop orders. 
// It can only fetch a specific customer's orders if they are logged in.
// To see ALL orders in an Admin Panel, you MUST use the Admin API (Secret Key).
// For now, we will show a placeholder/demo to differentiate this page from the Dashboard.

const AdminOrders = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadOrders = async () => {
            try {
                if (!import.meta.env.VITE_SHOPIFY_ADMIN_ACCESS_TOKEN) {
                    console.warn("Admin Token missing in .env");
                }
                const recentOrders = await fetchRecentOrders(20);

                setOrders(recentOrders.map((o: AdminOrder) => ({
                    id: o.id.split('/').pop(),
                    customer: o.customer ? `${o.customer.firstName} ${o.customer.lastName}` : 'Walk-in',
                    date: new Date(o.createdAt).toLocaleDateString(),
                    total: o.totalPriceSet.shopMoney.amount,
                    status: o.displayFulfillmentStatus || 'UNFULFILLED',
                    payment: 'Paid', // Simplification for now
                })));
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            } finally {
                setLoading(false);
            }
        };

        loadOrders();
    }, []);

    if (loading) return <div className="loading-spinner">Loading orders...</div>;

    return (
        <div className="admin-dashboard"> {/* Reusing dashboard container class */}
            <div className="dashboard-header">
                <div>
                    <h1>Orders</h1>
                    <p>Manage and fulfill your store orders.</p>
                </div>
            </div>

            <div className="table-section">
                <div className="card-header">
                    <h3>All Orders</h3>
                </div>
                <div className="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Payment</th>
                                <th>Total</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id}>
                                    <td>#{order.id}</td>
                                    <td style={{ fontWeight: 600 }}>{order.customer}</td>
                                    <td>{order.date}</td>
                                    <td><span className={`status-badge status-${order.status.toLowerCase()}`}>{order.status}</span></td>
                                    <td>{order.payment}</td>
                                    <td style={{ fontWeight: 700 }}>{formatPrice(parseFloat(order.total))}</td>
                                    <td>
                                        <button className="btn-icon">👁️</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminOrders;
