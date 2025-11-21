import StudentBulkUpdateForm from '@features/students/student-bulk-update-form';
import PageContent from '@layouts/partials/page-content';
import PageHeader from '@layouts/partials/page-header';

const StudentBulkUpdate = () => {
  return (
    <>
      <PageHeader
        title="Bulk Student Update"
        subTitle="Update multiple students at once by selecting class and shift"
      />
      <PageContent>
        <StudentBulkUpdateForm />
      </PageContent>
    </>
  );
};

export default StudentBulkUpdate;

