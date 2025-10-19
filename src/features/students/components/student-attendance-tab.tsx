import dayjs from 'dayjs';
import { useState } from 'react';
import { Card, Table, Button, Tag, Typography, Row, Col, Statistic, DatePicker, Select, Space } from 'antd';
import { CalendarOutlined, CheckCircleOutlined, CloseCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Student } from '@models/student-model';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

interface StudentAttendanceTabProps {
  student: Student;
}

interface AttendanceRecord {
  id: number;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  subject?: string;
  remarks?: string;
  markedBy?: string;
}

// Mock data - replace with actual API calls
const mockAttendanceData: AttendanceRecord[] = [
  {
    id: 1,
    date: '2024-03-15',
    status: 'present',
    subject: 'Mathematics',
    remarks: 'On time',
    markedBy: 'Teacher A'
  },
  {
    id: 2,
    date: '2024-03-14',
    status: 'late',
    subject: 'English',
    remarks: 'Late by 15 minutes',
    markedBy: 'Teacher B'
  },
  {
    id: 3,
    date: '2024-03-13',
    status: 'absent',
    subject: 'Science',
    remarks: 'Sick leave',
    markedBy: 'Teacher C'
  },
  {
    id: 4,
    date: '2024-03-12',
    status: 'present',
    subject: 'Mathematics',
    remarks: 'On time',
    markedBy: 'Teacher A'
  },
  {
    id: 5,
    date: '2024-03-11',
    status: 'excused',
    subject: 'English',
    remarks: 'Medical appointment',
    markedBy: 'Teacher B'
  }
];

const StudentAttendanceTab = ({ student }: StudentAttendanceTabProps) => {
  const [selectedMonth, setSelectedMonth] = useState(dayjs().format('YYYY-MM'));
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  const totalDays = mockAttendanceData.length;
  const presentDays = mockAttendanceData.filter(record => record.status === 'present').length;
  const absentDays = mockAttendanceData.filter(record => record.status === 'absent').length;
  const lateDays = mockAttendanceData.filter(record => record.status === 'late').length;
  const excusedDays = mockAttendanceData.filter(record => record.status === 'excused').length;
  const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => (
        <div>
          <Text strong>{dayjs(date).format('DD MMM YYYY')}</Text>
          <br />
          <Text type="secondary">{dayjs(date).format('dddd')}</Text>
        </div>
      )
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
      render: (subject: string) => (
        <Tag color="blue">{subject}</Tag>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusConfig = {
          present: { color: 'green', icon: <CheckCircleOutlined />, text: 'Present' },
          absent: { color: 'red', icon: <CloseCircleOutlined />, text: 'Absent' },
          late: { color: 'orange', icon: <MinusCircleOutlined />, text: 'Late' },
          excused: { color: 'blue', icon: <CheckCircleOutlined />, text: 'Excused' }
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      }
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      key: 'remarks',
      render: (remarks: string) => (
        <Text type="secondary">{remarks || 'N/A'}</Text>
      )
    },
    {
      title: 'Marked By',
      dataIndex: 'markedBy',
      key: 'markedBy',
      render: (markedBy: string) => (
        <Text>{markedBy}</Text>
      )
    }
  ];

  const filteredData = mockAttendanceData.filter(record => {
    const recordMonth = dayjs(record.date).format('YYYY-MM');
    const monthMatch = recordMonth === selectedMonth;
    const subjectMatch = selectedSubject === 'all' || record.subject === selectedSubject;
    return monthMatch && subjectMatch;
  });

  return (
    <div className="space-y-6">
      {/* Attendance Summary */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card className="!bg-gray-50" bordered={false}>
            <Statistic
              title="Total Days"
              value={totalDays}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Present Days"
              value={presentDays}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Absent Days"
              value={absentDays}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Attendance %"
              value={attendancePercentage}
              suffix="%"
              valueStyle={{
                color: attendancePercentage >= 80 ? '#52c41a' :
                       attendancePercentage >= 60 ? '#faad14' : '#ff4d4f'
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* Additional Stats */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card size="small">
            <Statistic
              title="Late Days"
              value={lateDays}
              prefix={<MinusCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card size="small">
            <Statistic
              title="Excused Days"
              value={excusedDays}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card size="small">
            <Statistic
              title="Working Days"
              value={totalDays - excusedDays}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card title="Attendance Records" size="small">
        <div className="mb-4">
          <Space wrap>
            <div>
              <Text strong className="mr-2">Month:</Text>
              <DatePicker
                picker="month"
                value={dayjs(selectedMonth)}
                onChange={(date) => setSelectedMonth(date?.format('YYYY-MM') || dayjs().format('YYYY-MM'))}
              />
            </div>
            <div>
              <Text strong className="mr-2">Subject:</Text>
              <Select
                value={selectedSubject}
                onChange={setSelectedSubject}
                style={{ width: 150 }}
                options={[
                  { value: 'all', label: 'All Subjects' },
                  { value: 'Mathematics', label: 'Mathematics' },
                  { value: 'English', label: 'English' },
                  { value: 'Science', label: 'Science' }
                ]}
              />
            </div>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} records`
          }}
          size="small"
        />
      </Card>

      {/* Attendance Chart Placeholder */}
      <Card title="Attendance Trend" size="small">
        <div className="text-center py-8">
          <Text type="secondary">
            Attendance chart will be displayed here
            <br />
            (Chart component can be integrated later)
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default StudentAttendanceTab;
