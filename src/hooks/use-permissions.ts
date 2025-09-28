import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { App, TreeDataNode } from 'antd';
import useFilter from '@hooks/utility-hooks/use-filter';
import { Permission } from '@models/permission-model';
import { AppError, QueryParams } from '@models/utils-model';
import {
  usePermissionsQuery,
  usePermissionSavedMutation,
  usePermissionQuery
} from '@services/permissions-service';
import { formatQueryParams } from '@utils/helpers';

export const usePermissions = () => {
  const location = useLocation();

  const { getQueryParams, setQueryParams, getDefaultQueryParams } = useFilter();
  const queryParams = getQueryParams();

  const [filterParams, setFilterParams] = useState<QueryParams>({});
  const [skip, setSkip] = useState<boolean>(true);

  const { isFetching, data: response } = usePermissionsQuery(formatQueryParams(filterParams), { skip: skip });

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

export const usePermissionForm = () => {
  const { message } = App.useApp();
  const navigate = useNavigate();

  const [permissionSaved, { isLoading, isSuccess, isError, error }] = usePermissionSavedMutation();

  useEffect(() => {
    if (isSuccess) {
      message.success('Permission saved successfully.');
      navigate('/permissions');
    }

    if (isError && error) {
      message.error((error as AppError).data.message);
    }
  }, [isSuccess, isError, error]);

  const onSaved = (permission: Permission) => {
    permissionSaved(permission);
  };

  return {
    isLoading,
    onSaved
  };
};

export const usePermission = (permissionId: number) => {
  const { isLoading, data: permission } = usePermissionQuery(permissionId);

  return {
    isLoading,
    permission
  };
};

export const useAllPermissions = () => {
  const [permissions, setPermissions] = useState<TreeDataNode[]>([]);
  
  const { isLoading, data } = usePermissionsQuery('limit=1000');
  
  useEffect(() => {
    if (data && data.permissions) {
      const groupedPermissions = _.groupBy(data.permissions, (permission) => {
        const [entity] = permission.name.split('.');
        return entity;
      });
      
      const treeData: TreeDataNode[] = Object.entries(groupedPermissions).map(([entity, permissions]) => ({
        title: _.upperFirst(entity),
        key: entity,
        children: permissions.map((permission) => {
          const [, action] = permission.name.split('.');
          return {
            title: _.upperFirst(action),
            key: permission.id.toString(),
            isLeaf: true
          };
        })
      }));
      
      setPermissions(treeData);
    }
  }, [data]);
  
  return {
    isPermissionLoading: isLoading,
    permissions
  };
};