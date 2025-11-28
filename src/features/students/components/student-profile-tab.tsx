import dayjs from 'dayjs';
import { Row, Col, Typography, Descriptions, Divider, Tag } from 'antd';
import { UserOutlined, HomeOutlined } from '@ant-design/icons';
import { Student } from '@models/student-model';
import { OCCUPATIONS, RELIGIONS } from '@utils/constants';
import { getShiftName } from '@utils/helpers';

const { Title, Text } = Typography;

interface StudentProfileTabProps {
  student: Student;
}

const StudentProfileTab = ({ student }: StudentProfileTabProps) => {
  const studentDetails = student.studentDetails;
  const presentAddress = studentDetails?.studentAddresses?.find(addr => addr.type === '1');
  const permanentAddress = studentDetails?.studentAddresses?.find(addr => addr.type === '2');
  const father = studentDetails?.studentParents?.find(parent => parent.relationship === 'Father');
  const mother = studentDetails?.studentParents?.find(parent => parent.relationship === 'Mother');
  const religion = RELIGIONS.find(religion => religion.value === studentDetails?.religion_id)?.label || 'N/A';
  
  return (
    <div className="space-y-6 px-2">
      <Row gutter={[24, 24]} className="!mt-1">
        <Col xs={24} md={12}>
          <Descriptions column={1} size="small">
            {student?.shift_id && (
              <Descriptions.Item label="Shift">
                {getShiftName(student?.shift_id)}
              </Descriptions.Item>
            )}
            <Descriptions.Item label="Class">
              {student.class?.title}
            </Descriptions.Item>
            <Descriptions.Item label="Section">
              {student.section?.title}
            </Descriptions.Item>
            <Descriptions.Item label="Roll">
              {student.roll || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              {student.status_id === 1 ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>}
            </Descriptions.Item>
          </Descriptions>
        </Col>
        <Col xs={24} md={12}>
          <Descriptions column={1} size="small">
            <Descriptions.Item label="Gender">
              {studentDetails?.gender}
            </Descriptions.Item>
            <Descriptions.Item label="Date of Birth">
              {studentDetails?.dob ? dayjs(studentDetails.dob).format('DD MMM YYYY') : 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Blood Group">
              {studentDetails?.blood_group || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Mobile">
              {studentDetails?.mobile_no || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Religion">
              {religion}
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
      <Divider />
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Title level={5} className="!mb-4 flex items-center">
            <UserOutlined className="mr-2" />
            Father Information
          </Title>
          {father?.parent ? (
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Name">
                {father.parent.name}
              </Descriptions.Item>
              <Descriptions.Item label="Mobile">
                {father.parent.mobile_no || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Occupation">
                {father.parent.occupation_id ? OCCUPATIONS[father.parent.occupation_id as keyof typeof OCCUPATIONS] : 'N/A'}
              </Descriptions.Item>
            </Descriptions>
          ) : (
            <Text type="secondary">No father information available</Text>
          )}
        </Col>
        <Col xs={24} md={12}>
          <Title level={5} className="!mb-4 flex items-center">
            <UserOutlined className="mr-2" />
            Mother Information
          </Title>
          {mother?.parent ? (
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Name">
                {mother.parent.name}
              </Descriptions.Item>
              <Descriptions.Item label="Mobile">
                {mother.parent.mobile_no || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Occupation">
                {mother.parent.occupation_id ? OCCUPATIONS[mother.parent.occupation_id as keyof typeof OCCUPATIONS] : 'N/A'}
              </Descriptions.Item>
            </Descriptions>
          ) : (
            <Text type="secondary">No mother information available</Text>
          )}
        </Col>
      </Row>
      <Divider />
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Title level={5} className="!mb-4 flex items-center">
            <HomeOutlined className="mr-2" />
            Present Address
          </Title>
          {presentAddress?.address ? (
            <div>
              <Text type="secondary">{presentAddress.address.address}</Text>
              <br />
              <Text strong>{presentAddress.address.upazila?.name}, {presentAddress.address.upazila?.district?.name}</Text>
            </div>
          ) : (
            <Text type="secondary">No present address available</Text>
          )}
        </Col>
        <Col xs={24} md={12}>
          <Title level={5} className="!mb-4 flex items-center">
            <HomeOutlined className="mr-2" />
            Permanent Address
          </Title>
          {permanentAddress?.address ? (
            <div>
              <Text type="secondary">{permanentAddress.address.address}</Text>
              <br />
              <Text strong>{permanentAddress.address.upazila?.name}, {permanentAddress.address.upazila?.district?.name}</Text>
            </div>
          ) : (
            <Text type="secondary">No permanent address available</Text>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default StudentProfileTab;
