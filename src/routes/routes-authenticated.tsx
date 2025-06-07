import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';

interface ProtectedRouteProps {
    children: React.ReactNode; // Recebe os filhos que serão protegidos
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />; // Redireciona para login se não autenticado
    }
    return <>{children}</>; // Retorna os filhos se autenticado
};

export default ProtectedRoute;
