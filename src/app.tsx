import { useEffect } from 'react';
import AppRoutes from './routes';

const App = () => {
  useEffect(() => {
    document.title = __APP_TITLE__;
    
    const favicon = document.getElementById('favicon') as HTMLLinkElement;
    
    if (favicon) {
      favicon.href = `/src/assets/favicons/${__APP_CODE__}.svg`;
    }
  }, []);
  
  return (<AppRoutes />);
};

export default App;
