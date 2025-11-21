import { useEffect } from 'react';
import { Button, Row, Col, Form } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import StudentAddress from '@features/students/components/student-address';
import StudentBasicInfo from '@features/students/components/student-basic-info';
import StudentParents from '@features/students/components/student-parents';
import { transformedToRequestData } from '@features/transformers/student-transformers';
import { useStudentForm } from '@hooks/use-students';
import { useFormValidation } from '@hooks/utility-hooks/use-form-validation';
import { StudentFormData } from '@models/student-model';

interface StudentFormProps {
  initialValues?: StudentFormData;
  isEditMode?: boolean;
}

const StudentForm = ({
  initialValues,
  isEditMode = false
}: StudentFormProps) => {
  const [form] = Form.useForm();
  
  const formValues = Form.useWatch([], form);
  const isFormValid = useFormValidation(form, formValues);
  
  const { onSaved, isLoading } = useStudentForm();
  
  useEffect(() => {
    if (initialValues && isEditMode) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, isEditMode]);

  const onFinished = (values: StudentFormData) => {
    const studentData = transformedToRequestData(values);
    
    studentData.student.id = initialValues?.id || undefined;
    studentData.student.student_details_id = initialValues?.student_details_id || undefined;
    
    const formData = new FormData();
    
    if (values.photo) {
      formData.append('photo', values.photo);
    }
    
    formData.append('body', JSON.stringify(studentData));

    onSaved(formData, initialValues?.id);
  };
  
  return (
    <Form
      form={form}
      layout="vertical"
      autoComplete={'off'}
      initialValues={initialValues}
      onFinish={onFinished}
    >
      <StudentBasicInfo photoUrl={initialValues?.photo_url} isEditMode={isEditMode} />
      
      <StudentParents />
      
      <StudentAddress isEditMode={isEditMode} />
      
      <Row className="my-6">
        <Col span={24} className="text-right">
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            loading={isLoading}
            disabled={!isFormValid}>
            Save changes
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default StudentForm;
