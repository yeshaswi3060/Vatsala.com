import { useState, useEffect } from 'react';
import '../styles/components/Preloader.css';

const Preloader = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate loading time
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2500);

        return () => clearTimeout(timer);
    }, []);

    if (!loading) return null;

    return (
        <div className="preloader">
            <div className="preloader-content">
                <div className="preloader-logo">
                    <div className="logo-circle">
                        <div className="mandala-pattern">
                            <div className="mandala-layer layer-1"></div>
                            <div className="mandala-layer layer-2"></div>
                            <div className="mandala-layer layer-3"></div>
                        </div>
                    </div>
                    <h1 className="preloader-brand">Shringaar</h1>
                    <p className="preloader-tagline">Traditional Elegance</p>
                </div>
                <div className="preloader-spinner">
                    <div className="spinner-ring"></div>
                    <div className="spinner-ring"></div>
                    <div className="spinner-ring"></div>
                </div>
                <p className="preloader-text">Loading your experience...</p>
            </div>
        </div>
    );
};

export default Preloader;
