import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import AttendanceTable from '@features/attendance/attendance-table';
import PageContent from '@layouts/partials/page-content';
import PageHeader from '@layouts/partials/page-header';

const Attendance = () => {
  return (
    <>
      <PageHeader title="Attendance">
        <Link to="/attendance/create">
          <Button type="primary" icon={<PlusOutlined />}>
            Mark Attendance
          </Button>
        </Link>
      </PageHeader>
      
      <PageContent>
        <AttendanceTable />
      </PageContent>
    </>
  );
};

export default Attendance;

