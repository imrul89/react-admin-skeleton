import UserForm from '@features/users/user-form';
import PageContent from '@layouts/partials/page-content';
import PageHeader from '@layouts/partials/page-header';
import { UserPartial } from '@models/user-model';

const UserCreate = () => {
  const initialValues: UserPartial = {
    name: '',
    username: '',
    email: '',
    mobile_no: '',
    user_group_id: 1,
    status: 1,
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
