import { useEffect } from 'react';
import { App } from 'antd';
import { AppError } from '@models/utils-model';
import {
  useSettingsQuery,
  useUpdateSettingsMutation
} from '@services/settings-service';

export const useSettings = () => {
  const { isLoading, data: response } = useSettingsQuery();

  return {
    isLoading,
    settings: response
  };
};

export const useSettingsForm = () => {
  const { message } = App.useApp();
  
  const [updateSettings, { isLoading, isSuccess, isError, error }] = useUpdateSettingsMutation();

  useEffect(() => {
    if (isSuccess) {
      message.success('Settings updated successfully.');
    }

    if (isError && error) {
      message.error((error as AppError).data.message || 'Failed to update settings.');
    }
  }, [isLoading, isSuccess, isError, error, message]);

  const onUpdate = (settingsData: FormData) => {
    updateSettings(settingsData);
  };

  return {
    isLoading,
    onUpdate
  };
};

