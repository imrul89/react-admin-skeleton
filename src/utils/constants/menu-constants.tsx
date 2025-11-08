import {
  DashboardOutlined, KeyOutlined, UsergroupAddOutlined,
  UserOutlined, SettingOutlined
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
  {
    key: 'tuition-fee-heads',
    label: <MenuLink to={'tuition-fee-heads'}>Tuition Fee Heads</MenuLink>,
    icon: <UserOutlined />,
    children: [
      {
        key: '/tuition-fee-heads',
        label: <MenuLink to={'/tuition-fee-heads'}>Fee Heads</MenuLink>,
        icon: <UserOutlined />
      },
      {
        key: '/tuition-fee-heads/settings',
        label: <MenuLink to={'/tuition-fee-heads/settings'}>Settings</MenuLink>,
        icon: <UserOutlined />
      }
    ]
  },
  {
    key: '/settings',
    label: <MenuLink to={'/settings'}>System Settings</MenuLink>,
    icon: <SettingOutlined />
  },
];
