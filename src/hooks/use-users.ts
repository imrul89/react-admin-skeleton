import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { App } from 'antd';
import useFilter from '@hooks/utility-hooks/use-filter';
import { AppError, QueryParams } from '@models/utils-model.ts';
import { formatQueryParams } from '@utils/helpers';
import { User } from '@models/user-model.ts';
import {
  useUsersQuery,
  useUserSavedMutation,
  useUserQuery,
  useLazySearchUsersQuery,
  useUserGroupsQuery
} from '@/services/user-service';

interface Option {
  label: string,
  value: number
}

export const useUsers = () => {
  const location = useLocation();

  const { getQueryParams, setQueryParams, getDefaultQueryParams } = useFilter();
  const queryParams = getQueryParams();

  const [filterParams, setFilterParams] = useState<QueryParams>({});
  const [skip, setSkip] = useState<boolean>(true);

  const { isFetching, data: response } = useUsersQuery(formatQueryParams(filterParams), { skip: skip });

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

export const useUserForm = () => {
  const { message } = App.useApp();
  const navigate = useNavigate();

  const [userSaved, { isLoading, isSuccess, isError, error }] = useUserSavedMutation();

  useEffect(() => {
    if (isSuccess) {
      message.success('User saved successfully.');
      navigate('/users');
    }

    if (isError && error) {
      message.error((error as AppError).data.errors);
    }
  }, [isSuccess, isError, error]);

  const onSaved = (user: User) => {
    userSaved(user);
  };

  return {
    isLoading,
    onSaved
  };
};

export const useUser = (userId: number) => {
  const { isLoading, data: user } = useUserQuery(userId);

  return {
    isLoading,
    user
  };
};

export const useUserGroup = () => {
  const { isLoading, data, isSuccess } = useUserGroupsQuery();
  const [userGroupOptions, setUserGroupOptions] = useState<Option[]>([]);
  useEffect(() => {
    if (!isLoading && isSuccess) {
      setUserGroupOptions(
        data?.map(group => ({
          label: group.name,
          value: group.id
        }))
      );
    }
  }, [isSuccess]);

  return {
    isLoading,
    userGroupOptions
  };
};

export const useSearchUser = () => {
  const [userOptions, setUserOptions] = useState<Option[]>();

  const [searchUsers, { isLoading, isSuccess, data }] = useLazySearchUsersQuery();

  const onSearchUsers = (searchParams: string) => {
    searchUsers(searchParams);
  };

  useEffect(() => {
    if (isSuccess) {
      setUserOptions(
        data?.users?.map(unit => {
          return {
            label: `(${unit.id}) ${unit.name}`,
            value: unit?.id
          };
        })
      );
    }
  }, [isSuccess]);

  return {
    onSearchUsers,
    isUserSearchLoading: isLoading,
    searchUserData: userOptions
  };
};
