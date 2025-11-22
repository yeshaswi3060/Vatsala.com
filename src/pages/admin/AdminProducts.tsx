import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { PRODUCTS as initialProducts } from '../../utils/constants';
import { formatPrice } from '../../utils/constants';
import '../../styles/pages/admin/AdminProducts.css';

const AdminProducts = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: 'Sarees',
        image: '',
        description: '',
        badge: '',
        originalPrice: ''
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'products'));
            const productsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProducts(productsData);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    // Seed Database with initial products
    const seedDatabase = async () => {
        if (!window.confirm('This will add all default products to the database. Continue?')) return;

        setLoading(true);
        try {
            const batch = writeBatch(db);
            initialProducts.forEach(product => {
                const docRef = doc(collection(db, 'products'));
                batch.set(docRef, {
                    ...product,
                    isHidden: false,
                    createdAt: new Date()
                });
            });
            await batch.commit();
            await fetchProducts();
            alert('Database seeded successfully!');
        } catch (error) {
            console.error('Error seeding database:', error);
            alert('Failed to seed database');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const productData = {
                name: formData.name,
                price: Number(formData.price),
                category: formData.category,
                image: formData.image,
                description: formData.description,
                badge: formData.badge || null,
                originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
                updatedAt: new Date()
            };

            if (editingProduct) {
                await updateDoc(doc(db, 'products', editingProduct.id), productData);
            } else {
                await addDoc(collection(db, 'products'), {
                    ...productData,
                    isHidden: false,
                    createdAt: new Date()
                });
            }

            setShowForm(false);
            setEditingProduct(null);
            resetForm();
            fetchProducts();
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Failed to save product');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        try {
            await deleteDoc(doc(db, 'products', id));
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Failed to delete product');
        }
    };

    const toggleVisibility = async (product: any) => {
        try {
            await updateDoc(doc(db, 'products', product.id), {
                isHidden: !product.isHidden
            });
            fetchProducts();
        } catch (error) {
            console.error('Error updating visibility:', error);
        }
    };

    const handleEdit = (product: any) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            price: product.price.toString(),
            category: product.category,
            image: product.image,
            description: product.description || '',
            badge: product.badge || '',
            originalPrice: product.originalPrice?.toString() || ''
        });
        setShowForm(true);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            price: '',
            category: 'Sarees',
            image: '',
            description: '',
            badge: '',
            originalPrice: ''
        });
    };

    if (loading && !showForm) return <div className="loading-spinner">Loading products...</div>;

    return (
        <div className="admin-products">
            <div className="page-header">
                <h1>Product Management</h1>
                <div className="header-actions">
                    {products.length === 0 && (
                        <button onClick={seedDatabase} className="btn btn-outline">
                            Seed Database
                        </button>
                    )}
                    <button
                        onClick={() => {
                            setEditingProduct(null);
                            resetForm();
                            setShowForm(true);
                        }}
                        className="btn btn-primary"
                    >
                        + Add Product
                    </button>
                </div>
            </div>

            {showForm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Product Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Price (₹)</label>
                                    <input
                                        type="number"
                                        value={formData.price}
                                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Original Price (Optional)</label>
                                    <input
                                        type="number"
                                        value={formData.originalPrice}
                                        onChange={e => setFormData({ ...formData, originalPrice: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option value="Sarees">Sarees</option>
                                        <option value="Lehengas">Lehengas</option>
                                        <option value="Suits">Suits</option>
                                        <option value="Kurtis">Kurtis</option>
                                        <option value="Gowns">Gowns</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Badge (Optional)</label>
                                    <input
                                        type="text"
                                        value={formData.badge}
                                        onChange={e => setFormData({ ...formData, badge: e.target.value })}
                                        placeholder="e.g., New, Sale"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Image URL</label>
                                <input
                                    type="url"
                                    value={formData.image}
                                    onChange={e => setFormData({ ...formData, image: e.target.value })}
                                    required
                                    placeholder="https://..."
                                />
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                />
                            </div>

                            <div className="form-actions">
                                <button type="button" onClick={() => setShowForm(false)} className="btn btn-outline">Cancel</button>
                                <button type="submit" className="btn btn-primary">Save Product</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="products-table-container">
                <table className="products-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id} className={product.isHidden ? 'product-hidden' : ''}>
                                <td>
                                    <img src={product.image} alt={product.name} className="product-thumbnail" />
                                </td>
                                <td>
                                    <div className="product-name-cell">
                                        <span className="name">{product.name}</span>
                                        {product.badge && <span className="badge-pill">{product.badge}</span>}
                                    </div>
                                </td>
                                <td>{product.category}</td>
                                <td>
                                    <div className="price-cell">
                                        <span className="current-price">{formatPrice(product.price)}</span>
                                        {product.originalPrice && (
                                            <span className="original-price">{formatPrice(product.originalPrice)}</span>
                                        )}
                                    </div>
                                </td>
                                <td>
                                    <button
                                        onClick={() => toggleVisibility(product)}
                                        className={`status-badge ${product.isHidden ? 'hidden' : 'visible'}`}
                                    >
                                        {product.isHidden ? 'Hidden' : 'Visible'}
                                    </button>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button onClick={() => handleEdit(product)} className="btn-icon edit" title="Edit">✏️</button>
                                        <button onClick={() => handleDelete(product.id)} className="btn-icon delete" title="Delete">🗑️</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminProducts;
