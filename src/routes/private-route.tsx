import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface PrivateRouteProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
}

const PrivateRoute = ({ children, isAuthenticated }: PrivateRouteProps) => {
  const location = useLocation();
  const currentPath = location.pathname !== '/'
    ? `?redirect=${encodeURIComponent(location.pathname)}${encodeURIComponent(location.search)}` : '';
  const redirectUrl = `/login${currentPath}`;
  
  return isAuthenticated ? children : <Navigate to={redirectUrl} />;
};

export default PrivateRoute;
