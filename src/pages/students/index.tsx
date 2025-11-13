import { Link } from 'react-router-dom';
import { Button, Space } from 'antd';
import { PlusOutlined, SwapOutlined } from '@ant-design/icons';
import StudentTable from '@features/students/student-table';
import PageContent from '@layouts/partials/page-content';
import PageHeader from '@layouts/partials/page-header';

const Students = () => {
  return (
    <>
      <PageHeader
        title="Students"
      >
        <Space>
          <Link to="/students/promote">
            <Button type="default" icon={<SwapOutlined />}>
              Promote Students
            </Button>
          </Link>
          <Link to="/students/create">
            <Button type="primary" icon={<PlusOutlined />}>
              New Student
            </Button>
          </Link>
        </Space>
      </PageHeader>
      <PageContent>
        <StudentTable />
      </PageContent>
    </>
  );
};

export default Students;
