import { Link } from 'react-router-dom';
import '../styles/components/HeroGrid.css';
import TrustBadges from './TrustBadges';

interface HeroGridProps {
    data?: any;
}

const HeroGrid = ({ data }: HeroGridProps) => {
    const heroContent = data?.hero || {
        imageUrl: 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?auto=format&fit=crop&q=80&w=1200',
        title: 'Wedding Collection 2024',
        subtitle: 'Handcrafted Elegance for Your Special Day'
    };

    return (
        <section className="hero-grid-section">
            <div className="container">
                <div className="hero-grid">
                    {/* Main Banner (Left - 66%) */}
                    <div className="hero-main-banner">
                        <div className="overlay"></div>
                        <img
                            src={heroContent.imageUrl}
                            alt="Main Offer"
                            className="banner-img"
                        />
                        <div className="banner-content">
                            <h2 className="animate-slide-in-left">{heroContent.title}</h2>
                            <p className="animate-fade-in-up">{heroContent.subtitle}</p>
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
                                src={data?.side_banner?.imageUrl || "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=600&auto=format&fit=crop&q=80"}
                                alt={data?.side_banner?.title || "Designer Lehengas"}
                                className="banner-img"
                            />
                            <div className="side-content">
                                <h3>{data?.side_banner?.title || "Designer Lehengas"}</h3>
                                <span>{data?.side_banner?.subtitle || "New Arrivals"}</span>
                            </div>
                            <Link to={data?.side_banner?.linkUrl || "/shop?category=Lehengas"} className="cover-link"></Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroGrid;
