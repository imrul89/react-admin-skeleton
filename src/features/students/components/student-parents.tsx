import { Card, Row, Col, Form, Input, Select, Typography } from 'antd';
import { OCCUPATIONS } from '@utils/constants';
import { validationMessage } from '@utils/helpers/message-helpers';

const StudentParents = () => {
  
  return (
    <Card
      title="Parents Information"
      style={{ marginBottom: 16 }}
    >
      <Row gutter={24}>
        <Col span={12}>
          <Typography.Title level={5}>Father's Details</Typography.Title>
          <Form.Item
            label="Name"
            name="father_name"
            rules={[
              {required: true, message: validationMessage('father name')}
            ]}
            className="mt-4"
          >
            <Input placeholder="Father Name"/>
          </Form.Item>
          <Form.Item
            label="Mobile Number"
            name="father_mobile_no"
          >
            <Input placeholder="Mobile Number"/>
          </Form.Item>
          <Form.Item
            label="Occupation"
            name="father_occupation_id"
            style={{ marginBottom: 0 }}
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
        <Col span={12}>
          <Typography.Title level={5}>Mother's Details</Typography.Title>
          <Form.Item
            label="Name"
            name="mother_name"
            rules={[
              {required: true, message: validationMessage('mother name')}
            ]}
          >
            <Input placeholder="Mother Name"/>
          </Form.Item>
          <Form.Item
            label="Mobile Number"
            name="mother_mobile_no"
          >
            <Input placeholder="Mobile Number"/>
          </Form.Item>
          <Form.Item
            label="Occupation"
            name="mother_occupation_id"
            style={{ marginBottom: 0 }}
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
