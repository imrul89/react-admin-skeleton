import { useParams } from 'react-router-dom';
import { Spin } from 'antd';
import PermissionForm from '@features/permissions/permission-form';
import { usePermission } from '@hooks/use-permissions';
import PageContent from '@layouts/partials/page-content';
import PageHeader from '@layouts/partials/page-header';

const PermissionEdit = () => {
  const params = useParams();
  const permissionId = Number(params.id);
  const { isLoading, permission } = usePermission(permissionId);

  return (
    <>
      <PageHeader
        title="Edit Permission"
        subTitle="Update the permission details below"
      />
      <PageContent>
        <Spin spinning={isLoading}>
          <PermissionForm initialValues={ permission } isEditMode />
        </Spin>
      </PageContent>
    </>
  );
};

export default PermissionEdit;
