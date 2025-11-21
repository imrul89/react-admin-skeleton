import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { App } from 'antd';
import useFilter from '@hooks/utility-hooks/use-filter';
import { TuitionFeeHead, TuitionFeeHeadConfigRequestData } from '@models/tuition-fee-head-model';
import { AppError, QueryParams } from '@models/utils-model';
import {
  useTuitionFeeHeadsQuery,
  useTuitionFeeHeadSavedMutation,
  useTuitionFeeHeadQuery,
  useLazyTuitionFeeHeadConfigsQuery,
  useTuitionFeeHeadSettingsSavedMutation
} from '@services/tuition-fee-heads-service';
import { formatQueryParams } from '@utils/helpers';

export const useTuitionFeeHeads = () => {
  const location = useLocation();

  const { getQueryParams, setQueryParams, getDefaultQueryParams } = useFilter();
  const queryParams = getQueryParams();

  const [filterParams, setFilterParams] = useState<QueryParams>({});
  const [skip, setSkip] = useState<boolean>(true);

  const { isFetching, data: response } = useTuitionFeeHeadsQuery(formatQueryParams(filterParams), { skip: skip });

  useEffect(() => {
    setFilterParams(queryParams);
  }, [location.search]);

  useEffect(() => {
    const newQueryParams = {
      ...filterParams,
      ...getDefaultQueryParams(),
    };

    setQueryParams(newQueryParams);
    setFilterParams(newQueryParams);
    setSkip(false);
  }, []);

  const loading = isFetching;

  return {
    isLoading: loading,
    data: response
  };
};

export const useTuitionFeeHeadForm = () => {
  const { message } = App.useApp();
  const navigate = useNavigate();

  const [tuitionFeeHeadSaved, { isLoading, isSuccess, isError, error }] = useTuitionFeeHeadSavedMutation();

  useEffect(() => {
    if (isSuccess) {
      message.success('Tuition fee head saved successfully.');
      navigate('/tuition-fee-heads');
    }

    if (isError && error) {
      message.error((error as AppError).data.errors);
    }
  }, [isSuccess, isError, error]);

  const onSaved = (tuitionFeeHead: TuitionFeeHead) => {
    tuitionFeeHeadSaved(tuitionFeeHead);
  };

  return {
    isLoading,
    onSaved
  };
};

export const useTuitionFeeHead = (tuitionFeeHeadId: number) => {
  const { isLoading, data: tuitionFeeHead } = useTuitionFeeHeadQuery(tuitionFeeHeadId);

  return {
    isLoading,
    tuitionFeeHead
  };
};

export const useTuitionFeeHeadConfigs = () => {
  const [onLoad, { isLoading, data }] = useLazyTuitionFeeHeadConfigsQuery();

  const onLoadConfigs = (typeId: number, classId: number) => {
    onLoad({ typeId, classId });
  };
  
  return {
    onLoadConfigs,
    isLoading,
    headConfigs: data || []
  };
};

export const useTuitionFeeHeadSettingsForm = () => {
  const { message } = App.useApp();
  const navigate = useNavigate();
  
  const [tuitionFeeHeadSettingsSaved, { isLoading, isSuccess, isError, error }] = useTuitionFeeHeadSettingsSavedMutation();
  
  useEffect(() => {
    if (isSuccess) {
      message.success('Tuition fee head settings saved successfully.');
      navigate('/tuition-fee-head-settings');
    }
    
    if (isError && error) {
      message.error((error as AppError).data.errors);
    }
  }, [isSuccess, isError, error]);
  
  const onSaved = (classId: number, formData: TuitionFeeHeadConfigRequestData[]) => {
    tuitionFeeHeadSettingsSaved({
      classId,
      requestData: formData
    });
  };
  
  return {
    isLoading,
    onSaved
  };
};

