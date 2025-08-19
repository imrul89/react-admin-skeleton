import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface PublicRouteProps {
  children: ReactNode;
  isAuthenticated: boolean;
}

const PublicRoute = ({ children, isAuthenticated }: PublicRouteProps) => {
  const { search } = useLocation();
  const redirect = new URLSearchParams(search).get('redirect');
  const url = redirect ? decodeURIComponent(redirect) : '/';
  
  return !isAuthenticated ? children : <Navigate to={url} />;
};

export default PublicRoute;
