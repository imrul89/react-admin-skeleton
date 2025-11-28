import React from 'react';
import Icon, {
  DashboardOutlined, KeyOutlined, UsergroupAddOutlined,
  UserOutlined, SettingOutlined, CalendarOutlined, AppstoreOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { CustomIconComponentProps } from '@ant-design/icons/es/components/Icon';
import { MenuLink } from '@layouts/partials/menu-link';

const TakaSvg: React.FC = () => (
  <svg
    width="0.5em"
    height="1em"
    viewBox="0 0 80 80"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <text
      x="50%"
      y="50%"
      textAnchor="middle"
      dominantBaseline="middle"
      fontSize="120"
      fontFamily="Noto Sans, 'Noto Sans Bengali', Arial, sans-serif"
    >
      ৳
    </text>
  </svg>
);

const TakaIcon: React.FC<Partial<CustomIconComponentProps>> = (props) => (
  <Icon component={TakaSvg} {...props} />
);

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
    icon: <TakaIcon style={{fontSize: 24}} />,
    children: [
      {
        key: '/tuition-fee-heads',
        label: <MenuLink to={'/tuition-fee-heads'}>Fee Heads</MenuLink>,
        icon: <TakaIcon style={{fontSize: 24}} />
      },
      {
        key: '/tuition-fee-head-settings',
        label: <MenuLink to={'/tuition-fee-head-settings'}>Fee Settings</MenuLink>,
        icon: <SettingOutlined />
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
  },
  {
    key: '/reports',
    label: 'Reports',
    icon: <FileTextOutlined />,
    children: [
      {
        key: '/payment-reports',
        label: <MenuLink to={'/payment-reports'}>Payment Reports</MenuLink>,
        icon: <FileTextOutlined />
      }
    ]
  }
];
