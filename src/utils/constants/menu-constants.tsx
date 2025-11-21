import {
  DashboardOutlined, KeyOutlined, UsergroupAddOutlined,
  UserOutlined, SettingOutlined, CalendarOutlined, AppstoreOutlined
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
    key: '/manage-students',
    label: 'Manage Students',
    icon: <UserOutlined />,
    children: [
      {
        key: '/students',
        label: <MenuLink to={'/students'}>Students</MenuLink>,
        icon: <UserOutlined />
      },
      {
        key: '/attendance',
        label: <MenuLink to={'/attendance'}>Attendance</MenuLink>,
        icon: <CalendarOutlined />
      }
    ]
  },
  {
    key: '/manage-tuition-fee',
    label: 'Manage Tuition Fee',
    icon: <UserOutlined />,
    children: [
      {
        key: '/tuition-fee-heads',
        label: <MenuLink to={'/tuition-fee-heads'}>Fee Heads</MenuLink>,
        icon: <UserOutlined />
      },
      {
        key: '/tuition-fee-head-settings',
        label: <MenuLink to={'/tuition-fee-head-settings'}>Settings</MenuLink>,
        icon: <UserOutlined />
      }
    ]
  },
  {
    key: '/manage-settings',
    label: 'Settings',
    icon: <SettingOutlined />,
    children: [
      {
        key: '/classes',
        label: <MenuLink to={'/classes'}>Classes</MenuLink>,
        icon: <UserOutlined />
      },
      {
        key: '/sections',
        label: <MenuLink to={'/sections'}>Sections</MenuLink>,
        icon: <AppstoreOutlined />
      },
      {
        key: '/settings',
        label: <MenuLink to={'/settings'}>System Settings</MenuLink>,
        icon: <SettingOutlined />
      }
    ]
  }
];
