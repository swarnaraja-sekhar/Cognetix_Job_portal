import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUserLoggedIn = async () => {
            try {
                const userInfo = localStorage.getItem('userInfo');
                if (userInfo) {
                    setUser(JSON.parse(userInfo));
                    // Optional: Verify token execution
                    // const { data } = await axios.get('http://localhost:5000/api/auth/me', {
                    //   headers: { Authorization: `Bearer ${JSON.parse(userInfo).token}` }
                    // });
                    // setUser({...data, token: JSON.parse(userInfo).token});
                }
            } catch (error) {
                console.error(error);
                localStorage.removeItem('userInfo');
            } finally {
                setLoading(false);
            }
        };
        checkUserLoggedIn();
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password,
            });
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Login failed' };
        }
    };

    const register = async (name, email, password, role) => {
        try {
            const { data } = await axios.post('http://localhost:5000/api/auth/register', {
                name,
                email,
                password,
                role,
            });
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Registration failed' };
        }
    };

    const logout = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
