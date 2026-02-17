import { Link } from 'react-router-dom';
import ProductRow from '../components/ProductRow';
import ProductCard from '../components/ProductCard';
import Testimonials from '../components/Testimonials';
import Newsletter from '../components/Newsletter';
import NewsletterPopup from '../components/NewsletterPopup';
import CategoryRail from '../components/CategoryRail';
import DealTimer from '../components/DealTimer';
import WhatsAppBtn from '../components/WhatsAppBtn';
import HeroGrid from '../components/HeroGrid';
import { useShopifyProducts } from '../hooks/useShopifyProducts';
import { shopifyToProduct } from '../utils/constants'; // Import mapper
import '../styles/pages/Home.css';

const Home = () => {
    const { products, loading, error } = useShopifyProducts();
    // Filter featured products (taking first 4 for now)
    // Map Shopify products to internal Product interface if needed, or ProductCard handles it
    // ProductCard expects `product` prop of type `Product` (internal)
    // `useShopifyProducts` returns `ShopifyProduct[]`
    // We need to map them.
    const featuredProducts = products.slice(0, 5).map(p => shopifyToProduct(p));

    return (
        <div className="home-page">
            {/* Hero Grid Section (Replaces Marquee + Old Hero) */}
            <HeroGrid />

            {/* Category Rail (Quick Links) */}
            <CategoryRail />

            {/* Deal Timer */}
            <DealTimer />

            {/* Collections Section */}
            <section className="collections section">
                <div className="container">
                    <div className="section-header">
                        <span className="section-subtitle">Curated For You</span>
                        <h2 className="section-title">Shop By Category</h2>
                    </div>

                    <div className="collections-grid">
                        <Link to="/shop?category=Sarees" className="collection-card">
                            <div className="collection-image">
                                <img src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80" alt="Silk Sarees" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div className="collection-overlay">
                                <h3 className="collection-name">Silk Sarees</h3>
                                <p className="collection-description">Handwoven masterpieces typically for weddings and festivals.</p>
                                <span className="collection-link">Explore Collection &rarr;</span>
                            </div>
                        </Link>

                        <Link to="/shop?category=Lehengas" className="collection-card">
                            <div className="collection-image">
                                <img src="https://images.unsplash.com/photo-1594951676644-2453e00787cb?w=600&auto=format&fit=crop&q=80" alt="Bridal Lehengas" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div className="collection-overlay">
                                <h3 className="collection-name">Bridal Lehengas</h3>
                                <p className="collection-description">Intricate embroidery and royal silhouettes for your big day.</p>
                                <span className="collection-link">Explore Collection &rarr;</span>
                            </div>
                        </Link>

                        <Link to="/shop?category=Suits" className="collection-card">
                            <div className="collection-image">
                                <img src="https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=600&auto=format&fit=crop&q=80" alt="Designer Suits" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div className="collection-overlay">
                                <h3 className="collection-name">Designer Suits</h3>
                                <p className="collection-description">Contemporary styles meeting traditional comfort.</p>
                                <span className="collection-link">Explore Collection &rarr;</span>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>


            {/* Featured Products (Trending Now) */}
            <section className="featured-products section">
                <div className="container">
                    <div className="section-header">
                        <span className="section-subtitle">Best Sellers</span>
                        <h2 className="section-title">Trending Now</h2>
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '2rem' }}>Loading products...</div>
                    ) : error ? (
                        <div style={{ textAlign: 'center', color: '#ff6b6b' }}>{error}</div>
                    ) : (
                        <div className="products-grid trending-grid">
                            {featuredProducts.length > 0 ? featuredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            )) : (
                                <div style={{ gridColumn: '1/-1', textAlign: 'center' }}>No products found.</div>
                            )}
                        </div>
                    )}

                    <div className="view-all-cta">
                        <Link to="/shop" className="btn btn-outline">View All Products</Link>
                    </div>
                </div>
            </section>

            {/* Recent Additions by Category */}
            {!loading && !error && (
                <>
                    <ProductRow
                        title="Lehengas"
                        products={products.filter(p => {
                            const type = p.productType?.toLowerCase() || '';
                            const collections = p.collections?.map(c => c.title.toLowerCase()) || [];
                            return type.includes('lehenga') || type.includes('lengha') || collections.some(c => c.includes('lehenga') || c.includes('lengha'));
                        }).slice(0, 8).map(p => shopifyToProduct(p))}
                        viewAllLink="/shop?category=Lehengas"
                    />
                    <ProductRow
                        title="Blouses"
                        products={products.filter(p => {
                            const type = p.productType?.toLowerCase() || '';
                            const collections = p.collections?.map(c => c.title.toLowerCase()) || [];
                            return type.includes('blouse') || collections.some(c => c.includes('blouse'));
                        }).slice(0, 8).map(p => shopifyToProduct(p))}
                        viewAllLink="/shop?category=Blouses"
                    />
                    <ProductRow
                        title="Suits"
                        products={products.filter(p => {
                            const type = p.productType?.toLowerCase() || '';
                            const collections = p.collections?.map(c => c.title.toLowerCase()) || [];
                            return type.includes('suit') || collections.some(c => c.includes('suit'));
                        }).slice(0, 8).map(p => shopifyToProduct(p))}
                        viewAllLink="/shop?category=Suits"
                    />
                    <ProductRow
                        title="Sarees"
                        products={products.filter(p => {
                            const type = p.productType?.toLowerCase() || '';
                            const collections = p.collections?.map(c => c.title.toLowerCase()) || [];
                            return type.includes('saree') || collections.some(c => c.includes('saree'));
                        }).slice(0, 8).map(p => shopifyToProduct(p))}
                        viewAllLink="/shop?category=Sarees"
                    />
                </>
            )}

            {/* Testimonials */}
            <Testimonials />

            {/* Newsletter */}

            <Newsletter />

            {/* Popup */}
            <NewsletterPopup />

            {/* WhatsApp Chat */}
            <WhatsAppBtn />
        </div>
    );
};

export default Home;
