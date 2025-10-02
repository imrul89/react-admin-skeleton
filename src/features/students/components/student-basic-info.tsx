import { Card, Row, Col, DatePicker, Form, Input, InputNumber, Radio, Select } from 'antd';
import { ManOutlined, WomanOutlined, UserOutlined } from '@ant-design/icons';
import ImageCropper from '@features/students/components/image-cropper';
import { useClassOptions } from '@hooks/use-school-classes';
import { BLOOD_GROUPS, RELIGIONS } from '@utils/constants';
import { validationMessage } from '@utils/helpers/message-helpers';

const StudentBasicInfo = () => {
  const { isClassOptionLoading, classOptions } = useClassOptions();
  
  return (
    <Card
      title={
        <span>
          <UserOutlined style={{ marginRight: 8 }} />Basic Information
        </span>
      }
      style={{ marginBottom: 16 }}
    >
      <Row gutter={24}>
        <Col span={16} className="!mb-0">
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="Name"
                name="name"
                rules={[
                  {required: true, message: validationMessage('name')}
                ]}
              >
                <Input placeholder="Student Name"/>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Class"
                name="class_id"
                rules={[
                  {required: true, message: validationMessage('class')}
                ]}
              >
                <Select
                  loading={isClassOptionLoading}
                  placeholder="Select Class"
                  options={classOptions}
                  optionFilterProp="label"
                  showSearch
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Date of Birth"
                name="dob"
                rules={[
                  { required: true, message: validationMessage('date of birth') }
                ]}
              >
                <DatePicker
                  style={{width: '100%'}}
                  placeholder="yyyy-mm-dd"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Roll Number"
                name="roll"
              >
                <InputNumber
                  style={{width: '100%'}}
                  placeholder="Roll Number"
                  min={1}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Gender"
                name="gender"
                rules={[
                  {required: true, message: validationMessage('gender')}
                ]}
              >
                <Radio.Group>
                  <Radio.Button value="Male"><ManOutlined /> Male</Radio.Button>
                  <Radio.Button value="Female"><WomanOutlined /> Female</Radio.Button>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Blood Group"
                name="blood_group"
              >
                <Select options={BLOOD_GROUPS} placeholder="Select Blood Group" allowClear />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Religious"
                name="religion_id"
                rules={[
                  {required: true, message: validationMessage('religious')}
                ]}
                style={{ marginBottom: 0 }}
              >
                <Select
                  placeholder="Select Religious"
                  options={RELIGIONS}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Mobile Number"
                name="mobile_no"
                rules={[
                  { required: true, message: validationMessage('mobile number') },
                  { pattern: /^(01[3-9]\d{8})?$/, message: 'Invalid mobile number' }
                ]}
                style={{ marginBottom: 0 }}
              >
                <Input
                  addonBefore="+88"
                  placeholder="01xxxxxxxxx"
                />
              </Form.Item>
            </Col>
          </Row>
        </Col>
        <Col span={8}>
          <Form.Item label=" " className="!mb-0">
            <ImageCropper
              fieldName="photo"
              previewImageSrc=""
            />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
};

export default StudentBasicInfo;
