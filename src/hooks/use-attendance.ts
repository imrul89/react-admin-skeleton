import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { App } from 'antd';
import useFilter from '@hooks/utility-hooks/use-filter';
import { AppError, QueryParams } from '@models/utils-model';
import { AttendanceQueryParams, ClassWiseAttendanceRequest } from '@models/attendance-model';
import {
  useAttendancesQuery,
  useStudentAttendanceQuery,
  useCreateClassWiseAttendanceMutation
} from '@services/attendance-service';
import { formatQueryParams } from '@utils/helpers';

export const useAttendances = () => {
  const location = useLocation();

  const { getQueryParams, setQueryParams, getDefaultQueryParams } = useFilter();
  const queryParams = getQueryParams();

  const [filterParams, setFilterParams] = useState<QueryParams>({});
  const [skip, setSkip] = useState<boolean>(true);

  // Convert offset to page for API call
  const transformedParams = { ...filterParams };
  if (transformedParams.offset !== undefined && transformedParams.limit) {
    const offset = Number(transformedParams.offset);
    const limit = Number(transformedParams.limit);
    transformedParams.page = Math.floor(offset / limit) + 1;
    delete transformedParams.offset;
  }

  const { isFetching, data: response } = useAttendancesQuery(formatQueryParams(transformedParams) as AttendanceQueryParams, { skip: skip });

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

export const useStudentAttendance = (studentId: number, params?: AttendanceQueryParams) => {
  const { isLoading, data: response } = useStudentAttendanceQuery({ id: studentId, params });

  return {
    isLoading,
    data: response
  };
};

export const useClassWiseAttendanceForm = () => {
  const { message } = App.useApp();
  const navigate = useNavigate();

  const [createAttendance, { isLoading, isSuccess, isError, error }] = useCreateClassWiseAttendanceMutation();

  useEffect(() => {
    if (isSuccess) {
      message.success('Attendance saved successfully.');
      navigate('/attendance');
    }

    if (isError && error) {
      message.error((error as AppError).data.message);
    }
  }, [isSuccess, isError, error]);

  const onSaved = (data: ClassWiseAttendanceRequest) => {
    createAttendance(data);
  };

  return {
    isLoading,
    onSaved
  };
};

