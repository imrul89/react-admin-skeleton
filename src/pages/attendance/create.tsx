import AttendanceForm from '@features/attendance/attendance-form';
import PageContent from '@layouts/partials/page-content';
import PageHeader from '@layouts/partials/page-header';

const CreateAttendance = () => {
  return (
    <>
      <PageHeader title="Mark Attendance" />
      
      <PageContent>
        <AttendanceForm />
      </PageContent>
    </>
  );
};

export default CreateAttendance;

