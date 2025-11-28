import { Card, Row, Col, Spin } from 'antd';
import PageContent from '@layouts/partials/page-content';
import PageHeader from '@layouts/partials/page-header';
import { useDashboardStatsQuery } from '@services/dashboard-service';
import DashboardStatsCards from '@features/dashboard/dashboard-stats-cards';
import ClassAttendanceRateChart from '@features/dashboard/class-attendance-rate-chart';
import ClassStudentsByShiftChart from '@features/dashboard/class-students-by-shift-chart';
import { useAppSelector } from '@/store';

const Dashboard = () => {
  const user = useAppSelector((state) => state.user);
  
  // Year comes from JWT token, no need for query params
  const { data: stats, isLoading } = useDashboardStatsQuery({});

  if (isLoading) {
    return (
      <>
        <PageHeader title="Dashboard" subTitle="Analytical insights for your school management" />
        <PageContent>
          <Spin size="large" style={{ display: 'flex', justifyContent: 'center', padding: '50px' }} />
        </PageContent>
      </>
    );
  }

  if (!stats) {
    return (
      <>
        <PageHeader title="Dashboard" subTitle="Analytical insights for your school management" />
        <PageContent>
          <Card>No data available</Card>
        </PageContent>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Dashboard"
        subTitle={`Welcome, ${user?.name || 'User'}! Year: ${user?.year || 'N/A'} - Analytical insights for your school management`}
      />
      <PageContent>
        <DashboardStatsCards stats={stats} />
        
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col xs={24} lg={12}>
            <ClassAttendanceRateChart classWiseAttendanceRate={stats.class_wise_attendance_rate} />
          </Col>
          <Col xs={24} lg={12}>
            <ClassStudentsByShiftChart classWiseStudentsByShift={stats.class_wise_students_by_shift} />
          </Col>
        </Row>
      </PageContent>
    </>
  );
};

export default Dashboard;
