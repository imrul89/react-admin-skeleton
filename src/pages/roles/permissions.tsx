import { useParams } from 'react-router-dom';
import { Spin } from 'antd';
import RolePermissionForm from '@features/roles/role-permissions';
import { useRolePermissions } from '@hooks/use-roles';
import PageContent from '@layouts/partials/page-content';
import PageHeader from '@layouts/partials/page-header';

const RolePermissions = () => {
  const params = useParams();
  const roleId = Number(params.id);
  const { isLoading, permissions } = useRolePermissions(roleId);
  
  return (
    <>
      <PageHeader
        title="Role permissions"
        subTitle="Update the role permissions below"
      />
      <PageContent>
        <Spin spinning={isLoading}>
          <RolePermissionForm roleId={roleId} rolePermissions={permissions} />
        </Spin>
      </PageContent>
    </>
  );
};

export default RolePermissions;
