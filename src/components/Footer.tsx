import { Link } from 'react-router-dom';
import '../styles/components/Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    {/* Column 1: Brand */}
                    <div className="footer-section brand-section">
                        <div className="footer-logo">
                            <span className="logo-text">AllCloths</span>
                            <span className="logo-subtitle">Traditional Elegance</span>
                        </div>
                        <p>Celebrating the beauty of Indian traditional wear with premium quality and timeless designs. Handcrafted for the modern you.</p>
                        <div className="social-links">
                            <a href="#" className="social-link" aria-label="Instagram">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                            </a>
                            <a href="#" className="social-link" aria-label="Facebook">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                            </a>
                            <a href="#" className="social-link" aria-label="Twitter">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
                            </a>
                        </div>
                    </div>

                    {/* Column 2: Shop */}
                    <div className="footer-section">
                        <h3>Collections</h3>
                        <ul className="footer-links">
                            <li><Link to="/shop?category=Sarees">Silk Sarees</Link></li>
                            <li><Link to="/shop?category=Lehengas">Bridal Lehengas</Link></li>
                            <li><Link to="/shop?category=Suits">Designer Suits</Link></li>
                            <li><Link to="/shop">New Arrivals</Link></li>
                            <li><Link to="/shop?sort=best-selling">Best Sellers</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Customer Care */}
                    <div className="footer-section">
                        <h3>Customer Care</h3>
                        <ul className="footer-links">
                            <li><Link to="/contact">Contact Us</Link></li>
                            <li><a href="#">Track Order</a></li>
                            <li><a href="#">Shipping Policy</a></li>
                            <li><a href="#">Returns & Exchanges</a></li>
                            <li><a href="#">Size Guide</a></li>
                            <li><a href="#">FAQ</a></li>
                        </ul>
                    </div>

                    {/* Column 4: Newsletter */}
                    <div className="footer-section newsletter-column">
                        <h3>Stay Updated</h3>
                        <p>Subscribe to receive updates, access to exclusive deals, and more.</p>
                        <form className="footer-newsletter">
                            <input type="email" placeholder="Enter your email address" />
                            <button type="submit" className="btn btn-gold icon-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                            </button>
                        </form>
                    </div>
                </div>

                <div className="footer-bottom">
                    <div className="payment-methods">
                        <span>Secure Payments:</span>
                        <div className="card-icon">VISA</div>
                        <div className="card-icon">MC</div>
                        <div className="card-icon">UPI</div>
                    </div>
                    <p>&copy; 2024 AllCloths. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
