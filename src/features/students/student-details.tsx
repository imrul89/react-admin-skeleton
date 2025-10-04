import { useState } from 'react';
import { Card, Avatar, Tag, Row, Col, Descriptions, Tabs } from 'antd';
import StudentAttendanceTab from '@features/students/components/student-attendance-tab';
import StudentProfileTab from '@features/students/components/student-profile-tab';
import StudentSettingsTab from '@features/students/components/student-settings-tab';
import StudentTuitionFeeTab from '@features/students/components/student-tuition-fee-tab';
import { Student } from '@models/student-model';

const StudentDetails = ({
  student
}: {
  student: Student;
}) => {
  const [activeTab, setActiveTab] = useState('profile');

  const tabItems = [
    {
      key: 'profile',
      label: 'Profile',
      children: <StudentProfileTab student={student} />
    },
    {
      key: 'tuition-fee',
      label: 'Tuition Fee',
      children: <StudentTuitionFeeTab student={student} />
    },
    {
      key: 'attendance',
      label: 'Attendance',
      children: <StudentAttendanceTab student={student} />
    },
    {
      key: 'settings',
      label: 'Settings',
      children: <StudentSettingsTab student={student} />
    }
  ];

  return (
    <>
      <Card>
        <Row gutter={[24, 24]}  className="!m-0 p-2 bg-gray-50 rounded-lg">
          <Col xs={24} sm={12} md={4}>
            <div className="text-center">
              <Avatar
                size={80}
                shape="square"
                src={student.studentDetails?.photo ? `${__IMAGE_BASE_URL__}/uploads/students/${student.studentDetails.photo}` : undefined}
                className="mb-4"
              >
                {student.studentDetails?.name?.charAt(0)?.toUpperCase()}
              </Avatar>
            </div>
          </Col>
          <Col xs={24} sm={12} md={20}>
            <Descriptions column={2} size="small">
              <Descriptions.Item label="Name">
                {student.studentDetails?.name || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Class">
                <Tag color="blue">{student.class?.title}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Student No">
                {student.studentDetails?.student_no || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Roll">
                {student.roll || 'N/A'}
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
        
        <Tabs
          className="!mt-4"
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
        />
      </Card>
      
      
    </>
  );
};

export default StudentDetails;
