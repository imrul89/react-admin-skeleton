import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { ConfigProvider, App as AntdApp } from 'antd';
import { themeConfig } from '@utils/theme-config';
import App from './app';
import { store } from './store';
import '@/styles/tailwind.css';
import '@/styles/override-antd.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ConfigProvider
        theme={themeConfig}
      >
        <AntdApp>
          <App />
        </AntdApp>
      </ConfigProvider>
    </Provider>
  </React.StrictMode>
);
