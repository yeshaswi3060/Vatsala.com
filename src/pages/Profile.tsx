import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../contexts/ProfileContext';
import { useToast } from '../contexts/ToastContext';
import '../styles/pages/Profile.css';

const Profile = () => {
    const { user } = useAuth();
    const { profile, updateProfile, saveShippingInfo } = useProfile();
    const { showToast } = useToast();

    const [activeTab, setActiveTab] = useState<'personal' | 'shipping'>('personal');

    // Personal Info State
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    // Shipping Info State
    const [fullName, setFullName] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [pincode, setPincode] = useState('');
    const [shippingPhone, setShippingPhone] = useState('');

    // Initialize form with user data
    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
            setPhone(profile?.phone || '');
        }

        if (profile?.shippingInfo) {
            const shipping = profile.shippingInfo;
            setFullName(shipping.fullName);
            setAddress(shipping.address);
            setCity(shipping.city);
            setState(shipping.state);
            setPincode(shipping.pincode);
            setShippingPhone(shipping.phone);
        }
    }, [user, profile]);

    const handlePersonalInfoSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        updateProfile({
            name,
            email,
            phone
        });

        showToast('Personal information updated successfully!', 'success');
    };

    const handleShippingInfoSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        saveShippingInfo({
            fullName,
            address,
            city,
            state,
            pincode,
            phone: shippingPhone
        });

        showToast('Shipping information saved successfully!', 'success');
    };

    return (
        <div className="profile-page">
            <section className="profile-section section">
                <div className="container">
                    <div className="profile-header">
                        <h1>My Profile</h1>
                        <p>Manage your account settings and preferences</p>
                    </div>

                    <div className="profile-content">
                        <div className="profile-tabs">
                            <button
                                className={`tab-button ${activeTab === 'personal' ? 'active' : ''}`}
                                onClick={() => setActiveTab('personal')}
                            >
                                👤 Personal Information
                            </button>
                            <button
                                className={`tab-button ${activeTab === 'shipping' ? 'active' : ''}`}
                                onClick={() => setActiveTab('shipping')}
                            >
                                📦 Shipping Information
                            </button>
                        </div>

                        <div className="profile-form-container">
                            {activeTab === 'personal' && (
                                <form onSubmit={handlePersonalInfoSubmit} className="profile-form">
                                    <h2>Personal Information</h2>
                                    <p className="form-description">Update your personal details</p>

                                    <div className="form-group">
                                        <label htmlFor="name">Full Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                            placeholder="Enter your full name"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="email">Email Address</label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            placeholder="your.email@example.com"
                                            disabled
                                        />
                                        <small>Email cannot be changed</small>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="phone">Phone Number</label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="+91 XXXXX XXXXX"
                                        />
                                    </div>

                                    <button type="submit" className="btn btn-primary btn-large">
                                        Save Changes
                                    </button>
                                </form>
                            )}

                            {activeTab === 'shipping' && (
                                <form onSubmit={handleShippingInfoSubmit} className="profile-form">
                                    <h2>Shipping Information</h2>
                                    <p className="form-description">
                                        Save your shipping details for faster checkout
                                    </p>

                                    <div className="form-group">
                                        <label htmlFor="fullName">Full Name</label>
                                        <input
                                            type="text"
                                            id="fullName"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            required
                                            placeholder="Recipient's full name"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="address">Address</label>
                                        <textarea
                                            id="address"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            required
                                            placeholder="House no., Street, Area"
                                            rows={3}
                                        />
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="city">City</label>
                                            <input
                                                type="text"
                                                id="city"
                                                value={city}
                                                onChange={(e) => setCity(e.target.value)}
                                                required
                                                placeholder="City"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="state">State</label>
                                            <input
                                                type="text"
                                                id="state"
                                                value={state}
                                                onChange={(e) => setState(e.target.value)}
                                                required
                                                placeholder="State"
                                            />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="pincode">Pincode</label>
                                            <input
                                                type="text"
                                                id="pincode"
                                                value={pincode}
                                                onChange={(e) => setPincode(e.target.value)}
                                                required
                                                placeholder="6-digit pincode"
                                                maxLength={6}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="shippingPhone">Phone Number</label>
                                            <input
                                                type="tel"
                                                id="shippingPhone"
                                                value={shippingPhone}
                                                onChange={(e) => setShippingPhone(e.target.value)}
                                                required
                                                placeholder="+91 XXXXX XXXXX"
                                            />
                                        </div>
                                    </div>

                                    <button type="submit" className="btn btn-primary btn-large">
                                        Save Shipping Information
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Profile;
