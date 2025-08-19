import { Flex } from 'antd';
import UserDetails from '@features/settings/user-details';
import PageContent from '@layouts/partials/page-content';
import PageHeader from '@layouts/partials/page-header';

const Profile = () => {
  return (
    <>
      <PageHeader title="Profile" />
      <PageContent>
        <Flex gap={16} vertical>
          <UserDetails />
        </Flex>
      </PageContent>
    </>
  );
};

export default Profile;
