import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return !!localStorage.getItem('access_token');
    });

    const login = (userId, token) => {
        localStorage.setItem('user_id', userId);
        localStorage.setItem('access_token', token);
        setIsAuthenticated(true);
    };

    const logout = async () => {
        try {
            await axiosInstance.post('/auth/logout/');
            localStorage.removeItem('user_id');
            localStorage.removeItem('access_token');
            setIsAuthenticated(false);
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
