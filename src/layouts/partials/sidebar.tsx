import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import MainMenu from '@layouts/partials/main-menu';

const Sidebar = () => {
  const location = useLocation();
  
  const [activeMainMenu, setActiveMainMenu] = useState<string>(location.pathname);
  
  const handleMainMenuClick = (key: string) => {
    setActiveMainMenu(key);
  };

  useEffect(() => {
    const activePath = location.pathname === '/' ? '/' : location.pathname;
    setActiveMainMenu(activePath);
  }, [location]);
  
  return (
    <MainMenu
      activeMenu={activeMainMenu}
      onMenuClick={handleMainMenuClick}
    />
  );
};

export default Sidebar;