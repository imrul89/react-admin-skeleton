import { useParams } from 'react-router-dom';
import { Spin } from 'antd';
import RoleForm from '@features/roles/role-form';
import { useRole } from '@hooks/use-roles';
import PageContent from '@layouts/partials/page-content';
import PageHeader from '@layouts/partials/page-header';

const RoleEdit = () => {
  const params = useParams();
  const roleId = Number(params.id);
  const { isLoading, role } = useRole(roleId);

  return (
    <>
      <PageHeader
        title="Edit Role"
        subTitle="Update the role details below"
      />
      <PageContent>
        <Spin spinning={isLoading}>
          <RoleForm initialValues={ role } isEditMode />
        </Spin>
      </PageContent>
    </>
  );
};

export default RoleEdit;
