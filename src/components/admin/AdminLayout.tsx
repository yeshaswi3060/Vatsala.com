import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/components/admin/AdminLayout.css';

const AdminLayout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="sidebar-header">
                    <h2>Admin Panel</h2>
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
                    </button>
        </div>
            </aside >

    <main className="admin-content">
        <Outlet />
    </main>
        </div >
    );
};

export default AdminLayout;
