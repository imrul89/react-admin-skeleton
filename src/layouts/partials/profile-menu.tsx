import { Link } from 'react-router-dom';
import { Avatar, Button, Dropdown, Flex, MenuProps, Typography } from 'antd';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { logOut } from '@reducers/auth-slice';
import { unsetUser } from '@reducers/user-slice';
import baseService from '@services/core/base-service';
import { useAppDispatch, useAppSelector } from '@/store';

const ProfileMenu = () => {
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  
  const handleClick = () => {
    localStorage.removeItem('auth');
    
    dispatch(logOut());
    dispatch(unsetUser());
    dispatch(baseService.util.resetApiState());
    
    return;
  };

  const items: MenuProps['items'] = [
    {
      label: (
        <Link to="/profile">Profile</Link>
      ),
      icon: <UserOutlined />,
      key: 'profile',
    },
    {
      label: (
        <Link to="#" onClick={() => handleClick()}>Logout</Link>
      ),
      icon: <LogoutOutlined />,
      key: 'Logout',
    }
  ];
  
  return (
    <Flex gap={10} align="center">
      <Button type="dashed">{user.year}</Button>
      
      <Dropdown
        menu={{items}}
        trigger={['click']}
        overlayStyle={{ minWidth: 170, zIndex: 99999 }}
      >
        <Flex
          gap={16}
          justify="center"
          align="center"
          className="!p-2 !py-1 cursor-pointer transition-all duration-300 ease-in-out hover:bg-white rounded"
        >
          <Avatar size="large" style={{ backgroundColor: '#fde3cf', color: '#f56a00' }}>
            <UserOutlined className="text-[#001529] text-[16px]" />
          </Avatar>
          <Flex vertical>
            <Typography.Text className="!text-gray-600 font-semibold !text-[14px] !mb-0">
              { user.name }
            </Typography.Text>
            <Typography.Text className="!text-gray-500 !text-[13px]">
              { user.username }
            </Typography.Text>
          </Flex>
        </Flex>
      </Dropdown>
    </Flex>
  );
};

export default ProfileMenu;
