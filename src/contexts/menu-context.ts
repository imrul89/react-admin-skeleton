import { createContext } from 'react';

const MenuContext = createContext<{
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  lastOpenKeys: string[];
  setLastOpenKeys: (keys: string[]) => void;
}>(null!);

export default MenuContext;