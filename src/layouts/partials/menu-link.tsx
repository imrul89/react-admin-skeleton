import React, { ReactNode, MouseEvent } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface MenuLinkProps {
  to: string;
  children: ReactNode;
}

export const MenuLink: React.FC<MenuLinkProps> = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (isActive) {
      e.preventDefault();
    }
  };
  
  return (
    <Link to={to} onClick={handleClick}>
      {children}
    </Link>
  );
};