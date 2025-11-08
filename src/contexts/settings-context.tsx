import { createContext } from 'react';
import { Setting } from '@models/setting-model';

const SettingsContext = createContext<{
  settings: Setting;
  setSettings: (settings: Setting) => void;
}>(null!);

export default SettingsContext;