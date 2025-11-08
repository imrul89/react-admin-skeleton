import { useState } from 'react';
import { Tabs } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import SettingsDetails from '@features/settings/settings-details';
import PageContent from '@layouts/partials/page-content';
import PageHeader from '@layouts/partials/page-header';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('view');

  const tabItems = [
    {
      key: 'view',
      label: (
        <span>
          <EyeOutlined /> View Settings
        </span>
      ),
      children: <SettingsDetails />
    }
  ];

  return (
    <>
      <PageHeader
        title="System Settings"
        subTitle="Manage application settings and configurations"
      />
      <PageContent>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          size="large"
        />
      </PageContent>
    </>
  );
};

export default Settings;

