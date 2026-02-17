import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import '../styles/components/Navbar.css';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const { isAuthenticated, user, logout } = useAuth();
    const { itemCount } = useCart();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        setShowUserMenu(false);
    };

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="container">
                <div className="nav-content">
                    <Link to="/" className="logo">
                        <span className="logo-text">AllCloths</span>
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

                    <div className="nav-actions">
                        <Link to="/cart" className="cart-icon">
                            🛍️
                            {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
                        </Link>

                        {isAuthenticated ? (
                            <div className="user-menu">
                                <button className="user-menu-button" onClick={() => setShowUserMenu(!showUserMenu)}>
                                    👤 {user?.name}
                                </button>
                                {showUserMenu && (
                                    <div className="user-menu-dropdown">
                                        {user?.isAdmin && (
                                            <Link to="/admin" onClick={() => setShowUserMenu(false)} className="admin-link">
                                                Admin Dashboard
                                            </Link>
                                        )}
                                        <Link to="/profile" onClick={() => setShowUserMenu(false)}>My Profile</Link>
                                        <Link to="/wishlist" onClick={() => setShowUserMenu(false)}>My Wishlist</Link>
                                        <Link to="/orders" onClick={() => setShowUserMenu(false)}>My Orders</Link>
                                        <button onClick={handleLogout}>Logout</button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
