import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Layout } from 'antd';
import MainMenu from '@layouts/partials/main-menu';

const { Sider } = Layout;

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
    <Sider
      width={275}
      style={{
        position: 'fixed',
        zIndex: 100,
        background: 'white',
        height: '100vh',
        paddingTop: '20px'
    }}
    >
      <MainMenu
        activeMenu={activeMainMenu}
        onMenuClick={handleMainMenuClick}
      />
    </Sider>
  );
};

export default Sidebar;