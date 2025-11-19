import { useEffect } from 'react';
import { Card, Form, Row, Col, Button, Input, Select } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { useSectionForm } from '@hooks/use-sections';
import { useClassOptions } from '@hooks/use-school-classes';
import { useFormValidation } from '@hooks/utility-hooks/use-form-validation';
import { Section, SectionPartial } from '@models/section-model';
import { validationMessage } from '@utils/helpers/message-helpers';

interface SectionFormProps {
  initialValues?: SectionPartial;
  isEditMode?: boolean;
}

const SectionForm = ({
  initialValues,
  isEditMode = false
}: SectionFormProps) => {
  const [form] = Form.useForm();

  const formTitle = `${isEditMode ? 'Edit ' : 'Create'} section`;
  const formValues = Form.useWatch([], form);
  const isFormValid = useFormValidation(form, formValues);

  const { onSaved, isLoading } = useSectionForm();
  const { classOptions, isClassOptionLoading } = useClassOptions();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues
      });
    }
  }, [initialValues]);

  const onFinished = (values: Section) => {
    values.id = isEditMode ? initialValues?.id ?? 0 : 0;
    onSaved(values);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      autoComplete="off"
      initialValues={{
        status: 1,
        ...initialValues
      }}
      onFinish={onFinished}
    >
      <Card title={formTitle}>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="Title"
              name="title"
              rules={[
                { required: true, message: validationMessage('Title') }
              ]}
            >
              <Input placeholder="Title" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Class"
              name="class_id"
            >
              <Select
                options={classOptions}
                placeholder="Select Class"
                loading={isClassOptionLoading}
                allowClear
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Status"
              name="status"
              rules={[
                { required: true, message: validationMessage('Status') }
              ]}
            >
              <Select
                options={[
                  { label: 'Active', value: 1 },
                  { label: 'Inactive', value: 0 }
                ]}
                placeholder="Select Status"
              />
            </Form.Item>
          </Col>
        </Row>
      </Card>
      <Row className="my-6">
        <Col span={24} className="text-right">
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            loading={isLoading}
            disabled={!isFormValid}
          >
            Save changes
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default SectionForm;
