import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminRoute = () => {
    const { user, loading, isAdmin } = useAuth();

    if (loading) {
        return <div className="loading-spinner">Loading...</div>;
    }

    if (!user || !isAdmin) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <Outlet />;
};

export default AdminRoute;
