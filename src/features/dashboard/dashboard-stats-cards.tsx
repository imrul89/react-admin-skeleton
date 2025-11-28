import { Card, Row, Col, Statistic } from 'antd';
import { UserOutlined, AppstoreOutlined, CheckCircleOutlined, TeamOutlined, UserAddOutlined } from '@ant-design/icons';
import { DashboardStats } from '@models/dashboard-model';

interface DashboardStatsCardsProps {
  stats: DashboardStats;
}

const DashboardStatsCards = ({ stats }: DashboardStatsCardsProps) => {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="Total Students"
            value={stats.overview.total_students}
            prefix={<UserOutlined />}
            valueStyle={{ color: '#1890ff' }}
          />
          <div style={{ marginTop: 8, fontSize: 12, color: '#8c8c8c' }}>
            Active: {stats.overview.active_students} | Inactive: {stats.overview.inactive_students}
          </div>
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="Attendance Rate"
            value={stats.attendance.attendance_rate}
            prefix={<CheckCircleOutlined />}
            suffix="%"
            valueStyle={{ color: '#722ed1' }}
          />
          <div style={{ marginTop: 8, fontSize: 12, color: '#8c8c8c' }}>
            {stats.attendance.present_records} / {stats.attendance.total_records}
          </div>
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="New Students"
            value={stats.overview.new_students}
            prefix={<UserAddOutlined />}
            valueStyle={{ color: '#52c41a' }}
          />
          <div style={{ marginTop: 8, fontSize: 12, color: '#8c8c8c' }}>
            Old Students: {stats.overview.old_students}
          </div>
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="Classes & Sections"
            value={stats.overview.total_classes}
            prefix={<AppstoreOutlined />}
            valueStyle={{ color: '#fa8c16' }}
          />
          <div style={{ marginTop: 8, fontSize: 12, color: '#8c8c8c' }}>
            Sections: {stats.overview.total_sections}
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default DashboardStatsCards;

