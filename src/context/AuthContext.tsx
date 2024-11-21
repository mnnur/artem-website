'use client'

import { createContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/router';

interface AuthContextType{
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider = ({ children }: {children: ReactNode}) => {
    const[isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter()

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true)
        } else {
            setIsAuthenticated(false)
        }
    }, []);

    const login = (token: string) => {
        localStorage.setItem('token', token);
        setIsAuthenticated(true);
        router.push('/');
    };

    const logout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        router.push('/login');
    };

    return(
        <AuthContext.Provider value ={{ isAuthenticated, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext