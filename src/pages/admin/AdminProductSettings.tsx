import { useState, useEffect } from 'react';
import { fetchAllProducts } from '../../lib/shopify';
import { shopifyToProduct, type Product } from '../../utils/constants';
import '../../styles/pages/admin/AdminSettings.css'; // Reusing the same styles



interface ProductExtension {
    features: string[];
    specifications: { label: string; value: string }[];
    reviews?: { reviewer: string; rating: number; text: string; date: string }[];
}

const AdminProductSettings = () => {
    const [message, setMessage] = useState({ text: '', type: '' });

    // Product Extensions State
    const [products, setProducts] = useState<Product[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [editingExtension, setEditingExtension] = useState<ProductExtension | null>(null);
    const [savingExtension, setSavingExtension] = useState(false);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const shopifyProducts = await fetchAllProducts(50);
            setProducts(shopifyProducts.map(shopifyToProduct));
        } catch (error) {
            console.error('Failed to load Shopify products:', error);
        } finally {
            setLoadingProducts(false);
        }
    };

    const handleEditProduct = async (product: Product) => {
        setEditingProduct(product);
        setEditingExtension(null);

        try {
            const cleanId = product.id.replace('gid://shopify/Product/', '');
            const response = await fetch(`/api/product-extensions?productId=${cleanId}`);
            if (response.ok) {
                const data = await response.json();
                setEditingExtension({
                    features: data.features?.length > 0 ? data.features : [
                        "Premium Quality Material",
                        "Handcrafted Finish",
                        "Eco-friendly process",
                        "Perfect Fit Guarantee"
                    ],
                    specifications: data.specifications?.length > 0 ? data.specifications : [
                        { label: 'Material', value: 'Cotton / Silk Blend' },
                        { label: 'Care', value: 'Dry Clean Only' },
                        { label: 'Origin', value: 'India' }
                    ],
                    reviews: data.reviews?.length > 0 ? data.reviews : [
                        { reviewer: "Sarah Jenkins", rating: 5, text: "The quality is better than anything I've tried. Perfect for my daily wear and special occasions. The gold embroidery is stunning in person!", date: "2024-03-15" },
                        { reviewer: "Mark Reynolds", rating: 5, text: "Exactly as advertised. I only buy from Allcloth now. The fit is perfect and the fabric feels incredibly premium.", date: "2024-03-10" }
                    ]
                });
            }
        } catch (err) {
            console.error("Failed to load product extension", err);
        }
    };

    const handleSaveExtension = async () => {
        if (!editingProduct || !editingExtension) return;
        setSavingExtension(true);

        try {
            const cleanId = editingProduct.id.replace('gid://shopify/Product/', '');
            const response = await fetch('/api/product-extensions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: cleanId,
                    data: editingExtension
                })
            });

            if (response.ok) {
                setMessage({ text: `Settings saved for ${editingProduct.name}`, type: 'success' });
                setEditingProduct(null);
            } else {
                setMessage({ text: 'Failed to save product overrides.', type: 'error' });
            }
        } catch (err) {
            setMessage({ text: 'Network error while saving overrides.', type: 'error' });
        } finally {
            setSavingExtension(false);
            window.scrollTo(0, 0);
        }
    };

    return (
        <div className="admin-settings">
            <div className="settings-header">
                <div>
                    <h1>Product Overrides</h1>
                    <p>Configure custom bullet points, specifications, and reviews for individual products.</p>
                </div>
            </div>

            {message.text && (
                <div className={`status-message ${message.type}`}>
                    {message.text}
                </div>
            )}

            {/* Product Extensions Grid */}
            <div className="settings-section" style={{ marginTop: '2rem' }}>
                <h2>Select a Product</h2>
                <p className="section-desc">Click on any product to enter the Custom Features Editor.</p>

                {loadingProducts ? (
                    <div className="loading-spinner">Loading store products...</div>
                ) : (
                    <div className="products-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
                        {products.map(product => (
                            <div
                                key={product.id}
                                className="product-card"
                                style={{ cursor: 'pointer', border: '1px solid #eee', padding: '10px', borderRadius: '8px', transition: 'all 0.2s ease' }}
                                onClick={() => handleEditProduct(product)}
                                onMouseOver={(e) => e.currentTarget.style.borderColor = '#dca450'}
                                onMouseOut={(e) => e.currentTarget.style.borderColor = '#eee'}
                            >
                                <img src={product.image} alt={product.name} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px' }} />
                                <h4 style={{ margin: '10px 0 5px 0', fontSize: '0.95rem' }}>{product.name}</h4>
                                <p style={{ margin: 0, color: '#666', fontSize: '0.85rem' }}>{product.category}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Product Edit Modal */}
            {editingProduct && editingExtension && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', width: '90%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                            <div>
                                <h2 style={{ margin: '0 0 5px 0' }}>Editing: {editingProduct.name}</h2>
                                <p style={{ margin: 0, color: '#666' }}>Override features and specifications for this specific product.</p>
                            </div>
                            <button onClick={() => setEditingProduct(null)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>&times;</button>
                        </div>

                        {/* Features Editor */}
                        <div className="form-group" style={{ marginBottom: '20px', padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
                            <h3>Features Bullet Points</h3>
                            <p style={{ fontSize: '0.85rem', color: '#666' }}>Shown under the "Unrivaled Quality" section.</p>

                            {editingExtension.features.map((feature, index) => (
                                <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={feature}
                                        onChange={(e) => {
                                            const newFeatures = [...editingExtension.features];
                                            newFeatures[index] = e.target.value;
                                            setEditingExtension({ ...editingExtension, features: newFeatures });
                                        }}
                                    />
                                    <button
                                        type="button"
                                        style={{ background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: '4px', padding: '0 15px', cursor: 'pointer' }}
                                        onClick={() => {
                                            const newFeatures = editingExtension.features.filter((_, i) => i !== index);
                                            setEditingExtension({ ...editingExtension, features: newFeatures });
                                        }}
                                    >Delete</button>
                                </div>
                            ))}
                            <button
                                type="button"
                                className="btn btn-outline"
                                onClick={() => setEditingExtension({ ...editingExtension, features: [...editingExtension.features, "New Feature"] })}
                            >+ Add Feature</button>
                        </div>

                        {/* Specs Editor */}
                        <div className="form-group" style={{ marginBottom: '20px', padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
                            <h3>Product Specifications</h3>

                            {editingExtension.specifications.map((spec, index) => (
                                <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                    <input
                                        type="text"
                                        placeholder="Label (e.g. Material)"
                                        className="form-control"
                                        style={{ width: '30%' }}
                                        value={spec.label}
                                        onChange={(e) => {
                                            const newSpecs = [...editingExtension.specifications];
                                            newSpecs[index].label = e.target.value;
                                            setEditingExtension({ ...editingExtension, specifications: newSpecs });
                                        }}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Value (e.g. 100% Silk)"
                                        className="form-control"
                                        value={spec.value}
                                        onChange={(e) => {
                                            const newSpecs = [...editingExtension.specifications];
                                            newSpecs[index].value = e.target.value;
                                            setEditingExtension({ ...editingExtension, specifications: newSpecs });
                                        }}
                                    />
                                    <button
                                        type="button"
                                        style={{ background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: '4px', padding: '0 15px', cursor: 'pointer' }}
                                        onClick={() => {
                                            const newSpecs = editingExtension.specifications.filter((_, i) => i !== index);
                                            setEditingExtension({ ...editingExtension, specifications: newSpecs });
                                        }}
                                    >Delete</button>
                                </div>
                            ))}
                            <button
                                type="button"
                                className="btn btn-outline"
                                onClick={() => setEditingExtension({ ...editingExtension, specifications: [...editingExtension.specifications, { label: 'New Label', value: 'New Value' }] })}
                            >+ Add Specification</button>
                        </div>

                        {/* Reviews Editor */}
                        <div className="form-group" style={{ marginBottom: '20px', padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
                            <h3>Customer Reviews</h3>
                            <p style={{ fontSize: '0.85rem', color: '#666' }}>Shown on the Reviews tab.</p>

                            {(editingExtension.reviews || []).map((review, index) => (
                                <div key={index} style={{ marginBottom: '15px', padding: '15px', border: '1px dashed #ccc', borderRadius: '4px' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                                        <input
                                            type="text"
                                            placeholder="Reviewer Name (e.g. Sarah J.)"
                                            className="form-control"
                                            value={review.reviewer}
                                            onChange={(e) => {
                                                const newReviews = [...(editingExtension.reviews || [])];
                                                newReviews[index].reviewer = e.target.value;
                                                setEditingExtension({ ...editingExtension, reviews: newReviews });
                                            }}
                                        />
                                        <input
                                            type="number"
                                            min="1" max="5" step="0.5"
                                            placeholder="Rating (1-5)"
                                            className="form-control"
                                            value={review.rating}
                                            onChange={(e) => {
                                                const newReviews = [...(editingExtension.reviews || [])];
                                                newReviews[index].rating = Number(e.target.value);
                                                setEditingExtension({ ...editingExtension, reviews: newReviews });
                                            }}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <textarea
                                            placeholder="Review Text..."
                                            className="form-control"
                                            style={{ flex: 1, minHeight: '60px', padding: '10px' }}
                                            value={review.text}
                                            onChange={(e) => {
                                                const newReviews = [...(editingExtension.reviews || [])];
                                                newReviews[index].text = e.target.value;
                                                setEditingExtension({ ...editingExtension, reviews: newReviews });
                                            }}
                                        />
                                        <button
                                            type="button"
                                            style={{ background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: '4px', padding: '0 15px', cursor: 'pointer' }}
                                            onClick={() => {
                                                const newReviews = (editingExtension.reviews || []).filter((_, i) => i !== index);
                                                setEditingExtension({ ...editingExtension, reviews: newReviews });
                                            }}
                                        >Delete</button>
                                    </div>
                                </div>
                            ))}
                            <button
                                type="button"
                                className="btn btn-outline"
                                onClick={() => setEditingExtension({
                                    ...editingExtension,
                                    reviews: [...(editingExtension.reviews || []), { reviewer: 'New User', rating: 5, text: 'Great product!', date: new Date().toISOString().split('T')[0] }]
                                })}
                            >+ Add Review</button>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
                            <button type="button" className="btn btn-outline" onClick={() => setEditingProduct(null)}>Cancel</button>
                            <button type="button" className="btn btn-primary" onClick={handleSaveExtension} disabled={savingExtension}>
                                {savingExtension ? 'Saving...' : 'Save Product Overrides'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProductSettings;
