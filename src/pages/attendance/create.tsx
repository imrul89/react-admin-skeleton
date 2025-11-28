import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import AttendanceForm from '@features/attendance/attendance-form';
import PageContent from '@layouts/partials/page-content';
import PageHeader from '@layouts/partials/page-header';

const CreateAttendance = () => {
  return (
    <>
      <PageHeader title="Mark Attendance">
        <Link to="/attendance">
          <Button icon={<ArrowLeftOutlined />}>
            Back to Attendance
          </Button>
        </Link>
      </PageHeader>
      <PageContent>
        <AttendanceForm />
      </PageContent>
    </>
  );
};

export default CreateAttendance;

