import { useContext } from 'react';
import TypographyWrapper from '@components/shared/typography-wrapper';
import SettingsContext from '@contexts/settings-context.tsx';
import LoginForm from '@features/auth/login-form';

const Login = () => {
  const { settings } = useContext(SettingsContext);
  
  return (
    <>
      <div className="text-center mb-8">
        <TypographyWrapper type={'text'} textType={'secondary'} className={'text-center'}>
          Welcome back to <b>{settings.name}</b>
          <br />
          Please enter your details below to sign in.
        </TypographyWrapper>
      </div>
      
      <LoginForm/>
    </>
  );
};

export default Login;