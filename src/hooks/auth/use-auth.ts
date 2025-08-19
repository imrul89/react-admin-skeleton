import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { App } from 'antd';
import { AuthRequest } from '@models/auth-model';
import { AppError } from '@models/utils-model';
import { setCredentials } from '@reducers/auth-slice';
import { useLoginMutation } from '@services/auth/auth-service';

export const useAuth = () => {
  const { message } = App.useApp();
  
  const dispatch = useDispatch();
  const [login, { isLoading, isSuccess, data: response, isError, error }] = useLoginMutation();
  
  useEffect(() => {
    if (isSuccess && response) {
      const authData = {
        accessToken: response.access_token,
        refreshToken: response.refresh_token
      };

      localStorage.setItem('auth', JSON.stringify(authData));
      dispatch(setCredentials(authData));
    }
    
    if (isError && error) {
      message.error((error as AppError)?.data?.errors?.[0] || 'Login failed. Please try again.');
    }
  }, [dispatch, isSuccess, response, isError, error]);

  const onLogin = async (requestData: AuthRequest) => {
    const formData = {
      username: requestData.username,
      password: requestData.password
    };
    
    await login(formData);
  };
  
  return {
    onLogin,
    isLoading,
    loginError: error
  };
};