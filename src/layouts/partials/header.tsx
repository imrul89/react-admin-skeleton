import { Flex, Layout, Typography } from 'antd';
import ProfileMenu from '@layouts/partials/profile-menu';

const { Header: AntdHeader } = Layout;

const Header = () => {
  return (
    <AntdHeader
      className="!fixed w-full z-999 flex items-center justify-between"
      style={{ background: '#F5F5F5' }}
    >
      <Flex className="!w-full justify-between bg-amber-300">
        <Typography.Title level={2} style={{ color: 'black', marginTop: 5 }}>
          {__APP_TITLE__}
        </Typography.Title>
        <ProfileMenu />
      </Flex>
    </AntdHeader>
  );
};

export default Header;
