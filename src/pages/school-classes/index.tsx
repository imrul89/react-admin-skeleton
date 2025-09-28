import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import SchoolClassTable from '@features/school-classes/school-class-table';
import PageContent from '@layouts/partials/page-content';
import PageHeader from '@layouts/partials/page-header';

const SchoolClasses = () => {
  return (
    <>
      <PageHeader
        title="Classes"
        subTitle="Manage Classes"
      >
        <Link to={'/classes/create'}>
          <Button type={'primary'} icon={<PlusCircleOutlined />}>
            Create Class
          </Button>
        </Link>
      </PageHeader>
      <PageContent>
        <SchoolClassTable />
      </PageContent>
    </>
  );
};

export default SchoolClasses;