import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';

interface User {
    id: string;
    email: string;
    name: string;
    picture?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (params: { credential?: string; code?: string; redirectUri?: string }) => Promise<boolean>;
    loginWithEmail: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    registerWithEmail: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    getToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    const loginWithBackend = async (params: { credential?: string; code?: string; redirectUri?: string }) => {
        try {
            const response = await api.post(`/auth/google`, params);
            const { token, user: userData } = response.data;
            localStorage.setItem('token', token);
            setUser(userData);
            return true;
        } catch (error) {
            console.error('Backend login failed:', error);
            localStorage.removeItem('token');
            setUser(null);
            return false;
        }
    };

    const handleLoginSuccess = async (params: { credential?: string; code?: string; redirectUri?: string }) => {
        setLoading(true);
        const success = await loginWithBackend(params);
        setLoading(false);
        return success;
    };

    const loginWithEmail = async (email: string, password: string) => {
        try {
            const response = await api.post(`/auth/login`, { email, password });
            const { token, user: userData } = response.data;
            localStorage.setItem('token', token);
            setUser(userData);
            return { success: true };
        } catch (error: any) {
            console.error('Email login failed:', error);
            return { 
                success: false, 
                error: error.response?.data?.error || 'Login failed. Please check your credentials.' 
            };
        }
    };

    const registerWithEmail = async (email: string, password: string, name: string) => {
        try {
            const response = await api.post(`/auth/register`, { email, password, name });
            const { token, user: userData } = response.data;
            localStorage.setItem('token', token);
            setUser(userData);
            return { success: true };
        } catch (error: any) {
            console.error('Email registration failed:', error);
            return { 
                success: false, 
                error: error.response?.data?.error || 'Registration failed. Please try again.' 
            };
        }
    };

    const logout = () => {
        localStorage.clear(); // Clear EVERYTHING to be safe
        setUser(null);
        // Force a hard reload to the landing page to reset all memory variables
        window.location.replace('/');
    };

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await api.get('/auth/me');
                setUser(response.data);
            } catch (error) {
                console.error('Check auth failed:', error);
                localStorage.removeItem('token');
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [API_URL]);

    const getToken = async () => {
        return localStorage.getItem('token');
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            loading, 
            login: handleLoginSuccess, 
            loginWithEmail,
            registerWithEmail,
            logout, 
            getToken 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
