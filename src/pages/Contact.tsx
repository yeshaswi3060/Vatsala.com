import { useState } from 'react';
import '../styles/pages/Contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => {
            setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
            setSubmitted(false);
        }, 3000);
    };

    return (
        <div className="contact-page">
            <div className="contact-hero">
                <div className="container">
                    <h1>Get In Touch</h1>
                    <p>We'd love to hear from you</p>
                </div>
            </div>

            <section className="contact-content section">
                <div className="container">
                    <div className="contact-grid">
                        <div className="contact-info">
                            <h2>Contact <span className="gradient-text">Information</span></h2>
                            <p>Have a question or need assistance? Reach out to us and we'll get back to you as soon as possible.</p>

                            <div className="contact-details">
                                <div className="contact-item">
                                    <div className="contact-icon">📧</div>
                                    <div>
                                        <h3>Email</h3>
                                        <p>support@vatsala.com</p>
                                    </div>
                                </div>

                                <div className="contact-item">
                                    <div className="contact-icon">📱</div>
                                    <div>
                                        <h3>Phone</h3>
                                        <p>+91 98765 43210</p>
                                    </div>
                                </div>

                                <div className="contact-item">
                                    <div className="contact-icon">📍</div>
                                    <div>
                                        <h3>Address</h3>
                                        <p>123 Fashion Street<br />Mumbai, Maharashtra 400001<br />India</p>
                                    </div>
                                </div>

                                <div className="contact-item">
                                    <div className="contact-icon">🕐</div>
                                    <div>
                                        <h3>Business Hours</h3>
                                        <p>Monday - Saturday: 10:00 AM - 7:00 PM<br />Sunday: Closed</p>
                                    </div>
                                </div>
                            </div>

                            <div className="social-section">
                                <h3>Follow Us</h3>
                                <div className="social-links-contact">
                                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">Instagram</a>
                                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link">Facebook</a>
                                    <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="social-link">Pinterest</a>
                                    <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer" className="social-link">WhatsApp</a>
                                </div>
                            </div>
                        </div>

                        <div className="contact-form-section">
                            <h2>Send Us a <span className="gradient-text">Message</span></h2>

                            {submitted ? (
                                <div className="form-success">
                                    <h3>Thank you for contacting us! 🎉</h3>
                                    <p>We'll get back to you within 24 hours.</p>
                                </div>
                            ) : (
                                <form className="contact-form" onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="name">Full Name *</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter your full name"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="email">Email Address *</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            placeholder="your.email@example.com"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="phone">Phone Number</label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="+91 XXXXX XXXXX"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="subject">Subject *</label>
                                        <select
                                            id="subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select a subject</option>
                                            <option value="product">Product Inquiry</option>
                                            <option value="order">Order Status</option>
                                            <option value="custom">Custom Order</option>
                                            <option value="feedback">Feedback</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="message">Message *</label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            rows={6}
                                            placeholder="Tell us how we can help you..."
                                        ></textarea>
                                    </div>

                                    <button type="submit" className="btn btn-primary btn-large">Send Message</button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
