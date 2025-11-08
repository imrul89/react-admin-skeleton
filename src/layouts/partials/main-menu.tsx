import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu } from 'antd';
import MenuContext from '@contexts/menu-context';
import { MenuItem } from '@models/utils-model';
import { MAIN_MENU_ITEMS } from '@utils/constants/menu-constants';

interface MainMenuProps {
  activeMenu: string;
  onMenuClick: (key: string) => void;
}

const findParentKey = (key: string, menuItems: MenuItem[], parentKey: string = ''): string | null => {
  for (const item of menuItems) {
    if (item.key === key) {
      return parentKey;
    }
    
    if (item.children) {
      const foundParentKey = findParentKey(key, item.children, item.key);
      if (foundParentKey) {
        return foundParentKey;
      }
    }
  }
  
  return null;
};

const findSelectedKey = (activeMenu: string) => {
  return '/' + activeMenu.split('/')[1];
};

const MainMenu: React.FC<MainMenuProps> = ({ activeMenu }) => {
  const { pathname } = useLocation();
  const { collapsed, lastOpenKeys, setLastOpenKeys } = useContext(MenuContext);
  
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  
  useEffect(() => {
    const key = findSelectedKey(pathname);
    const newOpenKeys: string[] = [];
    const parentKey = findParentKey(key, MAIN_MENU_ITEMS);
    
    if (parentKey && !newOpenKeys.includes(parentKey)) {
      newOpenKeys.push(parentKey);
    }
    
    setOpenKeys(newOpenKeys);
    setLastOpenKeys(newOpenKeys);
  }, [pathname]);
  
  useEffect(() => {
    if (lastOpenKeys.length > 0) {
      setOpenKeys(lastOpenKeys);
    }
  }, [collapsed]);
  
  const handleOpenChange = (keys: string[]) => {
    const latestOpenKey = keys.find((key) => !openKeys.includes(key));
    setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
  };
  
  const selectedKey = findSelectedKey(activeMenu || location.pathname);
  
  return (
    <Menu
      theme="dark"
      mode="inline"
      className="main-menu"
      selectedKeys={[selectedKey]}
      openKeys={openKeys}
      onOpenChange={handleOpenChange}
      items={MAIN_MENU_ITEMS}
      style={{ height: '100%', borderRight: 0 }}
    />
  );
};

export default MainMenu;
