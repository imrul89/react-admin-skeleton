import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import SectionTable from '@features/sections/section-table';
import PageContent from '@layouts/partials/page-content';
import PageHeader from '@layouts/partials/page-header';

const Sections = () => {
  return (
    <>
      <PageHeader
        title="Sections"
        subTitle="Manage Sections"
      >
        <Link to={'/sections/create'}>
          <Button type={'primary'} icon={<PlusCircleOutlined />}>
            Create Section
          </Button>
        </Link>
      </PageHeader>
      <PageContent>
        <SectionTable />
      </PageContent>
    </>
  );
};

export default Sections;
