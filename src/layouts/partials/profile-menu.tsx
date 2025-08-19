import { Link } from 'react-router-dom';
import { Avatar, Dropdown, Flex, MenuProps, Typography } from 'antd';
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
    <Dropdown
      menu={{items}}
      trigger={['click']}
      overlayStyle={{ minWidth: 170 }}
    >
      <Flex
        gap={16}
        justify="center"
        align="center"
        className="px-4 py-2 cursor-pointer transition-all duration-300 ease-in-out hover:bg-[#011f49] rounded"
      >
        <Avatar className="bg-gray-100">
          <UserOutlined className="text-[#001529] text-[16px]" />
        </Avatar>
        <Flex vertical>
          <Typography.Text className="text-gray-100">
            { user.name }
          </Typography.Text>
          <Typography.Text className="text-xs text-gray-400">
            { user.username }
          </Typography.Text>
        </Flex>
      </Flex>
    </Dropdown>
  );
};

export default ProfileMenu;
