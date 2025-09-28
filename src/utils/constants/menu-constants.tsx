import {
  DashboardOutlined, KeyOutlined, UsergroupAddOutlined,
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
    key: '/manage-users',
    label: 'Manage Users',
    icon: <UserOutlined />,
    children: [
      {
        key: '/users',
        label: <MenuLink to={'/users'}>Users</MenuLink>,
        icon: <UserOutlined />
      },
      {
        key: '/roles',
        label: <MenuLink to={'/roles'}>Roles</MenuLink>,
        icon: <UsergroupAddOutlined />
      },
      {
        key: '/permissions',
        label: <MenuLink to={'/permissions'}>Permissions</MenuLink>,
        icon: <KeyOutlined />
      },
    ],
  },
  {
    key: 'classes',
    label: <MenuLink to={'classes'}>Classes</MenuLink>,
    icon: <UserOutlined />
  },
  {
    key: '/students',
    label: <MenuLink to={'/students'}>Students</MenuLink>,
    icon: <UserOutlined />
  },
];
