import '../styles/components/Testimonials.css';

const Testimonials = () => {
    const reviews = [
        {
            id: 1,
            name: "Priya Sharma",
            role: "Wedding Customer",
            content: "The silk saree I ordered for my sister's wedding was absolutely stunning. The fabric quality is authentic and the zari work is intricate.",
            image: "https://randomuser.me/api/portraits/women/44.jpg"
        },
        {
            id: 2,
            name: "Anjali Gupta",
            role: "Frequent Buyer",
            content: "I love the collection of Kurtis! They are perfect for daily wear yet look so elegant. Delivery was super fast too.",
            image: "https://randomuser.me/api/portraits/women/68.jpg"
        },
        {
            id: 3,
            name: "Meera Reddy",
            role: "Design Enthusiast",
            content: "Finally a brand that understands modern Indian aesthetics. The lehenga fit perfectly and looked exactly like the photos.",
            image: "https://randomuser.me/api/portraits/women/32.jpg"
        }
    ];

    return (
        <section className="testimonials section">
            <div className="container">
                <div className="section-header">
                    <p className="section-subtitle">Customer Love</p>
                    <h2 className="section-title">Trusted by <span className="gradient-text">Thousands</span></h2>
                </div>

                <div className="testimonials-grid">
                    {reviews.map((review) => (
                        <div key={review.id} className="testimonial-card">
                            <div className="quote-icon">"</div>
                            <p className="testimonial-content">{review.content}</p>
                            <div className="testimonial-author">
                                <img src={review.image} alt={review.name} className="author-image" />
                                <div className="author-info">
                                    <h4>{review.name}</h4>
                                    <span>{review.role}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
