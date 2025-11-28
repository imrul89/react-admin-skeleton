import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Spin } from 'antd';
import StudentDetails from '@features/students/student-details';
import { useStudent } from '@hooks/use-students';
import PageContent from '@layouts/partials/page-content';
import PageHeader from '@layouts/partials/page-header';
import { Student } from '@models/student-model';
import { ArrowLeftOutlined } from '@ant-design/icons';

const StudentView = () => {
  const params = useParams();
  const studentId = Number(params.id);
  
  const [studentDetails, setStudentDetails] = useState({} as Student);
  const { isLoading, student, isSuccess } = useStudent(studentId);
  
  useEffect(() => {
    if (student && isSuccess) {
      setStudentDetails(student);
    }
  }, [student, isSuccess]);
  
  return (
    <>
      <PageHeader
        title="Student Details"
      >
        <Link to="/students">
          <Button icon={<ArrowLeftOutlined />}>
            Back to Students
          </Button>
        </Link>
      </PageHeader>
      <PageContent>
        <Spin spinning={isLoading}>
          <StudentDetails student={studentDetails} />
        </Spin>
      </PageContent>
    </>
  );
};

export default StudentView;
