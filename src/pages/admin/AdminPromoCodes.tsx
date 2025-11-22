import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import '../../styles/pages/admin/AdminPromoCodes.css';

const AdminPromoCodes = () => {
    const [promoCodes, setPromoCodes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
        discountType: 'percentage', // 'percentage' or 'fixed'
        discountValue: '',
        expiryDate: '',
        isActive: true
    });

    useEffect(() => {
        fetchPromoCodes();
    }, []);

    const fetchPromoCodes = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'promoCodes'));
            const codesData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setPromoCodes(codesData);
        } catch (error) {
            console.error('Error fetching promo codes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await addDoc(collection(db, 'promoCodes'), {
                code: formData.code.toUpperCase(),
                discountType: formData.discountType,
                discountValue: Number(formData.discountValue),
                expiryDate: formData.expiryDate,
                isActive: formData.isActive,
                createdAt: new Date().toISOString()
            });

            setShowForm(false);
            setFormData({
                code: '',
                discountType: 'percentage',
                discountValue: '',
                expiryDate: '',
                isActive: true
            });
            fetchPromoCodes();
        } catch (error) {
            console.error('Error adding promo code:', error);
            alert('Failed to add promo code');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this promo code?')) return;

        try {
            await deleteDoc(doc(db, 'promoCodes', id));
            fetchPromoCodes();
        } catch (error) {
            console.error('Error deleting promo code:', error);
        }
    };

    const toggleStatus = async (code: any) => {
        try {
            await updateDoc(doc(db, 'promoCodes', code.id), {
                isActive: !code.isActive
            });
            fetchPromoCodes();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    return (
        <div className="admin-promocodes">
            <div className="page-header">
                <h1>Promo Codes</h1>
                <button onClick={() => setShowForm(true)} className="btn btn-primary">
                    + Create New Code
                </button>
            </div>

            {showForm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Create Promo Code</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Code (e.g., SAVE10)</label>
                                <input
                                    type="text"
                                    value={formData.code}
                                    onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                    required
                                    placeholder="SUMMER2025"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Type</label>
                                    <select
                                        value={formData.discountType}
                                        onChange={e => setFormData({ ...formData, discountType: e.target.value })}
                                    >
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="fixed">Fixed Amount (₹)</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Value</label>
                                    <input
                                        type="number"
                                        value={formData.discountValue}
                                        onChange={e => setFormData({ ...formData, discountValue: e.target.value })}
                                        required
                                        min="1"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Expiry Date</label>
                                <input
                                    type="date"
                                    value={formData.expiryDate}
                                    onChange={e => setFormData({ ...formData, expiryDate: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-actions">
                                <button type="button" onClick={() => setShowForm(false)} className="btn btn-outline">Cancel</button>
                                <button type="submit" className="btn btn-primary">Create Code</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="codes-table-container">
                <table className="codes-table">
                    <thead>
                        <tr>
                            <th>Code</th>
                            <th>Discount</th>
                            <th>Expiry</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {promoCodes.map(code => (
                            <tr key={code.id} className={!code.isActive ? 'code-inactive' : ''}>
                                <td>
                                    <span className="code-badge">{code.code}</span>
                                </td>
                                <td>
                                    {code.discountType === 'percentage'
                                        ? `${code.discountValue}% OFF`
                                        : `₹${code.discountValue} OFF`}
                                </td>
                                <td>{new Date(code.expiryDate).toLocaleDateString()}</td>
                                <td>
                                    <button
                                        onClick={() => toggleStatus(code)}
                                        className={`status-badge ${code.isActive ? 'active' : 'inactive'}`}
                                    >
                                        {code.isActive ? 'Active' : 'Inactive'}
                                    </button>
                                </td>
                                <td>
                                    <button onClick={() => handleDelete(code.id)} className="btn-icon delete" title="Delete">🗑️</button>
                                </td>
                            </tr>
                        ))}
                        {promoCodes.length === 0 && !loading && (
                            <tr>
                                <td colSpan={5} className="text-center">No promo codes found. Create one!</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminPromoCodes;
