import { Link, useParams } from 'react-router-dom';
import { Button, Spin } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import SectionForm from '@features/sections/section-form';
import { useSection } from '@hooks/use-sections';
import PageContent from '@layouts/partials/page-content';
import PageHeader from '@layouts/partials/page-header';

const SectionEdit = () => {
  const { id } = useParams<{ id: string }>();
  const sectionId = parseInt(id || '0', 10);
  const { isLoading, section } = useSection(sectionId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Edit Section"
        subTitle="Update section information"
      >
        <Link to="/sections">
          <Button icon={<ArrowLeftOutlined />}>
            Back to Sections
          </Button>
        </Link>
      </PageHeader>
      <PageContent>
        <SectionForm initialValues={section} isEditMode />
      </PageContent>
    </>
  );
};

export default SectionEdit;
