import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import PermissionTable from '@features/permissions/permission-table';
import PageContent from '@layouts/partials/page-content';
import PageHeader from '@layouts/partials/page-header';

const Permissions = () => {
  return (
    <>
      <PageHeader
        title="Permissions"
        subTitle="Manage Permissions"
      >
        <Link to={'/permissions/create'}>
          <Button type={'primary'} icon={<PlusCircleOutlined />}>
            Create Permission
          </Button>
        </Link>
      </PageHeader>
      <PageContent>
        <PermissionTable />
      </PageContent>
    </>
  );
};

export default Permissions;