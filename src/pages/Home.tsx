import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { db } from '../config/firebase';
import ProductCard from '../components/ProductCard';
import Newsletter from '../components/Newsletter';
import '../styles/pages/Home.css';

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            try {
                const productsRef = collection(db, 'products');
                // In a real app, we might have a 'featured' flag or sort by popularity
                // For now, just fetch the first 4 visible products
                const q = query(productsRef, limit(10));
                const querySnapshot = await getDocs(q);

                const products = querySnapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() }))
                    .filter((p: any) => !p.isHidden)
                    .slice(0, 4);

                setFeaturedProducts(products);
            } catch (error) {
                console.error('Error fetching featured products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedProducts();
    }, []);

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-background"></div>
                <div className="hero-overlay"></div>
                <div className="hero-decoration decoration-1"></div>
                <div className="hero-decoration decoration-2"></div>

                <div className="hero-content">
                    <p className="hero-subtitle gradient-text">Celebrating Indian Heritage</p>
                    <h1 className="hero-title">
                        Timeless <span className="gold-text">Elegance</span>
                    </h1>
                    <p className="hero-description">
                        Discover the finest collection of traditional Indian wear. From exquisite sarees to stunning lehengas,
                        embrace the beauty of Indian craftsmanship.
                    </p>
                    <div className="hero-cta">
                        <Link to="/shop" className="btn btn-primary">Explore Collection</Link>
                        <Link to="/about" className="btn btn-outline">Our Story</Link>
                    </div>
                </div>
            </section>

            {/* Collections Section */}
            <section className="collections section">
                <div className="container">
                    <div className="section-header">
                        <p className="section-subtitle">Curated For You</p>
                        <h2 className="section-title">Featured <span className="gradient-text">Collections</span></h2>
                    </div>

                    <div className="collections-grid">
                        <Link to="/shop?category=Sarees" className="collection-card">
                            <div className="collection-image" style={{
                                background: 'linear-gradient(135deg, #C71585 0%, #FF1493 50%, #FFD700 100%)'
                            }}>
                                <span className="collection-text">Sarees</span>
                            </div>
                            <div className="collection-overlay">
                                <h3 className="collection-name">Exquisite Sarees</h3>
                                <p className="collection-description">
                                    From silk to cotton, discover our stunning saree collection
                                </p>
                                <span className="collection-link">
                                    Explore Collection →
                                </span>
                            </div>
                        </Link>

                        <Link to="/shop?category=Lehengas" className="collection-card">
                            <div className="collection-image" style={{
                                background: 'linear-gradient(135deg, #8B0000 0%, #DC143C 50%, #FFD700 100%)'
                            }}>
                                <span className="collection-text">Lehengas</span>
                            </div>
                            <div className="collection-overlay">
                                <h3 className="collection-name">Bridal Lehengas</h3>
                                <p className="collection-description">
                                    Make your special day unforgettable with our designer lehengas
                                </p>
                                <span className="collection-link">
                                    Explore Collection →
                                </span>
                            </div>
                        </Link>

                        <Link to="/shop?category=Suits" className="collection-card">
                            <div className="collection-image" style={{
                                background: 'linear-gradient(135deg, #4B0082 0%, #9370DB 50%, #FFB6C1 100%)'
                            }}>
                                <span className="collection-text">Suits</span>
                            </div>
                            <div className="collection-overlay">
                                <h3 className="collection-name">Elegant Suits</h3>
                                <p className="collection-description">
                                    Contemporary designs with traditional charm
                                </p>
                                <span className="collection-link">
                                    Explore Collection →
                                </span>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="featured-products section">
                <div className="container">
                    <div className="section-header">
                        <p className="section-subtitle">Trending Now</p>
                        <h2 className="section-title">Bestselling <span className="gradient-text">Pieces</span></h2>
                    </div>

                    {loading ? (
                        <div className="loading-spinner">Loading featured products...</div>
                    ) : (
                        <div className="products-grid">
                            {featuredProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                            {featuredProducts.length === 0 && (
                                <p className="no-products-text">Check back soon for our latest collection!</p>
                            )}
                        </div>
                    )}

                    <div className="view-all-cta">
                        <Link to="/shop" className="btn btn-gold">View All Products</Link>
                    </div>
                </div>
            </section>

            {/* Brand Story Preview */}
            <section className="brand-story section">
                <div className="container">
                    <div className="story-content">
                        <div className="story-text">
                            <p className="section-subtitle">About Vatsala</p>
                            <h2>Crafting <span className="gradient-text">Traditions</span></h2>
                            <p>
                                At Vatsala, we celebrate the rich heritage of Indian traditional wear. Each piece in our
                                collection is carefully curated to bring you the finest quality fabrics, intricate craftsmanship,
                                and timeless designs that honor our cultural legacy.
                            </p>
                            <p>
                                From handwoven sarees to intricately embroidered lehengas, we work with skilled artisans
                                across India to bring you authentic traditional wear that makes you feel beautiful and confident.
                            </p>
                            <Link to="/about" className="btn btn-gold">Learn More About Us</Link>
                        </div>
                        <div className="story-image">
                            <div className="story-gradient">
                                <span>Handcrafted Excellence</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Newsletter */}
            <Newsletter />
        </div>
    );
};

export default Home;
