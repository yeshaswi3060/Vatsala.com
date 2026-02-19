
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchAdminProduct, fetchShopDetails } from '../../lib/shopifyAdmin';
import { fetchProductExtension, saveProductExtension, type ProductExtension } from '../../lib/firebaseProduct';
import '../../styles/pages/admin/AdminDashboard.css';

interface FeaturePoint {
    id: string;
    text: string;
}

interface SpecPoint {
    id: string;
    label: string;
    value: string;
}

const AdminProductEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [productName, setProductName] = useState('');
    const [productImage, setProductImage] = useState('');

    // Form States
    const [features, setFeatures] = useState<FeaturePoint[]>([]);
    const [specs, setSpecs] = useState<SpecPoint[]>([]);

    useEffect(() => {
        if (!id) return;

        const load = async () => {
            try {
                // 1. Fetch Basic Info from Shopify
                const product = await fetchAdminProduct(id);
                if (!product) {
                    const shop = await fetchShopDetails();
                    let errorMsg = "Product not found.";
                    if (shop) {
                        errorMsg += `\nConnected to Admin Shop: ${shop.name} (${shop.myshopifyDomain})`;
                        errorMsg += `\nLooking for Product ID: ${id}`;
                    } else {
                        errorMsg += "\nCould not verify Shop Details. Check Admin Token or Proxy.";
                    }
                    alert(errorMsg);
                    console.error(errorMsg);
                    setLoading(false);
                    return;
                }

                setProductName(product.title);
                setProductImage(product.featuredImage?.url || '');

                // 2. Fetch Extended Data from Firebase
                const extension = await fetchProductExtension(product.id);

                if (extension) {
                    setFeatures(extension.features.map((f, i) => ({ id: Date.now() + i + 'f', text: f })));
                    setSpecs(extension.specifications.map((s, i) => ({ id: Date.now() + i + 's', label: s.label, value: s.value })));
                } else {
                    // Defaults if nothing in Firebase yet
                    setFeatures([
                        { id: '1', text: 'Premium Quality Material' },
                        { id: '2', text: 'Handcrafted Finish' }
                    ]);
                    setSpecs([
                        { id: '1', label: 'Material', value: 'Cotton Blend' },
                        { id: '2', label: 'Care', value: 'Dry Clean Only' }
                    ]);
                }

                setLoading(false);

            } catch (err: any) {
                console.error("Critical error loading product:", err);
                alert(`Error loading product: ${err.message}`);
                setLoading(false);
            }
        };
        load();
    }, [id, navigate]);

    // Handlers
    const addFeature = () => {
        setFeatures([...features, { id: Date.now().toString(), text: '' }]);
    };

    const removeFeature = (fid: string) => {
        setFeatures(features.filter(f => f.id !== fid));
    };

    const updateFeature = (fid: string, val: string) => {
        setFeatures(features.map(f => f.id === fid ? { ...f, text: val } : f));
    };

    const addSpec = () => {
        setSpecs([...specs, { id: Date.now().toString(), label: '', value: '' }]);
    };

    const removeSpec = (sid: string) => {
        setSpecs(specs.filter(s => s.id !== sid));
    };

    const updateSpec = (sid: string, field: 'label' | 'value', val: string) => {
        setSpecs(specs.map(s => s.id === sid ? { ...s, [field]: val } : s));
    };

    // Save Logic
    const handleSave = async () => {
        setSaving(true);
        if (!id) return;

        const cleanFeatures = features.map(f => f.text).filter(t => t.trim() !== '');
        const cleanSpecs = specs.map(s => ({ label: s.label, value: s.value })).filter(s => s.label.trim() !== '');

        const data: ProductExtension = {
            features: cleanFeatures,
            specifications: cleanSpecs
        };

        const success = await saveProductExtension(id, data);

        if (success) {
            alert("Extended Details Saved to Database!");
        } else {
            alert("Failed to save to database. Check console.");
        }
        setSaving(false);
    };

    if (loading) return <div className="loading-spinner">Loading Editor...</div>;

    return (
        <div className="admin-dashboard">
            <div className="dashboard-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {productImage && <img src={productImage} alt="" style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }} />}
                    <div>
                        <h1>Edit Product Extensions</h1>
                        <p>Editing: <strong>{productName}</strong></p>
                    </div>
                </div>
                <div>
                    <button className="btn btn-outline" onClick={() => navigate('/admin/products')} style={{ marginRight: '1rem' }}>Back</button>
                    <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                        {saving ? 'Saving...' : 'Save to Database'}
                    </button>
                </div>
            </div>

            <div className="section-container" style={{ maxWidth: '1000px', margin: '0 auto' }}>

                <div className="card-header">
                    <h3 style={{ color: '#dfa800' }}>✨ Extended Details (Stored in Database)</h3>
                </div>

                {/* Features List */}
                <div className="card-header" style={{ marginTop: '1rem' }}>
                    <h3>Features (Bullet Points)</h3>
                </div>
                <div style={{ padding: '1.5rem', background: 'white', borderRadius: '0 0 12px 12px', marginBottom: '2rem' }}>
                    {features.map((feat, idx) => (
                        <div key={feat.id} style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
                            <span style={{ paddingTop: '0.5rem', color: '#888' }}>{idx + 1}.</span>
                            <input
                                type="text"
                                value={feat.text}
                                onChange={(e) => updateFeature(feat.id, e.target.value)}
                                placeholder="E.g. Premium Silk Fabric"
                                style={{ flex: 1, padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                            <button onClick={() => removeFeature(feat.id)} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
                        </div>
                    ))}
                    <button className="btn btn-sm btn-outline" onClick={addFeature} style={{ marginTop: '1rem' }}>+ Add Feature</button>
                </div>

                {/* Specifications */}
                <div className="card-header">
                    <h3>Specifications</h3>
                </div>
                <div style={{ padding: '1.5rem', background: 'white', borderRadius: '0 0 12px 12px', marginBottom: '2rem' }}>
                    {specs.map((spec) => (
                        <div key={spec.id} style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
                            <input
                                type="text"
                                value={spec.label}
                                onChange={(e) => updateSpec(spec.id, 'label', e.target.value)}
                                placeholder="Label (e.g. Material)"
                                style={{ flex: 1, padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                            <input
                                type="text"
                                value={spec.value}
                                onChange={(e) => updateSpec(spec.id, 'value', e.target.value)}
                                placeholder="Value (e.g. Cotton)"
                                style={{ flex: 2, padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                            <button onClick={() => removeSpec(spec.id)} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
                        </div>
                    ))}
                    <button className="btn btn-sm btn-outline" onClick={addSpec} style={{ marginTop: '1rem' }}>+ Add Specification</button>
                </div>
            </div>
        </div>
    );
};

export default AdminProductEdit;
