import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import '../styles/components/Header.css';

const Header = () => {
    const { itemCount } = useCart();
    const { isAdmin, user } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
            setIsMobileMenuOpen(false);
        }
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
            {/* Row 1: Top Bar (Visible on Mobile too as per request) */}
            <div className="header-top">
                <div className="container">
                    <p style={{ color: 'black', fontWeight: 'bold' }}>Free Gift on ₹3000+ Orders! | Flat 10% Off: WELCOME10</p>
                </div>
            </div>

            {/* Row 2: Main Header (Logo, Icons) */}
            <div className="header-main">
                <div className="container header-main-content">
                    {/* Mobile Hamburger */}
                    <button className="mobile-menu-toggle" onClick={toggleMobileMenu} aria-label="Toggle Menu">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            {isMobileMenuOpen ? (
                                <path d="M18 6L6 18M6 6l12 12"></path>
                            ) : (
                                <path d="M3 12h18M3 6h18M3 18h18"></path>
                            )}
                        </svg>
                    </button>

                    <Link to="/" className="header-logo">
                        <span className="logo-main">AllCloths</span>
                        {/* <span className="logo-sub">Traditional Elegance</span> */}
                    </Link>

                    {/* Desktop Search (Hidden on Mobile) */}
                    <div className="header-search-wrapper desktop-only">
                        <form onSubmit={handleSearch} className="header-search-form">
                            <input
                                type="text"
                                placeholder="Search for products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button type="submit" aria-label="Search">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                </svg>
                            </button>
                        </form>
                    </div>

                    <div className="header-actions">
                        <Link to={user ? "/profile" : "/login"} className="action-item desktop-only">
                            <div className="icon-wrapper">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                            </div>
                            <div className="action-text">
                                <span className="label">{user ? 'My Account' : 'Account'}</span>
                                <span className="sub-label">{user ? user.name?.split(' ')[0] : 'Login'}</span>
                            </div>
                        </Link>

                        <Link to="/wishlist" className="action-item desktop-only">
                            <div className="icon-wrapper">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                </svg>
                            </div>
                        </Link>

                        <Link to="/cart" className="action-item">
                            <div className="icon-wrapper">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="9" cy="21" r="1"></circle>
                                    <circle cx="20" cy="21" r="1"></circle>
                                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                                </svg>
                                {itemCount > 0 && <span className="badge">{itemCount}</span>}
                            </div>
                            <div className="action-text desktop-only">
                                <span className="label">Your Cart</span>
                                <span className="sub-label">Checkout</span>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Row 3: Mobile Search (Visible ONLY on Mobile) */}
            <div className="container mobile-search-row">
                <form onSubmit={handleSearch} className="header-search-form">
                    <input
                        type="text"
                        placeholder="Search for products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit" aria-label="Search">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </button>
                </form>
            </div>

            {/* Row 4: Nav (Desktop) */}
            <div className="header-nav desktop-only">
                <div className="container">
                    <nav className="main-nav">
                        <Link to="/">HOME</Link>
                        <Link to="/shop">SHOP</Link>
                        <Link to="/shop?category=Sarees">SAREES</Link>
                        <Link to="/shop?category=Lehengas">LEHENGAS</Link>
                        <Link to="/shop?category=Suits">SUITS</Link>
                        <Link to="/shop?category=Kurtis">KURTIS</Link>
                        <Link to="/about">ABOUT US</Link>
                        {isAdmin && <Link to="/admin" className="admin-link">DASHBOARD</Link>}
                    </nav>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
                <nav className="mobile-nav">
                    <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>HOME</Link>
                    <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)}>SHOP ALL</Link>
                    <Link to="/shop?category=Sarees" onClick={() => setIsMobileMenuOpen(false)}>SAREES</Link>
                    <Link to="/shop?category=Lehengas" onClick={() => setIsMobileMenuOpen(false)}>LEHENGAS</Link>
                    <Link to="/shop?category=Suits" onClick={() => setIsMobileMenuOpen(false)}>SUITS</Link>
                    <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)}>WISHLIST</Link>
                    {isAdmin && <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="admin-link">DASHBOARD</Link>}
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>LOGIN / REGISTER</Link>
                </nav>
            </div>
        </header>
    );
};

export default Header;
