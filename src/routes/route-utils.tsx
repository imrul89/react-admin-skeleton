import type { BreadcrumbComponentType } from 'use-react-router-breadcrumbs';
import { Spin } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { useUser } from '@hooks/use-users';

export const DashboardBreadcrumb: BreadcrumbComponentType = () => {
  return <HomeOutlined />;
};

export const DynamicUserBreadcrumb: BreadcrumbComponentType<'id'> = ({ match }) => {
  const { user, isLoading } = useUser(Number(match.params.id));
  return isLoading ? <Spin size="small" /> : <div>{user?.name}</div>;
};