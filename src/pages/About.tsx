import Newsletter from '../components/Newsletter';
import '../styles/pages/About.css';

const About = () => {
    return (
        <div className="about-page">
            <div className="about-hero">
                <div className="container">
                    <h1>Our Story</h1>
                    <p>Celebrating Indian Heritage Through Fashion</p>
                </div>
            </div>

            <section className="about-content section">
                <div className="container">
                    <div className="about-grid">
                        <div className="about-text">
                            <h2>Welcome to <span className="gradient-text">Vatsalya</span></h2>
                            <p>
                                Vatsalya was born from a deep love and respect for Indian traditional wear. We believe that
                                every woman deserves to feel beautiful, confident, and connected to her cultural roots through
                                the clothes she wears.
                            </p>
                            <p>
                                Our journey began with a simple mission: to make authentic, high-quality traditional Indian
                                clothing accessible to women everywhere. From the rich silks of Kanjivaram to the intricate
                                embroidery of Lucknow, we curate pieces that tell a story of India's diverse textile heritage.
                            </p>
                        </div>
                        <div className="about-image">
                            <div className="about-gradient">
                                <span>Tradition Meets Elegance</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="values-section section">
                <div className="container">
                    <h2 className="section-title">Our <span className="gradient-text">Values</span></h2>

                    <div className="values-grid">
                        <div className="value-card">
                            <div className="value-icon">🎨</div>
                            <h3>Authentic Craftsmanship</h3>
                            <p>
                                We work directly with skilled artisans across India, ensuring each piece maintains the
                                authentic techniques passed down through generations.
                            </p>
                        </div>

                        <div className="value-card">
                            <div className="value-icon">✨</div>
                            <h3>Premium Quality</h3>
                            <p>
                                Only the finest fabrics and materials make it into our collection. We never compromise
                                on quality because you deserve the best.
                            </p>
                        </div>

                        <div className="value-card">
                            <div className="value-icon">🌿</div>
                            <h3>Sustainable Practices</h3>
                            <p>
                                We're committed to sustainable and ethical fashion, supporting local communities and
                                preserving traditional textile arts.
                            </p>
                        </div>

                        <div className="value-card">
                            <div className="value-icon">💝</div>
                            <h3>Customer First</h3>
                            <p>
                                Your satisfaction is our priority. We provide personalized service to help you find
                                the perfect piece for every occasion.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mission-section section">
                <div className="container">
                    <div className="mission-content">
                        <h2>Our <span className="gradient-text">Mission</span></h2>
                        <p className="mission-text">
                            To celebrate and preserve the rich heritage of Indian traditional wear while making it
                            accessible and relevant for the modern woman. We strive to be the bridge between timeless
                            tradition and contemporary style, ensuring that every woman can embrace her cultural identity
                            with pride and elegance.
                        </p>
                        <div className="mission-stats">
                            <div className="stat-item">
                                <div className="stat-number">500+</div>
                                <div className="stat-label">Happy Customers</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-number">50+</div>
                                <div className="stat-label">Artisan Partners</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-number">100%</div>
                                <div className="stat-label">Authentic Products</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Newsletter />
        </div>
    );
};

export default About;
