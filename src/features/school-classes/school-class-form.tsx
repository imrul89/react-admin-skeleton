import _ from 'lodash';
import { useEffect } from 'react';
import { Card, Form, Row, Col, Button, Select } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { useSchoolClassForm } from '@hooks/use-school-classes.ts';
import { SchoolClass, SchoolClassPartial } from '@models/school-class-model';
import { MONTHS } from '@utils/constants';

interface SchoolClassFormProps {
  initialValues?: SchoolClassPartial;
  isEditMode?: boolean;
  onSaved?: (schoolClass: SchoolClass) => void;
  isLoading?: boolean;
  showCard?: boolean;
}

const SchoolClassForm = ({
  initialValues,
  isEditMode = false,
  onSaved: externalOnSaved,
  isLoading: externalIsLoading,
  showCard = true
}: SchoolClassFormProps) => {
  const [form] = Form.useForm();

  const formTitle = isEditMode ? 'Coaching Configuration' : 'Create class';
  // Form is always valid since coaching_applicable is optional
  const isFormValid = true;

  const { onSaved: defaultOnSaved, isLoading: defaultIsLoading } = useSchoolClassForm();
  const onSaved = externalOnSaved || defaultOnSaved;
  const isLoading = externalIsLoading !== undefined ? externalIsLoading : defaultIsLoading;

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        coaching_applicable: initialValues.coaching_applicable ? initialValues.coaching_applicable.split(',').map(Number) : [],
      });
    }
  }, [initialValues]);

  const onFinished = (values: any) => {
    // Only send coaching_applicable field for edit mode
    const updateData: SchoolClass = {
      ...initialValues!,
      id: initialValues?.id ?? 0,
      coaching_applicable: values.coaching_applicable 
        ? _.sortBy(values.coaching_applicable).toString() 
        : ''
    };
    
    onSaved(updateData);
  };

  const formContent = (
    <Row gutter={24}>
      <Col span={24}>
        <Form.Item
          label="Coaching Applicable on Months"
          name="coaching_applicable"
          className="!mb-0"
        >
          <Select
            placeholder="Select months"
            options={MONTHS}
            mode="multiple"
            allowClear
            style={{ width: '100%' }}
          />
        </Form.Item>
      </Col>
    </Row>
  );

  return (
    <Form
      form={form}
      layout="vertical"
      autoComplete="off"
      initialValues={initialValues}
      onFinish={onFinished}
    >
      {showCard ? (
        <Card title={formTitle}>
          {formContent}
        </Card>
      ) : (
        formContent
      )}
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

export default SchoolClassForm;
