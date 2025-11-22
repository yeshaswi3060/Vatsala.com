import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';

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

    // Sync profile with Firestore
    useEffect(() => {
        if (!userId) {
            setProfile(null);
            return;
        }

        // Real-time sync with Firestore
        const profileRef = doc(db, 'profiles', userId);

        const unsubscribe = onSnapshot(profileRef, (docSnap) => {
            if (docSnap.exists()) {
                setProfile(docSnap.data() as UserProfile);
            }
        });

        return () => unsubscribe();
    }, [userId]);

    const updateProfile = async (updates: Partial<UserProfile>) => {
        if (!userId) return;

        const newProfile = { ...profile, ...updates } as UserProfile;
        setProfile(newProfile);

        const profileRef = doc(db, 'profiles', userId);
        await setDoc(profileRef, { ...newProfile, updatedAt: new Date() }, { merge: true });
    };

    const saveShippingInfo = async (info: ShippingInfo) => {
        if (!userId) return;

        const newProfile = { ...profile, shippingInfo: info } as UserProfile;
        setProfile(newProfile);

        const profileRef = doc(db, 'profiles', userId);
        await setDoc(profileRef, { shippingInfo: info, updatedAt: new Date() }, { merge: true });
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
