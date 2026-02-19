
import { useState, useEffect } from 'react';
// Link removed as it was unused
import { fetchAllProducts } from '../../lib/shopify';
import { formatPrice } from '../../utils/constants';
import '../../styles/pages/admin/AdminProducts.css';

const AdminProducts = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDemo, setIsDemo] = useState(false);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            // Using Storefront API (public) as requested by user
            const storefrontProducts = await fetchAllProducts(50);

            setProducts(storefrontProducts.map(p => ({
                id: p.id.split('/').pop(),
                name: p.title,
                // Use Product Type -> First Collection -> Uncategorized
                category: p.productType || (p.collections && p.collections.length > 0 ? p.collections[0].title : 'Uncategorized'),
                price: p.priceRange.minVariantPrice.amount,
                image: p.images[0]?.url || 'https://placehold.co/100x100?text=No+Image',
                // Storefront API only returns "published" products. 
                // availableForSale = false usually means Sold Out, not Draft.
                status: p.availableForSale ? 'ACTIVE' : 'SOLD OUT',
                inventory: p.availableForSale ? 'In Stock' : 'Out of Stock',
                vendor: 'Shopify',
                handle: p.handle
            })));
            setIsDemo(false);
        } catch (error) {
            console.error("Failed to fetch products:", error);
            setIsDemo(true);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading-spinner">Loading products...</div>;

    return (
        <div className="admin-products">
            {isDemo && (
                <div style={{ background: '#fff3cd', color: '#856404', padding: '1rem', marginBottom: '1rem', borderRadius: '8px', border: '1px solid #ffeeba' }}>
                    <strong>Note:</strong> Showing Demo Data. Add <code>VITE_SHOPIFY_ADMIN_ACCESS_TOKEN</code> to <code>.env</code> to see real products.
                </div>
            )}
            <div className="page-header">
                <h1>Product Management</h1>
                <div className="header-actions">
                    <p style={{ color: '#888', fontSize: '0.9rem', marginRight: '1rem' }}>
                        Products are managed in your Shopify Admin
                    </p>
                    <a
                        href={`https://${import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || 'admin.shopify.com'}/admin/products`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-primary"
                    >
                        Manage on Shopify ↗
                    </a>
                </div>
            </div>

            <div className="products-table-container">
                <table className="products-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Inventory</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id}>
                                <td>
                                    <img src={product.image} alt={product.name} className="product-thumbnail" />
                                </td>
                                <td>
                                    <div className="product-name-cell">
                                        <span className="name">{product.name}</span>
                                        <span className="badge-pill" style={{ background: '#f3f4f6', color: '#666', fontSize: '0.75rem' }}>{product.vendor}</span>
                                    </div>
                                </td>
                                <td>{product.category}</td>
                                <td>
                                    <div className="price-cell">
                                        <span className="current-price">{formatPrice(parseFloat(product.price))}</span>
                                    </div>
                                </td>
                                <td>{product.inventory}</td>
                                <td>
                                    <span className={`status-badge status-${product.status.toLowerCase().replace(' ', '-')}`}>
                                        {product.status}
                                    </span>
                                </td>
                                <td>
                                    <a
                                        href={`/admin/products/${product.id}`}
                                        className="btn btn-sm btn-outline"
                                        style={{ whiteSpace: 'nowrap' }}
                                    >
                                        Edit ↗
                                    </a>
                                </td>
                            </tr>
                        ))}
                        {products.length === 0 && (
                            <tr>
                                <td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>No products found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminProducts;
