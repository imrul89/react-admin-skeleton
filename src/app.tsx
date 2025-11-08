import { useEffect, useState } from 'react';
import { useSettings } from '@hooks/use-settings';
import { Setting } from '@models/setting-model';
import SettingsContext from './contexts/settings-context';
import AppRoutes from './routes';

const App = () => {
  const [settings, setSettings] = useState({} as Setting);
  
  const { isLoading, settings: settingData } = useSettings();
  
  useEffect(() => {
    if (settingData) {
      setSettings(settingData);
      
      const favicon = document.getElementById('favicon') as HTMLLinkElement;
      
      if (favicon) {
        favicon.href = `${__IMAGE_BASE_URL__}/uploads/settings/${settingData.icon}`;
      }
    }
  }, [isLoading, settingData]);
  
  useEffect(() => {
  
  }, []);
  
  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      <AppRoutes />
    </SettingsContext.Provider>
  );
};

export default App;
