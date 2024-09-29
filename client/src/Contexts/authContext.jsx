import React, { useState, useContext, createContext, useEffect } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider(props) {
    const [isLoggedIn, setIsLoggedIn] = useState(!!Cookies.get('isLoggedIn'));
    const [token, setToken] = useState(null); // Add this line

    useEffect(() => {
        if (isLoggedIn && token) {
            Cookies.set('isLoggedIn', 'true', { expires: 7 });
            localStorage.setItem('token', token);
        } else {
            Cookies.remove('isLoggedIn');
            localStorage.removeItem('token');
        }
    }, [isLoggedIn, token]);

    const value = {
        isLoggedIn,
        setIsLoggedIn,
        setToken,
        token
    };

    return (
        <AuthContext.Provider value={value}>
            {props.children}
        </AuthContext.Provider>
    );
}
