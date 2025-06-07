// não pode estar logado para acessar

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';

interface ProtectedRouteUnauthenticatedProps {
    children: React.ReactNode; // Recebe os filhos que serão protegidos
}

const RoutesUnauthenticated : React.FC<ProtectedRouteUnauthenticatedProps> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    if (isAuthenticated) {
        return <Navigate to="/" replace />; // Redireciona para login se não autenticado
    }
    return <>{children}</>; // Retorna os filhos se autenticado
};

export default RoutesUnauthenticated ;
