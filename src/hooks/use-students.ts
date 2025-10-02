import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { App } from 'antd';
import useFilter from '@hooks/utility-hooks/use-filter';
import { StudentRequestData } from '@models/student-model';
import { AppError, Option, QueryParams } from '@models/utils-model';
import {
  useStudentsQuery,
  useStudentSavedMutation,
  useStudentQuery,
  useLazySearchStudentsQuery
} from '@services/students-service';
import { formatQueryParams } from '@utils/helpers';

export const useStudents = () => {
  const location = useLocation();

  const { getQueryParams, setQueryParams, getDefaultQueryParams } = useFilter();
  const queryParams = getQueryParams();

  const [filterParams, setFilterParams] = useState<QueryParams>({});
  const [skip, setSkip] = useState<boolean>(true);

  const { isFetching, data: response } = useStudentsQuery(formatQueryParams(filterParams), { skip: skip });

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

export const useStudentForm = () => {
  const { message } = App.useApp();
  const navigate = useNavigate();

  const [studentSaved, { isLoading, isSuccess, isError, error }] = useStudentSavedMutation();

  useEffect(() => {
    if (isSuccess) {
      message.success('Student saved successfully.');
      navigate('/students');
    }

    if (isError && error) {
      message.error((error as AppError).data.message);
    }
  }, [isSuccess, isError, error]);

  const onSaved = (id?: number, student: FormData) => {
    studentSaved({
      id,
      formData: student
    });
  };

  return {
    isLoading,
    onSaved
  };
};

export const useStudent = (studentId: number) => {
  const { isLoading, data: student } = useStudentQuery(studentId);

  return {
    isLoading,
    student
  };
};

export const useSearchStudent = () => {
  const [studentOptions, setStudentOptions] = useState<Option[]>();

  const [searchStudents, { isLoading, isSuccess, data }] = useLazySearchStudentsQuery();

  const onSearchStudents = (searchParams: string) => {
    searchStudents(searchParams);
  };

  useEffect(() => {
    if (isSuccess) {
      setStudentOptions(
        data?.students?.map(student => {
          return {
            label: `(${student.id}) ${student.studentDetails?.name || 'Unknown'}`,
            value: student?.id
          };
        })
      );
    }
  }, [isSuccess]);

  return {
    onSearchStudents,
    isStudentSearchLoading: isLoading,
    searchStudentData: studentOptions
  };
};
