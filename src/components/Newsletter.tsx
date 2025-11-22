import { useState } from 'react';
import '../styles/components/Newsletter.css';

const Newsletter = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setSubmitted(true);
            setTimeout(() => {
                setEmail('');
                setSubmitted(false);
            }, 3000);
        }
    };

    return (
        <section className="newsletter">
            <div className="container">
                <h2>Stay Updated with Latest Collections</h2>
                <p>Subscribe to our newsletter for exclusive offers, new arrivals, and traditional fashion tips.</p>
                {submitted ? (
                    <p className="newsletter-success">Thank you for subscribing! 🎉</p>
                ) : (
                    <form className="newsletter-form" onSubmit={handleSubmit}>
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            className="newsletter-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <button type="submit" className="btn btn-gold">Subscribe</button>
                    </form>
                )}
            </div>
        </section>
    );
};

export default Newsletter;
