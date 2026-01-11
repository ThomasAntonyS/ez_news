import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children }) => {
    const { isLoggedIn, loading } = useAuth();
    if (loading) return null;
    return isLoggedIn ? children : <Navigate to="/" replace />;
};

export const PublicRoute = ({ children }) => {
    const { isLoggedIn, loading } = useAuth();
    if (loading) return null;
    return !isLoggedIn ? children : <Navigate to="/" replace />;
};