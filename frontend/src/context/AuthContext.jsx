import { createContext, useState, useEffect, useContext } from 'react';
import API from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkToken = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await API.get('/users/profile');
                    setUser(res.data.data.user);
                } catch (err) {
                    localStorage.removeItem('token');
                    setUser(null);
                }
            }
            setLoading(false);
        };
        checkToken();
    }, []);

    const login = async (email, password) => {
        const res = await API.post('/users/login', { email, password });
        const { token, data } = res.data;
        localStorage.setItem('token', token);
        setUser(data.user);
        return res.data;
    };

    const register = async (name, email, password) => {
        const res = await API.post('/users/register', { name, email, password });
        const { token, data } = res.data;
        localStorage.setItem('token', token);
        setUser(data.user);
        return res.data;
    };

    const googleLogin = async (idToken) => {
        const res = await API.post('/users/google-login', { idToken });
        const { token, data } = res.data;
        localStorage.setItem('token', token);
        setUser(data.user);
        return res.data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, googleLogin, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
