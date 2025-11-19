import { useMemo } from 'react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { App } from 'antd';
import useFilter from '@hooks/utility-hooks/use-filter';
import { Section } from '@models/section-model';
import { AppError, Option, QueryParams } from '@models/utils-model';
import {
  useSectionsQuery,
  useSectionSavedMutation,
  useSectionQuery,
  useSectionsByClassQuery
} from '@services/section-service';
import { formatQueryParams } from '@utils/helpers';

export const useSections = () => {
  const location = useLocation();

  const { getQueryParams, setQueryParams, getDefaultQueryParams } = useFilter();
  const queryParams = getQueryParams();

  const [filterParams, setFilterParams] = useState<QueryParams>({});
  const [skip, setSkip] = useState<boolean>(true);

  const { isFetching, data: response } = useSectionsQuery(formatQueryParams(filterParams), { skip: skip });

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

export const useSectionForm = () => {
  const { message } = App.useApp();
  const navigate = useNavigate();

  const [sectionSaved, { isLoading, isSuccess, isError, error }] = useSectionSavedMutation();

  useEffect(() => {
    if (isSuccess) {
      message.success('Section saved successfully.');
      navigate('/sections');
    }

    if (isError && error) {
      message.error((error as AppError).data.message);
    }
  }, [isSuccess, isError, error]);

  const onSaved = (section: Section) => {
    sectionSaved(section);
  };

  return {
    isLoading,
    onSaved
  };
};

export const useSection = (sectionId: number) => {
  const { isLoading, data: section } = useSectionQuery(sectionId);

  return {
    isLoading,
    section
  };
};

export const useSectionOptions = (classId: number | undefined) => {
  const { isLoading, data: sections } = useSectionsByClassQuery(classId as number, {
    skip: !classId
  });

  const sectionOptions = useMemo<Option[]>(() => {
    if (!sections) return [];
    
    return sections.map((section) => ({
      label: section.title,
      value: section.id
    }));
  }, [sections]);
  
  return {
    isSectionOptionLoading: isLoading,
    sectionOptions
  };
};

