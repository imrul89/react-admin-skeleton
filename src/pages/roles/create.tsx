import RoleForm from '@features/roles/role-form';
import PageContent from '@layouts/partials/page-content';
import PageHeader from '@layouts/partials/page-header';
import { RolePartial } from '@models/role-model';

const RoleCreate = () => {
  const initialValues = {} as RolePartial;

  return (
    <>
      <PageHeader
        title="Create Role"
        subTitle="Fill in the details to create a new role"
      />
      <PageContent>
        <RoleForm initialValues={initialValues} />
      </PageContent>
    </>
  );
};

export default RoleCreate;
