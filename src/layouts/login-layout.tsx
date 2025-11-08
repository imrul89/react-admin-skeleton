import { useContext } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Outlet } from 'react-router-dom';
import { Image } from 'antd';
import SettingsContext from '@contexts/settings-context';

const LoginLayout = () => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const { settings } = useContext(SettingsContext);
  
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {!isMobile && (
        <div
          className="w-1/2 flex items-center justify-center bg-blue-200 bg-cover bg-center"
          style={{
            backgroundImage: settings?.banner ? `url(${__IMAGE_BASE_URL__}/uploads/settings/${settings.banner})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
        </div>
      )}
      <div className="flex w-full md:w-1/2 items-center justify-center p-4 md:p-0">
        <div className="flex flex-col w-full items-center login">
          <div className="mb-6 text-center">
            {settings?.logo && (
              <Image
                src={`${__IMAGE_BASE_URL__}/uploads/settings/${settings.logo}`}
                preview={false}
                width={100}
              />
            )}
          </div>
          
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default LoginLayout;
