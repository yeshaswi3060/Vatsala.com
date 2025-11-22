import { useState, useEffect } from 'react';
import '../styles/components/Preloader.css';

const Preloader = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2500);

        return () => clearTimeout(timer);
    }, []);

    if (!loading) return null;

    return (
        <div className="preloader">
            <div className="preloader-content">
                <div className="brand-container">
                    <h1 className="brand-text">Vatsala</h1>
                    <div className="brand-line"></div>
                    <p className="brand-tagline">Timeless Elegance</p>
                </div>
            </div>
        </div>
    );
};

export default Preloader;
