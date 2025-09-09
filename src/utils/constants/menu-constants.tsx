import {
  DashboardOutlined,
  UserOutlined
} from '@ant-design/icons';
import { MenuLink } from '@layouts/partials/menu-link';

export const MAIN_MENU_ITEMS = [
  {
    key: '/',
    label: <MenuLink to={'/'}>Dashboard</MenuLink>,
    icon: <DashboardOutlined />
  },
  {
    key: '/users',
    label: <MenuLink to={'/users'}>Users</MenuLink>,
    icon: <UserOutlined />
  },
];
