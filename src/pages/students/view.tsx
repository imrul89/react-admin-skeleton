import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Spin } from 'antd';
import StudentDetails from '@features/students/student-details';
import { useStudent } from '@hooks/use-students';
import PageContent from '@layouts/partials/page-content';
import PageHeader from '@layouts/partials/page-header';
import { Student } from '@models/student-model';

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
      />
      <PageContent>
        <Spin spinning={isLoading}>
          <StudentDetails student={studentDetails} />
        </Spin>
      </PageContent>
    </>
  );
};

export default StudentView;
