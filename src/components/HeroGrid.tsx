import { Link } from 'react-router-dom';
import '../styles/components/HeroGrid.css';
import TrustBadges from './TrustBadges';

const HeroGrid = () => {
    return (
        <section className="hero-grid-section">
            <div className="container">
                <div className="hero-grid">
                    {/* Main Banner (Left - 66%) */}
                    <div className="hero-main-banner">
                        <div className="overlay"></div>
                        <img
                            src="https://images.unsplash.com/photo-1595341888016-a392ef81b7de?auto=format&fit=crop&q=80&w=1200"
                            alt="Main Offer"
                            className="banner-img"
                        />
                        <div className="banner-content">
                            <h2 className="animate-slide-in-left">Wedding Collection 2024</h2>
                            <p className="animate-fade-in-up">Handcrafted Elegance for Your Special Day</p>
                            <Link to="/shop" className="btn btn-primary animate-scale-in">Shop Now</Link>
                        </div>
                    </div>

                    {/* Side Banners (Right - 33%) */}
                    <div className="hero-side-banners">
                        {/* Top Side Banner */}
                        {/* Trust Badges Section (Replaces Top Side Banner) */}
                        <div className="side-banner trust-banner-wrapper">
                            <TrustBadges />
                        </div>

                        {/* Bottom Side Banner */}
                        <div className="side-banner">
                            <img
                                src="https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=600&auto=format&fit=crop&q=80"
                                alt="Designer Lehengas"
                                className="banner-img"
                            />
                            <div className="side-content">
                                <h3>Designer Lehengas</h3>
                                <span>New Arrivals</span>
                            </div>
                            <Link to="/shop?category=Lehengas" className="cover-link"></Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroGrid;
