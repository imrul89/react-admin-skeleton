import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearRedirectPath } from '@reducers/redirect-slice';
import { useAppSelector, useAppDispatch } from '@/store';

const RedirectListener = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const redirectPath = useAppSelector((state) => state.redirect.path);
  
  useEffect(() => {
    if (redirectPath) {
      navigate(redirectPath);
      dispatch(clearRedirectPath());
    }
  }, [redirectPath, navigate, dispatch]);
  
  return null;
};

export default RedirectListener;
