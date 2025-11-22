import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    GoogleAuthProvider,
    signInWithPopup,
    type User as FirebaseUser
} from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { doc, setDoc } from 'firebase/firestore';

interface User {
    id: string;
    name: string;
    email: string;
    isAdmin?: boolean;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    login: (email: string, password: string) => Promise<User | null>;
    loginWithGoogle: () => Promise<User | null>;
    signup: (name: string, email: string, password: string) => Promise<User | null>;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Hardcoded admin email for simplicity
    const ADMIN_EMAIL = 'admin@vatsala.com';

    // Listen to Firebase auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
            if (firebaseUser) {
                const email = firebaseUser.email || '';
                setUser({
                    id: firebaseUser.uid,
                    name: firebaseUser.displayName || 'User',
                    email: email,
                    isAdmin: email === ADMIN_EMAIL
                });
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const signup = async (name: string, email: string, password: string): Promise<User | null> => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            // Update user profile with display name
            await updateProfile(userCredential.user, {
                displayName: name
            });

            const newUser = {
                id: userCredential.user.uid,
                name: name,
                email: userCredential.user.email || '',
                isAdmin: email === ADMIN_EMAIL
            };

            // Save user to Firestore
            await setDoc(doc(db, 'users', newUser.id), {
                ...newUser,
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString()
            });

            setUser(newUser);
            return newUser;
        } catch (error: any) {
            console.error('Signup error:', error);
            return null;
        }
    };

    const login = async (email: string, password: string): Promise<User | null> => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);

            const loggedInUser = {
                id: userCredential.user.uid,
                name: userCredential.user.displayName || 'User',
                email: userCredential.user.email || '',
                isAdmin: userCredential.user.email === ADMIN_EMAIL
            };

            // Update last login
            await setDoc(doc(db, 'users', loggedInUser.id), {
                ...loggedInUser,
                lastLogin: new Date().toISOString()
            }, { merge: true });

            setUser(loggedInUser);
            return loggedInUser;
        } catch (error: any) {
            console.error('Login error:', error);
            return null;
        }
    };

    const loginWithGoogle = async (): Promise<User | null> => {
        try {
            const provider = new GoogleAuthProvider();
            const userCredential = await signInWithPopup(auth, provider);
            const email = userCredential.user.email || '';

            const loggedInUser = {
                id: userCredential.user.uid,
                name: userCredential.user.displayName || 'User',
                email: email,
                isAdmin: email === ADMIN_EMAIL
            };

            // Save/Update user in Firestore
            await setDoc(doc(db, 'users', loggedInUser.id), {
                ...loggedInUser,
                lastLogin: new Date().toISOString()
            }, { merge: true });

            setUser(loggedInUser);
            return loggedInUser;
        } catch (error: any) {
            console.error('Google login error details:', {
                code: error.code,
                message: error.message,
                fullError: error
            });
            throw error; // Throw error to be handled by component
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const value = {
        user,
        isAuthenticated: !!user,
        isAdmin: !!user?.isAdmin,
        login,
        loginWithGoogle,
        signup,
        logout,
        loading
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
