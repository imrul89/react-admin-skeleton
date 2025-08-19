import { setCredentials } from '@reducers/auth-slice';

import { RootState, useAppDispatch, useAppSelector } from '@/store';

const useAuthentication = () => {
  const authState = useAppSelector((state: RootState) => state.auth);
  
  const dispatch = useAppDispatch();
  const authLocalData = localStorage.getItem('auth');

  const isAuthenticated = () => {
    
    if (!authState?.accessToken && authLocalData) {
      const authData = JSON.parse(authLocalData);

      dispatch(
        setCredentials({
          accessToken: authData.accessToken,
          refreshToken: authData.refreshToken
        })
      );
    }

    return !!authState?.accessToken;
  };

  return {
    isAuthenticated
  };
};

export default useAuthentication;
