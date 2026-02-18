import '../styles/components/TrustBadges.css';

const TrustBadges = () => {
    const badges = [
        {
            id: 1,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="3" width="15" height="13"></rect>
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                    <circle cx="5.5" cy="18.5" r="2.5"></circle>
                    <circle cx="18.5" cy="18.5" r="2.5"></circle>
                </svg>
            ),
            title: "Free Shipping",
            desc: "On all orders above ₹2000"
        },
        {
            id: 2,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21.5 12H16c-.7 2-2 3-4 3s-3.3-1-4-3H2.5"></path>
                    <path d="M5.5 5.1L2 12v6c0 1.1.9 2 2 2h16a2 2 0 002-2v-6l-3.4-6.9A2 2 0 0016.8 4H7.2a2 2 0 00-1.8 1.1z"></path>
                </svg>
            ),
            title: "Custom Fit",
            desc: "Tailored to your measurements"
        },
        {
            id: 3,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="7"></circle>
                    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                </svg>
            ),
            title: "Authentic Silk",
            desc: "100% Certified Handloom"
        },
        {
            id: 4,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
            ),
            title: "Premium Support",
            desc: "24/7 Dedicated Assistance"
        }
    ];

    return (
        <div className="trust-badges-container">
            <div className="trust-badges-scroll">
                {/* Duplicated list for seamless infinite scroll */}
                {[...badges, ...badges].map((badge, index) => (
                    <div key={`${badge.id}-${index}`} className="trust-badge-item">
                        <div className="badge-icon">
                            {badge.icon}
                        </div>
                        <div className="badge-content">
                            <h4>{badge.title}</h4>
                            <p>{badge.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="trust-overlay-top"></div>
            <div className="trust-overlay-bottom"></div>
        </div>
    );
};

export default TrustBadges;
