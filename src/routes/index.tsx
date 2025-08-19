import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import RedirectListener from '@components/shared/redirect-listener';
import ScrollToTop from '@components/shared/scroll-to-top';
import useAuthentication from '@hooks/auth/use-authentication';
import DefaultLayout from '@layouts/default-layout';
import LoginLayout from '@layouts/login-layout';
import Login from '@pages/auth/login';
import NotFound from '@pages/not-found';
import PrivateRoute from './private-route';
import PublicRoute from './public-route';
import routes from './routes';

const AppRoutes = () => {
  const { isAuthenticated } = useAuthentication();
  
  return(
    <Router>
      <RedirectListener />
      <ScrollToTop />
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute isAuthenticated={isAuthenticated()}>
              <LoginLayout />
            </PublicRoute>
          }
        >
          <Route index element={<Login />} />
        </Route>
        <Route
          path="/"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated()}>
              <DefaultLayout />
            </PrivateRoute>
          }
        >
          {routes().map(({ component: Component, path , children}) => (
            <Route
              path={`/${path}`}
              element={children.length > 0 ? <Outlet /> : <Component />}
              key={path}
            >
              {children && children.map(({ component: ChildComponent, path: childPath }) => (
                <Route
                  path={`/${path}/${childPath}`}
                  element={<ChildComponent />}
                  key={childPath}
                />
              ))}
            </Route>
          ))}
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>

  );
};

export default AppRoutes;
