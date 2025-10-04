import { useEffect } from 'react';
import { Card, Row, Col, Form, Input, Select, Typography, Divider } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';
import { useDistricts, useUpazilas } from '@hooks/use-locations';

const StudentAddress = ({
  isEditMode = false
}: {
  isEditMode?: boolean;
}) => {
  const form = Form.useFormInstance();
  const presentDistrictId = Form.useWatch('present_district_id', form);
  const permanentDistrictId = Form.useWatch('permanent_district_id', form);
  
  const { isDistrictLoading, districtOptions } = useDistricts();
  const { onLoadUpazilas, isUpazilaLoading, upazilaOptions } = useUpazilas();
  const {
    onLoadUpazilas: onLoadUpazilas2,
    isUpazilaLoading: isUpazilaLoading2,
    upazilaOptions: upazilaOptions2
  } = useUpazilas();
  
  const onChangePresentDistrict = (value: number) => {
    onLoadUpazilas(value);
    form.setFieldValue('present_upazila_id', null);
  };
  
  const onChangePermanentDistrict = (value: number) => {
    onLoadUpazilas2(value);
    form.setFieldValue('permanent_upazila_id', null);
  };
  
  useEffect(() => {
    if (isEditMode) {
      if (presentDistrictId > 0) {
        onLoadUpazilas(presentDistrictId);
      }
      
      if (permanentDistrictId > 0) {
        onLoadUpazilas2(permanentDistrictId);
      }
    }
  }, [presentDistrictId, permanentDistrictId]);
  
  return (
    <Card title={
      <span>
        <EnvironmentOutlined style={{ marginRight: 8 }} />Address
      </span>
    }>
      <Row gutter={24}>
        <Col span={24} className="mb-2">
          <Typography.Title level={5} className="!font-medium">Present Address</Typography.Title>
        </Col>
        <Col span={8}>
          <Form.Item
            label="District"
            name="present_district_id"
            rules={[{ required: true, message: 'Please select present district' }]}
          >
            <Select
              loading={isDistrictLoading}
              options={districtOptions}
              onChange={onChangePresentDistrict}
              placeholder="Select District"
              optionFilterProp="label"
              showSearch
              allowClear
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Upazila"
            name="present_upazila_id"
            rules={[{ required: true, message: 'Please select present upazila' }]}
          >
            <Select
              loading={isUpazilaLoading}
              options={upazilaOptions}
              placeholder="Select Upazila"
              optionFilterProp="label"
              showSearch
              allowClear
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Address"
            name="present_address"
            rules={[{ required: true, message: 'Please enter present address' }]}
          >
            <Input placeholder="Address" disabled={!form.getFieldValue('present_upazila_id')} />
          </Form.Item>
        </Col>
      </Row>
      <Divider className="!mt-0 mb-2" />
      <Row gutter={24}>
        <Col span={24} className="mb-2">
          <Typography.Title level={5} className="!font-medium">Permanent Address</Typography.Title>
        </Col>
        <Col span={8}>
          <Form.Item
            label="District"
            name="permanent_district_id"
            className="!mb-0"
          >
            <Select
              loading={isDistrictLoading}
              options={districtOptions}
              onChange={onChangePermanentDistrict}
              placeholder="Select District"
              optionFilterProp="label"
              showSearch
              allowClear
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Upazila"
            name="permanent_upazila_id"
            className="!mb-0"
          >
            <Select
              loading={isUpazilaLoading2}
              options={upazilaOptions2}
              placeholder="Select Upazila"
              optionFilterProp="label"
              showSearch
              allowClear
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Address"
            name="permanent_address"
            className="!mb-0"
          >
            <Input placeholder="Address" disabled={!form.getFieldValue('permanent_upazila_id')} />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
};

export default StudentAddress;
