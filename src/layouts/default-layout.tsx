import React, { useContext, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Button, Flex, Image, Input, Layout, Typography } from 'antd';

import { MenuFoldOutlined, MenuUnfoldOutlined, SearchOutlined } from '@ant-design/icons';
import PageLoader from '@components/shared/page-loader';
import MenuContext from '@contexts/menu-context';
import SettingsContext from '@contexts/settings-context';
import ProfileMenu from '@layouts/partials/profile-menu';
import Sidebar from '@layouts/partials/sidebar';
import { UserDetails } from '@models/user-model';
import { setUser } from '@reducers/user-slice';
import { useAuthUserQuery } from '@services/auth/auth-service';
import { useAppDispatch } from '@/store';

const { Sider, Header: AuthHeader, Content } = Layout;

const siderStyle: React.CSSProperties = {
  overflow: 'auto',
  height: '100vh',
  position: 'sticky',
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  scrollbarWidth: 'thin',
  scrollbarGutter: 'stable',
  background: '#002141'
};

const DefaultLayout = () => {
  const dispatch = useAppDispatch();
  const { settings } = useContext(SettingsContext);
  const { isFetching, data, isSuccess } = useAuthUserQuery();
  
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [lastOpenKeys, setLastOpenKeys] = useState<string[]>([]);
  
  useEffect(() => {
    if (isSuccess && data) {
      const newUserData = Object.assign({}, data) as UserDetails;
      dispatch(setUser(newUserData));
    }
  }, [isFetching, data, isSuccess]);

  if (isFetching && !isSuccess) {
    return <PageLoader />;
  }

  return (
    <MenuContext.Provider value={{ collapsed, setCollapsed, lastOpenKeys, setLastOpenKeys }}>
      <Layout>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          style={siderStyle}
          width={280}
        >
          <Flex justify="center" align="center" className="!m-4" vertical>
            <Image
              src={`${__IMAGE_BASE_URL__}/uploads/settings/${settings.logo}`}
              width={collapsed ? 50 : 70}
              preview={false}
            />
            {!collapsed && (
              <Typography.Title level={5} className="!text-gray-300 !ml-2 !mt-4 !mb-0">
                {settings.name}
              </Typography.Title>
            )}
          </Flex>
          <Sidebar />
        </Sider>
        <Layout>
          <AuthHeader
            style={{
              position: 'sticky',
              top: 0,
              zIndex: 9999,
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#f5f5f5'
            }}
            className="!px-6 !py-10"
          >
            <Flex justify="space-between" align="center" className="w-full">
              <Flex gap={10} align="center">
                <Button
                  type="text"
                  icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                  onClick={() => setCollapsed(!collapsed)}
                />
                
                <div className="w-[300px]">
                  <Input
                    size="large"
                    className="!rounded-full"
                    placeholder="Search student here.."
                    prefix={<SearchOutlined />}
                  />
                </div>
              </Flex>
              
              <ProfileMenu />
            </Flex>
          </AuthHeader>
          <Content className="m-6 mt-0">
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </MenuContext.Provider>
  );
};

export default DefaultLayout;
