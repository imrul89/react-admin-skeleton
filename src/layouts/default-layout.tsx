import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';

import PageLoader from '@components/shared/page-loader';
import MenuContext from '@contexts/menu-context';
import Header from '@layouts/partials/header';
import Sidebar from '@layouts/partials/sidebar';
import { setUser } from '@reducers/user-slice';
import { useAuthUserQuery } from '@services/auth/auth-service';
import { User } from '@models/user-model.ts';
import { useAppDispatch } from '@/store';

const { Content } = Layout;

const DefaultLayout = () => {
  const dispatch = useAppDispatch();
  const { isFetching, data, isSuccess } = useAuthUserQuery();
  
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [lastOpenKeys, setLastOpenKeys] = useState<string[]>([]);
  
  useEffect(() => {
    if (isSuccess && data) {
      const newUserData = Object.assign({}, data) as User;
      dispatch(setUser(newUserData));
    }
  }, [isFetching, data, isSuccess]);

  if (isFetching && !isSuccess) {
    return <PageLoader />;
  }

  return (
    <MenuContext.Provider value={{ collapsed, setCollapsed, lastOpenKeys, setLastOpenKeys }}>
      <div className="h-screen bg-gray-100">
        <Layout>
          <Header />
          <Layout className="mt-12">
            <Sidebar />
            <Layout className="ml-[276px] p-5">
              <Content className="pt-4">
                <Outlet />
              </Content>
            </Layout>
          </Layout>
        </Layout>
      </div>
    </MenuContext.Provider>
  );
};

export default DefaultLayout;
