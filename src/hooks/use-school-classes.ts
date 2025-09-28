import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { App } from 'antd';
import useFilter from '@hooks/utility-hooks/use-filter';
import { SchoolClass } from '@models/school-class-model';
import { AppError, QueryParams } from '@models/utils-model';
import {
  useSchoolClassesQuery,
  useSchoolClassSavedMutation,
  useSchoolClassQuery,
  useSchoolClassesOptionsQuery
} from '@services/school-classes-service';
import { formatQueryParams } from '@utils/helpers';

export const useSchoolClasses = () => {
  const location = useLocation();

  const { getQueryParams, setQueryParams, getDefaultQueryParams } = useFilter();
  const queryParams = getQueryParams();

  const [filterParams, setFilterParams] = useState<QueryParams>({});
  const [skip, setSkip] = useState<boolean>(true);

  const { isFetching, data: response } = useSchoolClassesQuery(formatQueryParams(filterParams), { skip: skip });

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

export const useSchoolClassForm = () => {
  const { message } = App.useApp();
  const navigate = useNavigate();

  const [schoolClassSaved, { isLoading, isSuccess, isError, error }] = useSchoolClassSavedMutation();

  useEffect(() => {
    if (isSuccess) {
      message.success('Class saved successfully.');
      navigate('/classes');
    }

    if (isError && error) {
      message.error((error as AppError).data.errors);
    }
  }, [isSuccess, isError, error]);

  const onSaved = (schoolClass: SchoolClass) => {
    schoolClassSaved(schoolClass);
  };

  return {
    isLoading,
    onSaved
  };
};

export const useSchoolClass = (schoolClassId: number) => {
  const { isLoading, data: schoolClass } = useSchoolClassQuery(schoolClassId);

  return {
    isLoading,
    schoolClass
  };
};

export const useClassOptions = () => {
  const { isLoading, data } = useSchoolClassesOptionsQuery();
  
  return {
    isClassOptionLoading: isLoading,
    classOptions: data
  };
};