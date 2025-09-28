import PermissionForm from '@features/permissions/permission-form';
import PageContent from '@layouts/partials/page-content';
import PageHeader from '@layouts/partials/page-header';
import { PermissionPartial } from '@models/permission-model';

const PermissionCreate = () => {
  const initialValues = {} as PermissionPartial;

  return (
    <>
      <PageHeader
        title="Create Permission"
        subTitle="Fill in the details to create a new permission"
      />
      <PageContent>
        <PermissionForm initialValues={initialValues} />
      </PageContent>
    </>
  );
};

export default PermissionCreate;
