import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { loginUser, getUserDetails } from '../services/auth';
import { axiosInstance } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) return;

        const checkAuth = async () => {
            try {
                const { email, roles, name } = await getUserDetails();
                setUser({
                    email,
                    name: name || 'Unknown',
                    roles: roles ? roles.split(', ') : [],
                });
                setIsLoggedIn(true);
            } catch (error) {
                console.error('Error checking auth:', error);
                setIsLoggedIn(false);
                setUser(null);
            }
        };
        checkAuth();
    }, [isLoggedIn]);

    const login = async (email, password) => {
        try {
            console.log('Logging in with:', { email });
            const { email: responseEmail, roles, name } = await loginUser({ email, password });
            console.log('loginUser response:', { responseEmail, roles, name });
            setUser({
                email: responseEmail,
                name: name || 'Unknown',
                roles: roles ? roles.split(', ') : [],
            });
            setIsLoggedIn(true);
            if (roles.includes('ROLE_ADMIN')) {
                navigate('/admin');
            } else {
                navigate('/user');
            }
        } catch (error) {
            console.error('Login error:', error.response?.status, error.response?.data);
            throw error;
        }
    };

    const logout = async () => {
        try {
            const response = await axiosInstance.post('/logout', null);
            console.log("Logout response", response.data)
            setUser(null);
            setIsLoggedIn(false);
            toast.success('Logout successful!');
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
            setUser(null);
            setIsLoggedIn(false);
            toast.error('Logout failed. Please try again.');
        }
    };

    const contextValue = {
        user,
        isLoggedIn,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};