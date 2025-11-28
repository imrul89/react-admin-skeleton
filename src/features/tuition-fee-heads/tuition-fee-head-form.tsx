import { useEffect } from 'react';
import { Card, Form, Row, Col, Button, Input, Select, Radio, InputNumber } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { useTuitionFeeHeadForm } from '@hooks/use-tuition-fee-heads';
import { useFormValidation } from '@hooks/utility-hooks/use-form-validation';
import { TuitionFeeHead, TuitionFeeHeadPartial } from '@models/tuition-fee-head-model';
import { TUITION_FEE_HEAD_TYPE_OPTIONS } from '@utils/constants';
import { validationMessage } from '@utils/helpers/message-helpers';

interface TuitionFeeHeadFormProps {
  initialValues?: TuitionFeeHeadPartial;
  isEditMode?: boolean;
}

const TuitionFeeHeadForm = ({
  initialValues,
  isEditMode = false
}: TuitionFeeHeadFormProps) => {
  const [form] = Form.useForm();

  const formTitle = `${isEditMode ? 'Edit ' : 'Create'} tuition fee head`;
  const formValues = Form.useWatch([], form);
  const isFormValid = useFormValidation(form, formValues);

  const { onSaved, isLoading } = useTuitionFeeHeadForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
      ...initialValues
      });
    }
  }, [initialValues]);

  const onFinished = (values: TuitionFeeHead) => {
    values.id = isEditMode ? initialValues?.id ?? 0 : 0;
    onSaved(values);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      autoComplete="off"
      initialValues={initialValues}
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
              label="Account Type"
              name="account_type_id"
              rules={[
                { required: true, message: validationMessage('account type') }
              ]}
            >
              <Select
                options={TUITION_FEE_HEAD_TYPE_OPTIONS}
                placeholder="Select Account Type"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Type"
              name="type"
              rules={[
                { required: true, message: validationMessage('Type') }
              ]}
            >
              <Radio.Group buttonStyle="outline">
                <Radio.Button value="COST">Cost</Radio.Button>
                <Radio.Button value="FINE">Fine</Radio.Button>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Serial"
              name="serial"
              rules={[
                { required: true, message: validationMessage('Serial') }
              ]}
            >
              <InputNumber />
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

export default TuitionFeeHeadForm;
