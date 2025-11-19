import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import SectionForm from '@features/sections/section-form';
import PageContent from '@layouts/partials/page-content';
import PageHeader from '@layouts/partials/page-header';

const SectionCreate = () => {
  return (
    <>
      <PageHeader
        title="Create Section"
        subTitle="Add a new section"
      >
        <Link to="/sections">
          <Button icon={<ArrowLeftOutlined />}>
            Back to Sections
          </Button>
        </Link>
      </PageHeader>
      <PageContent>
        <SectionForm />
      </PageContent>
    </>
  );
};

export default SectionCreate;
