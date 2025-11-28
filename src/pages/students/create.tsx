import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
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
      >
        <Link to="/students">
          <Button icon={<ArrowLeftOutlined />}>
            Back to Students
          </Button>
        </Link>
      </PageHeader>
      <PageContent>
        <StudentForm initialValues={initialValues} />
      </PageContent>
    </>
  );
};

export default StudentCreate;
