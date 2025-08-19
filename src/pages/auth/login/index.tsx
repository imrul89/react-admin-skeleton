import TypographyWrapper from '@components/shared/typography-wrapper';
import LoginForm from '@features/auth/login-form';
import cn from '@utils/cn';

const Login = () => {
  return (
    <>
      <div className={cn('text-center mb-8')}>
        <TypographyWrapper type={'text'} textType={'secondary'} className={'text-center'}>
          Welcome back to <b>React Admin App</b>
          <br />
          Please enter your details below to sign in.
        </TypographyWrapper>
      </div>
      
      <LoginForm/>
    </>
  );
};

export default Login;