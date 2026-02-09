import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            if (token) {
                axiosInstance.defaults.headers.common['Authorization'] = `Token ${token}`;
                try {
                    const response = await axiosInstance.get('me/');
                    const profile = response.data;
                    // Flatten structure: merge user fields with profile fields
                    // profile.user contains { first_name, last_name, email, username }
                    // profile contains { telefono, rol, ... }
                    setUser({ ...profile.user, ...profile });
                } catch (error) {
                    console.error("Error fetching user data", error);
                    // Si falla el token (expirado, etc), hacemos logout
                    if (error.response && error.response.status === 401) {
                        logout();
                    }
                }
            } else {
                delete axiosInstance.defaults.headers.common['Authorization'];
                setUser(null);
            }
            setLoading(false);
        };

        fetchUser();
    }, [token]);

    const login = async (username, password) => {
        try {
            const response = await axiosInstance.post('login/', { username, password });
            console.log("Login Response:", response.data);
            const { token } = response.data;
            if (!token) throw new Error("No token received");

            setToken(token);
            localStorage.setItem('token', token);
            return { success: true };
        } catch (error) {
            console.error('Login failed', error);
            return { success: false, error: error.response?.data?.non_field_errors?.[0] || "Credenciales inválidas" };
        }
    };

    const register = async (userData) => {
        try {
            console.log("Sending Register Data:", userData);
            const response = await axiosInstance.post('register/', userData);
            console.log("Register Response:", response.data);

            const { token } = response.data;
            if (!token) throw new Error("No token received from register");

            setToken(token);
            localStorage.setItem('token', token);
            return { success: true };
        } catch (error) {
            console.error('Registration failed', error);
            return { success: false, error: error.response?.data };
        }
    }

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, register, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
