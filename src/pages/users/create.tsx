import UserForm from '@features/users/user-form';
import PageContent from '@layouts/partials/page-content';
import PageHeader from '@layouts/partials/page-header';
import { UserFormData } from '@models/user-model';

const UserCreate = () => {
  const initialValues: UserFormData = {
    name: '',
    username: '',
    email: '',
    status: 1,
    role_ids: []
  };
  
  return (
    <>
      <PageHeader
        title="Create User"
        subTitle="Fill in the details to create a new user"
      />
      <PageContent>
        <UserForm initialValues={initialValues} />
      </PageContent>
    </>
  );
};

export default UserCreate;
