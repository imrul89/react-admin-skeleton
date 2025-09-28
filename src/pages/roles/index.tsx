import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import RoleTable from '@features/roles/role-table';
import PageContent from '@layouts/partials/page-content';
import PageHeader from '@layouts/partials/page-header';

const Roles = () => {
  return (
    <>
      <PageHeader
        title="Roles"
        subTitle="Manage Roles"
      >
        <Link to={'/roles/create'}>
          <Button type={'primary'} icon={<PlusCircleOutlined />}>
            Create Role
          </Button>
        </Link>
      </PageHeader>
      <PageContent>
        <RoleTable />
      </PageContent>
    </>
  );
};

export default Roles;