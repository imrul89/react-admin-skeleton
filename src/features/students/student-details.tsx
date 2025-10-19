import { useState } from 'react';
import { Card, Avatar, Tabs, Flex, Typography } from 'antd';
import { OrderedListOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import StudentAttendanceTab from '@features/students/components/student-attendance-tab';
import StudentProfileTab from '@features/students/components/student-profile-tab';
import StudentSettingsTab from '@features/students/components/student-settings-tab';
import StudentTuitionFeeTab from '@features/students/components/student-tuition-fee-tab';
import { Student } from '@models/student-model';
import { CURRENCY_SYMBOL } from '@utils/constants';

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
      children: <StudentProfileTab student={student} />,
      icon: <UserOutlined />,
    },
    {
      key: 'tuition-fee',
      label: 'Tuition Fee',
      children: <StudentTuitionFeeTab student={student} />,
      icon: <span className="text-lg font-light">{CURRENCY_SYMBOL}</span>
    },
    {
      key: 'attendance',
      label: 'Attendance',
      children: <StudentAttendanceTab student={student} />,
      icon: <OrderedListOutlined />
    },
    {
      key: 'settings',
      label: 'Settings',
      children: <StudentSettingsTab student={student} />,
      icon: <SettingOutlined />
    }
  ];
  
  return (
    <>
      <Card>
        <div className="p-4 bg-gray-50 rounded-lg">
          <Flex gap="large">
            <Flex vertical justify="center">
              <Avatar
                size={100}
                shape="circle"
                src={student.studentDetails?.photo ? `${__IMAGE_BASE_URL__}/uploads/students/${student.studentDetails.photo}` : undefined}
              >
                {student.studentDetails?.name?.charAt(0)?.toUpperCase()}
              </Avatar>
            </Flex>
            <Flex vertical justify="center">
              <Typography.Title level={3} className="!mb-2">{student.studentDetails?.name}</Typography.Title>
              <Typography.Text type="secondary">
                <span className="pr-2">Student Number : </span>
                <span className="text-gray-700 font-bold">{student.studentDetails?.student_no}</span>
              </Typography.Text>
              <Typography.Text type="secondary">
                <span className="pr-2">Class : </span>
                <span className="text-gray-700 font-bold">{student.class?.title}</span>
              </Typography.Text>
              <Typography.Text type="secondary">
                <span className="pr-4">Roll : </span>
                <span className="text-gray-700 font-bold">{student.roll}</span>
              </Typography.Text>
            </Flex>
          </Flex>
        </div>
        
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
