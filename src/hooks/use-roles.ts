import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { App } from 'antd';
import useFilter from '@hooks/utility-hooks/use-filter';
import { Role } from '@models/role-model';
import { AppError, QueryParams } from '@models/utils-model';
import {
  useRolesQuery,
  useRoleSavedMutation,
  useRoleQuery,
  useRoleOptionsQuery, useSavedRolePermissionsMutation
} from '@services/roles-service';
import { formatQueryParams } from '@utils/helpers';

export const useRoles = () => {
  const location = useLocation();

  const { getQueryParams, setQueryParams, getDefaultQueryParams } = useFilter();
  const queryParams = getQueryParams();

  const [filterParams, setFilterParams] = useState<QueryParams>({});
  const [skip, setSkip] = useState<boolean>(true);

  const { isFetching, data: response } = useRolesQuery(formatQueryParams(filterParams), { skip: skip });

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

export const useRoleForm = () => {
  const { message } = App.useApp();
  const navigate = useNavigate();

  const [roleSaved, { isLoading, isSuccess, isError, error }] = useRoleSavedMutation();

  useEffect(() => {
    if (isSuccess) {
      message.success('Role saved successfully.');
      navigate('/roles');
    }

    if (isError && error) {
      message.error((error as AppError).data.message);
    }
  }, [isSuccess, isError, error]);

  const onSaved = (role: Role) => {
    roleSaved(role);
  };

  return {
    isLoading,
    onSaved
  };
};

export const useRole = (roleId: number) => {
  const { isLoading, data: role } = useRoleQuery(roleId);

  return {
    isLoading,
    role
  };
};

export const useRoleOptions = () => {
  const { isLoading, data } = useRoleOptionsQuery();

  return {
    isRoleOptionLoading: isLoading,
    roleOptions: data
  };
};

export const useRolePermissions = (roleId: number) => {
  const [permissions, setPermissions] = useState<number[]>([]);
  
  const { isLoading, data: role, isSuccess } = useRoleQuery(roleId);
  
  useEffect(() => {
    if (isSuccess && role?.permissions) {
      const permissions = role.permissions.map(permission => permission.id ) || [];
      setPermissions(permissions);
    }
  }, [isSuccess, role]);
  
  return {
    isLoading,
    permissions
  };
};

export const useRolePermissionForm = () => {
  const { message } = App.useApp();
  const navigate = useNavigate();
  
  const [onSavedRolePermissions, { isLoading, isSuccess, isError, error }] = useSavedRolePermissionsMutation();
  
  useEffect(() => {
    if (isSuccess) {
      message.success('Role permissions saved successfully.');
      navigate('/roles');
    }
    
    if (isError && error) {
      message.error((error as AppError).data.message);
    }
  }, [isSuccess, isError, error]);
  
  const onSaved = (roleId: number, permissions: number[]) => {
    onSavedRolePermissions({
      roleId,
      permissionIds: permissions
    });
  };
  
  return {
    isLoading,
    onSaved
  };
};