import SchoolClassTable from '@features/school-classes/school-class-table';
import PageContent from '@layouts/partials/page-content';
import PageHeader from '@layouts/partials/page-header';

const SchoolClasses = () => {
  return (
    <>
      <PageHeader
        title="Classes"
      />
      <PageContent>
        <SchoolClassTable />
      </PageContent>
    </>
  );
};

export default SchoolClasses;