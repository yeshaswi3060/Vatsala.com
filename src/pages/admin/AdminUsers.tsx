import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import '../../styles/pages/admin/AdminUsers.css';

const AdminUsers = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'users'));
            const usersData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setUsers(usersData);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) return <div className="loading-spinner">Loading users...</div>;

    return (
        <div className="admin-users">
            <div className="page-header">
                <h1>User Management</h1>
                <div className="header-actions">
                    <span className="user-count">{users.length} Users</span>
                </div>
            </div>

            <div className="users-table-container">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Joined</th>
                            <th>Last Login</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>
                                    <div className="user-name-cell">
                                        <div className="user-avatar">
                                            {user.name?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                        <span className="name">{user.name || 'Unknown User'}</span>
                                    </div>
                                </td>
                                <td>{user.email}</td>
                                <td>
                                    <span className={`role-badge ${user.isAdmin ? 'admin' : 'user'}`}>
                                        {user.isAdmin ? 'Admin' : 'Customer'}
                                    </span>
                                </td>
                                <td>{formatDate(user.createdAt)}</td>
                                <td>{formatDate(user.lastLogin)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminUsers;
