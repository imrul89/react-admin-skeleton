import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { App } from 'antd';
import useFilter from '@hooks/utility-hooks/use-filter';
import { StudentSettingsUpdateRequest } from '@models/student-model';
import { AppError, Option, QueryParams } from '@models/utils-model';
import {
  useStudentsQuery,
  useStudentSavedMutation,
  useStudentQuery,
  useLazySearchStudentsQuery,
  useUpdateStudentSettingsMutation,
  useLazyClassWiseStudentsQuery
} from '@services/students-service';
import { formatQueryParams } from '@utils/helpers';

export interface StudentOption extends Option {
  roll?: number;
  name?: string;
}

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

  const onSaved = (student: FormData, id?: number) => {
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
  const { isLoading, data: student, isSuccess } = useStudentQuery(studentId);

  return {
    isLoading,
    student,
    isSuccess
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

export const useStudentSettings = () => {
  const { message } = App.useApp();

  const [updateSettings, { isLoading, isSuccess, isError, error }] = useUpdateStudentSettingsMutation();

  useEffect(() => {
    if (isSuccess) {
      message.success('Student settings updated successfully.');
    }

    if (isError && error) {
      message.error((error as AppError).data.message);
    }
  }, [isSuccess, isError, error]);

  const onUpdateSettings = (studentId: number, data: StudentSettingsUpdateRequest) => {
    updateSettings({ id: studentId, data });
  };

  return {
    isLoading,
    onUpdateSettings
  };
};


export const useClassWiseStudents = () => {
  const [studentOptions, setStudentOptions] = useState<Option[]>([]);

  const [onLoadStudents, { isLoading, data, isSuccess }] = useLazyClassWiseStudentsQuery();

  const onLoadClassWiseStudents = (classId: number) => {
    onLoadStudents({ classId });
  };
  
  useEffect(() => {
    if (data) {
      setStudentOptions(data.map(student => ({
        label: `Roll: ${student.roll} - ${student.studentDetails.name}`,
        value: student.id
      })));
    }
  }, [isLoading, data, isSuccess]);

  return {
    onLoadClassWiseStudents,
    isStudentsLoading: isLoading,
    students: studentOptions
  };
};

export const useClassStudentOptions = (classId: number | undefined) => {
  const [studentOptions, setStudentOptions] = useState<StudentOption[]>([]);

  const currentYear = new Date().getFullYear();
  const queryParams = classId ? `class_id=${classId}&year=${currentYear}&limit=500` : '';

  const { data: studentsData, isLoading } = useStudentsQuery(
    queryParams,
    { skip: !classId }
  );

  useEffect(() => {
    if (studentsData?.students) {
      const options: StudentOption[] = studentsData.students.map(student => ({
        label: `Roll: ${student.roll} - ${student.studentDetails?.name || 'N/A'} (ID: ${student.id})`,
        value: student.id,
        roll: student.roll,
        name: student.studentDetails?.name || 'N/A'
      }));
      setStudentOptions(options);
    } else {
      setStudentOptions([]);
    }
  }, [studentsData]);

  return {
    isStudentOptionLoading: isLoading,
    studentOptions
  };
};