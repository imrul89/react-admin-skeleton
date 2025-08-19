import { useParams } from 'react-router-dom';
import { Spin } from 'antd';
import PageContent from '@layouts/partials/page-content';
import PageHeader from '@layouts/partials/page-header';
import UserForm from '@/features/users/user-form';
import { useUser } from '@/hooks/use-users';

const UserEdit = () => {
  const params = useParams();
  const userId = Number(params.id);
  const { isLoading, user } = useUser(userId);
  
  return (
    <>
      <PageHeader
        title="Edit User"
        subTitle="Update the user details below"
      />
      <PageContent>
        <Spin spinning={isLoading}>
          <UserForm initialValues={user} isEditMode />
        </Spin>
      </PageContent>
    </>
  );
};

export default UserEdit;
