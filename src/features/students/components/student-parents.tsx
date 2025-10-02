import { Card, Row, Col, Form, Input, Select, Typography, Divider } from 'antd';
import { UsergroupAddOutlined } from '@ant-design/icons';
import { OCCUPATIONS } from '@utils/constants';
import { validationMessage } from '@utils/helpers/message-helpers';

const StudentParents = () => {
  return (
    <Card
      title={
        <span>
          <UsergroupAddOutlined style={{ marginRight: 8 }} />
          Parents Information
        </span>
      }
      className="!mb-4"
    >
      <Row gutter={24}>
        <Col span={24} className="mb-2">
          <Typography.Title level={5} className="!font-medium">Father's Details</Typography.Title>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Name"
            name="father_name"
            rules={[{ required: true, message: validationMessage('father name') }]}
          >
            <Input placeholder="Father's Name" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Mobile Number"
            name="father_mobile_no"
          >
            <Input placeholder="Mobile Number" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Occupation"
            name="father_occupation_id"
          >
            <Select
              options={OCCUPATIONS}
              placeholder="Select Occupation"
              optionFilterProp="label"
              showSearch
              allowClear
            />
          </Form.Item>
        </Col>
      </Row>
      <Divider className="!mt-0 mb-2" />
      <Row gutter={24}>
        <Col span={24} className="mb-2">
          <Typography.Title level={5} className="!font-medium">Mother's Details</Typography.Title>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Name"
            name="mother_name"
            rules={[{ required: true, message: validationMessage('mother name') }]}
            className="!mb-0"
          >
            <Input placeholder="Mother's Name" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Mobile Number"
            name="mother_mobile_no"
            className="!mb-0"
          >
            <Input placeholder="Mobile Number" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Occupation"
            name="mother_occupation_id"
            className="!mb-0"
          >
            <Select
              options={OCCUPATIONS}
              placeholder="Select Occupation"
              optionFilterProp="label"
              showSearch
              allowClear
            />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
};

export default StudentParents;
