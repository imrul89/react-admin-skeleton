import SectionAssignment from '@features/students/section-assignment';
import PageContent from '@layouts/partials/page-content';
import PageHeader from '@layouts/partials/page-header';

const AssignSections = () => {
  return (
    <>
      <PageHeader
        title="Assign Students to Sections"
        subTitle="Drag and drop students to assign them to sections or use bulk selection"
      />
      <PageContent>
        <SectionAssignment />
      </PageContent>
    </>
  );
};

export default AssignSections;

