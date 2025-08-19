import { Card, Typography } from 'antd';
import PageContent from '@layouts/partials/page-content';
import PageHeader from '@layouts/partials/page-header';
import { useAppSelector } from '@/store';

const Dashboard = () => {
  const user = useAppSelector((state) => state.user);
  
  return (
    <>
      <PageHeader
        title="Dashboard"
        subTitle="Quick access to analytical insights for your business"
      />
      <PageContent>
        <Card>
          <Typography.Title level={4} className="mb-4">
            Welcome, {user?.name || 'User'}!
          </Typography.Title>
        </Card>
      </PageContent>
    </>
  );
};

export default Dashboard;
