import { Link } from 'react-router-dom';
import '../styles/components/Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-section">
                        <div className="footer-logo">
                            <span className="logo-text">Shringaar</span>
                            <span className="logo-subtitle">Traditional Elegance</span>
                        </div>
                        <p>Celebrating the beauty of Indian traditional wear with premium quality and timeless designs.</p>
                        <div className="social-links">
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram">
                                <span>IG</span>
                            </a>
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Facebook">
                                <span>FB</span>
                            </a>
                            <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Pinterest">
                                <span>PT</span>
                            </a>
                            <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="WhatsApp">
                                <span>WA</span>
                            </a>
                        </div>
                    </div>

                    <div className="footer-section">
                        <h3>Shop</h3>
                        <ul className="footer-links">
                            <li><Link to="/shop?category=Sarees">Sarees</Link></li>
                            <li><Link to="/shop?category=Lehengas">Lehengas</Link></li>
                            <li><Link to="/shop?category=Suits">Suits & Salwar</Link></li>
                            <li><Link to="/shop?category=Kurtis">Kurtis</Link></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h3>Company</h3>
                        <ul className="footer-links">
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/contact">Contact</Link></li>
                            <li><a href="#careers">Careers</a></li>
                            <li><a href="#blog">Blog</a></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h3>Support</h3>
                        <ul className="footer-links">
                            <li><a href="#shipping">Shipping & Returns</a></li>
                            <li><a href="#size-guide">Size Guide</a></li>
                            <li><a href="#faq">FAQ</a></li>
                            <li><a href="#privacy">Privacy Policy</a></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; 2024 Shringaar. All rights reserved. Crafted with love for traditional Indian fashion.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
