import StudentForm from '@features/students/student-form';
import PageContent from '@layouts/partials/page-content';
import PageHeader from '@layouts/partials/page-header';
import { StudentFormData } from '@models/student-model';

const StudentCreate = () => {
  const initialValues: StudentFormData = {};
  
  return (
    <>
      <PageHeader
        title="Create Student"
        subTitle="Fill in the details to create a new student"
      />
      <PageContent>
        <StudentForm initialValues={initialValues} />
      </PageContent>
    </>
  );
};

export default StudentCreate;
