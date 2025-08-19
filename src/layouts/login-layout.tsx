import { useMediaQuery } from 'react-responsive';
import { Outlet } from 'react-router-dom';
import { Image, Typography } from 'antd';
import LoginBg from '@assets/login-bg.svg';

const LoginLayout = () => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {!isMobile && (
        <div className="w-1/2 flex items-center justify-center bg-blue-200">
          <Image
            src={LoginBg}
            preview={false}
            width={600}
          />
        </div>
      )}
      <div className="flex w-full md:w-1/2 items-center justify-center p-4 md:p-0">
        <div className="flex flex-col items-center login">
          <Typography.Title level={2} type="secondary">
            React Admin App
          </Typography.Title>
          
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default LoginLayout;
