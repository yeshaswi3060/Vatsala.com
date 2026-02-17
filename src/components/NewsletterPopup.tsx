import { useState, useEffect } from 'react';
import '../styles/components/NewsletterPopup.css';

const NewsletterPopup = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        // Show popup after 5 seconds
        const timer = setTimeout(() => {
            const hasSeenPopup = localStorage.getItem('hasSeenNewsletterPopup');
            if (!hasSeenPopup) {
                setIsVisible(true);
            }
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    const closePopup = () => {
        setIsVisible(false);
        localStorage.setItem('hasSeenNewsletterPopup', 'true');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically send the email to your backend/Shopify
        console.log('Newsletter signup:', email);
        setSubmitted(true);
        setTimeout(() => {
            closePopup();
        }, 2000);
    };

    if (!isVisible) return null;

    return (
        <div className="newsletter-popup-overlay">
            <div className="newsletter-popup">
                <button className="close-btn" onClick={closePopup}>&times;</button>

                <div className="popup-content">
                    {submitted ? (
                        <div className="success-message">
                            <div className="check-icon">✓</div>
                            <h3>Thank You!</h3>
                            <p>You've successfully subscribed.</p>
                        </div>
                    ) : (
                        <>
                            <div className="popup-header">
                                <span className="scrolling-text">GET 10% OFF • GET 10% OFF • GET 10% OFF</span>
                            </div>
                            <h2>Unlock 10% Off</h2>
                            <p>Your first order when you sign up for our newsletter.</p>

                            <form onSubmit={handleSubmit}>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <button type="submit" className="btn btn-primary">Get My Code</button>
                            </form>

                            <p className="disclaimer">No spam, just exclusive offers and updates.</p>
                        </>
                    )}
                </div>

                <div className="popup-image">
                    {/* Decorative side image (hidden on mobile) */}
                </div>
            </div>
        </div>
    );
};

export default NewsletterPopup;
