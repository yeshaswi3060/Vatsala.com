import '../styles/components/Marquee.css';

const Marquee = () => {
    const announcements = [
        "Flat 50% Off on New Arrivals",
        "Free Shipping on Orders Above ₹999",
        "Extra 10% Off on Prepaid Orders",
        "New Wedding Collection is Live!",
        "30-Day Easy Returns Policy"
    ];

    return (
        <div className="marquee-container">
            <div className="marquee-content">
                {announcements.map((text, index) => (
                    <span key={index} className="marquee-item">{text}</span>
                ))}
                {/* Duplicate for seamless scroll */}
                {announcements.map((text, index) => (
                    <span key={`dup-${index}`} className="marquee-item">{text}</span>
                ))}
            </div>
        </div>
    );
};

export default Marquee;
