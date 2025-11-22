import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../styles/components/Navbar.css';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="container">
                <div className="nav-content">
                    <Link to="/" className="logo">
                        <span className="logo-text">Shringaar</span>
                        <span className="logo-subtitle">Traditional Elegance</span>
                    </Link>

                    <button
                        className="mobile-menu-toggle"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>

                    <ul className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
                        <li><Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link></li>
                        <li><Link to="/shop" onClick={() => setMobileMenuOpen(false)}>Shop</Link></li>
                        <li><Link to="/about" onClick={() => setMobileMenuOpen(false)}>About</Link></li>
                        <li><Link to="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</Link></li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
