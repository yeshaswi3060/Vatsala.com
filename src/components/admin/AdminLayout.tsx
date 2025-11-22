import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/components/admin/AdminLayout.css';

const AdminLayout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const isActive = (path: string) => location.pathname === path;

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    // Close sidebar on route change (mobile)
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location.pathname]);

    return (
        <div className="admin-layout">
            <button className="sidebar-toggle" onClick={toggleSidebar}>
                ☰
            </button>

            <div className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`} onClick={() => setIsSidebarOpen(false)} />

            <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <div className="header-top">
                        <h2>Admin Panel</h2>
                        <button className="close-sidebar" onClick={() => setIsSidebarOpen(false)}>×</button>
                    </div>
                    <p>Welcome, {user?.name?.split(' ')[0]}</p>
                </div>

                <nav className="sidebar-nav">
                    <Link
                        to="/admin"
                        className={`nav-item ${isActive('/admin') ? 'active' : ''}`}
                    >
                        <span className="icon">📊</span>
                        Dashboard
                    </Link>
                    <Link
                        to="/admin/products"
                        className={`nav-item ${isActive('/admin/products') ? 'active' : ''}`}
                    >
                        <span className="icon">👗</span>
                        Products
                    </Link>
                    <Link
                        to="/admin/orders"
                        className={`nav-item ${isActive('/admin/orders') ? 'active' : ''}`}
                    >
                        <span className="icon">📦</span>
                        Orders
                    </Link>
                    <Link
                        to="/admin/users"
                        className={`nav-item ${isActive('/admin/users') ? 'active' : ''}`}
                    >
                        <span className="icon">👥</span>
                        Users
                    </Link>
                    <Link
                        to="/admin/promocodes"
                        className={`nav-item ${isActive('/admin/promocodes') ? 'active' : ''}`}
                    >
                        <span className="icon">🏷️</span>
                        Promo Codes
                    </Link>
                </nav>

                <div className="sidebar-footer">
                    <button onClick={logout} className="logout-btn">
                        <span className="icon">🚪</span>
                        Logout
                    </button>
                </div>
            </aside>

            <main className="admin-content">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
