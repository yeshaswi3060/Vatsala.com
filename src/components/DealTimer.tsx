import { useState, useEffect } from 'react';
import '../styles/components/DealTimer.css';

const DealTimer = () => {
    const [timeLeft, setTimeLeft] = useState({
        hours: 12,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds > 0) {
                    return { ...prev, seconds: prev.seconds - 1 };
                } else if (prev.minutes > 0) {
                    return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                } else if (prev.hours > 0) {
                    return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
                }
                return prev; // Expired (reset or stay 0)
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="deal-timer-container">
            <div className="deal-content">
                <div className="deal-text">
                    <h3>Deal of the Day</h3>
                    <p>Flat 40% Off on Silk Sarees</p>
                </div>
                <div className="timer-wrapper">
                    <div className="time-unit">
                        <span className="number">{String(timeLeft.hours).padStart(2, '0')}</span>
                        <span className="label">Hrs</span>
                    </div>
                    <span className="colon">:</span>
                    <div className="time-unit">
                        <span className="number">{String(timeLeft.minutes).padStart(2, '0')}</span>
                        <span className="label">Mins</span>
                    </div>
                    <span className="colon">:</span>
                    <div className="time-unit">
                        <span className="number">{String(timeLeft.seconds).padStart(2, '0')}</span>
                        <span className="label">Secs</span>
                    </div>
                </div>
                <button className="btn btn-sm btn-gold">Shop Now</button>
            </div>
        </div>
    );
};

export default DealTimer;
