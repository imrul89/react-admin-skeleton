import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Spin } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import StudentForm from '@features/students/student-form';
import { transformedToFormData } from '@features/transformers/student-transformers';
import { useStudent } from '@hooks/use-students';
import PageContent from '@layouts/partials/page-content';
import PageHeader from '@layouts/partials/page-header';
import { StudentFormData } from '@models/student-model';

const StudentEdit = () => {
  const params = useParams();
  const studentId = Number(params.id);
  
  const [studentData, setStudentData] = useState<StudentFormData>({});
  const { isLoading, student } = useStudent(studentId);
  
  useEffect(() => {
    if (student) {
      setStudentData(
        transformedToFormData(student)
      );
    }
  }, [isLoading, student]);
  
  return (
    <>
      <PageHeader
        title="Edit Student"
        subTitle="Update the student details below"
      >
        <Link to="/students">
          <Button icon={<ArrowLeftOutlined />}>
            Back to Students
          </Button>
        </Link>
      </PageHeader>
      <PageContent>
        <Spin spinning={isLoading}>
          <StudentForm initialValues={studentData} isEditMode={true}/>
        </Spin>
      </PageContent>
    </>
  );
};

export default StudentEdit;
