import StudentPromotionForm from '@features/students/student-promotion-form';
import PageContent from '@layouts/partials/page-content';
import PageHeader from '@layouts/partials/page-header';

const PromoteStudents = () => {
  return (
    <>
      <PageHeader title="Promote Students" />
      
      <PageContent>
        <StudentPromotionForm />
      </PageContent>
    </>
  );
};

export default PromoteStudents;

