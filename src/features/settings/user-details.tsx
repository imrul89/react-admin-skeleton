import { Card, Col, Form, Row } from 'antd';
import { useAppSelector } from '@/store';

const UserDetails = () => {
  const user = useAppSelector((state) => state.user);

  return (
    <Card title="Information">
      <Form layout="vertical">
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item label="Name">
              <span className="inline-block border border-gray-300 px-2 py-1 rounded bg-gray-100 text-gray-500 w-full">{user.name}</span>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Username">
              <span className="inline-block border border-gray-300 px-2 py-1 rounded bg-gray-100 text-gray-500 w-full">{user.username}</span>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Email">
              <span className="inline-block border border-gray-300 px-2 py-1 rounded bg-gray-100 text-gray-500 w-full">{user.email}</span>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Status">
              <span className="inline-block border border-gray-300 px-2 py-1 rounded bg-gray-100 text-gray-500 w-full">{user.status ? 'Active' : 'Inactive'}</span>
            </Form.Item>
          </Col>
          
        </Row>
      </Form>
    </Card>
  );
};

export default UserDetails;
