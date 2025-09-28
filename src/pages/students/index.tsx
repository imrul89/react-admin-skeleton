import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import StudentTable from '@features/students/student-table';
import PageContent from '@layouts/partials/page-content';
import PageHeader from '@layouts/partials/page-header';

const Students = () => {
  return (
    <>
      <PageHeader
        title="Students"
        subTitle="Manage all students"
      >
        <Link to="/students/create">
          <Button type="primary" icon={<PlusOutlined />}>
            New Student
          </Button>
        </Link>
      </PageHeader>
      <PageContent>
        <StudentTable />
      </PageContent>
    </>
  );
};

export default Students;
