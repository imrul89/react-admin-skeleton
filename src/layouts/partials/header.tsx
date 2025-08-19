import { Layout, Typography } from 'antd';
import ProfileMenu from '@layouts/partials/profile-menu';

const { Header: AntdHeader} = Layout;

const Header = () => {
  return (
    <AntdHeader className="fixed w-full z-999 flex items-center justify-between px-4">
      <Typography.Title level={2} style={{ color: 'white', marginTop: 5 }}>
        React Admin App
      </Typography.Title>
      <ProfileMenu />
    </AntdHeader>
  );
};

export default Header;
