import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface ShippingInfo {
    fullName: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
}

interface UserProfile {
    name: string;
    email: string;
    phone: string;
    shippingInfo: ShippingInfo | null;
}

interface ProfileContextType {
    profile: UserProfile | null;
    updateProfile: (updates: Partial<UserProfile>) => void;
    saveShippingInfo: (info: ShippingInfo) => void;
    getShippingInfo: () => ShippingInfo | null;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfile = () => {
    const context = useContext(ProfileContext);
    if (!context) {
        throw new Error('useProfile must be used within ProfileProvider');
    }
    return context;
};

interface ProfileProviderProps {
    children: ReactNode;
    userId: string | null;
}

export const ProfileProvider = ({ children, userId }: ProfileProviderProps) => {
    const [profile, setProfile] = useState<UserProfile | null>(null);

    // Load profile from localStorage when userId changes
    useEffect(() => {
        if (userId) {
            const savedProfile = localStorage.getItem(`vatsala_profile_${userId}`);
            if (savedProfile) {
                setProfile(JSON.parse(savedProfile));
            }
        } else {
            setProfile(null);
        }
    }, [userId]);

    // Save profile to localStorage whenever it changes
    useEffect(() => {
        if (profile && userId) {
            localStorage.setItem(`vatsala_profile_${userId}`, JSON.stringify(profile));
        }
    }, [profile, userId]);

    const updateProfile = (updates: Partial<UserProfile>) => {
        setProfile(prev => {
            if (!prev) return null;
            return { ...prev, ...updates };
        });
    };

    const saveShippingInfo = (info: ShippingInfo) => {
        setProfile(prev => {
            if (!prev) return null;
            return { ...prev, shippingInfo: info };
        });
    };

    const getShippingInfo = () => {
        return profile?.shippingInfo || null;
    };

    const value = {
        profile,
        updateProfile,
        saveShippingInfo,
        getShippingInfo
    };

    return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};
