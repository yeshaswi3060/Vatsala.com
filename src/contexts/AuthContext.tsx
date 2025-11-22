import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    signup: (name: string, email: string, password: string) => Promise<boolean>;
    logout: () => void;
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

    // Load user from localStorage on mount
    useEffect(() => {
        const savedUser = localStorage.getItem('vatsala_user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const signup = async (name: string, email: string, password: string): Promise<boolean> => {
        try {
            // Get existing users
            const usersData = localStorage.getItem('vatsala_users');
            const users = usersData ? JSON.parse(usersData) : [];

            // Check if user already exists
            if (users.find((u: any) => u.email === email)) {
                return false; // User already exists
            }

            // Create new user
            const newUser = {
                id: Date.now().toString(),
                name,
                email,
                password // In production, this should be hashed!
            };

            users.push(newUser);
            localStorage.setItem('vatsala_users', JSON.stringify(users));

            // Auto-login after signup
            const userWithoutPassword = { id: newUser.id, name: newUser.name, email: newUser.email };
            setUser(userWithoutPassword);
            localStorage.setItem('vatsala_user', JSON.stringify(userWithoutPassword));

            return true;
        } catch (error) {
            console.error('Signup error:', error);
            return false;
        }
    };

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            const usersData = localStorage.getItem('vatsala_users');
            const users = usersData ? JSON.parse(usersData) : [];

            const foundUser = users.find((u: any) => u.email === email && u.password === password);

            if (foundUser) {
                const userWithoutPassword = { id: foundUser.id, name: foundUser.name, email: foundUser.email };
                setUser(userWithoutPassword);
                localStorage.setItem('vatsala_user', JSON.stringify(userWithoutPassword));
                return true;
            }

            return false;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('vatsala_user');
    };

    const value = {
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
