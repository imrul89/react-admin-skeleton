import { useEffect, useState } from 'react';
import { Card, Form, Row, Col, Input, Button, Spin } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import ImageCropper from '@features/students/components/image-cropper';
import { useSettings, useSettingsForm } from '@hooks/use-settings';
import { useFormValidation } from '@hooks/utility-hooks/use-form-validation';

const SettingsDetails = () => {
  const [form] = Form.useForm();
  const formValues = Form.useWatch([], form);
  const isFormValid = useFormValidation(form, formValues);
  
  const [logoUrl, setLogoUrl] = useState<string | undefined>(undefined);
  const [iconUrl, setIconUrl] = useState<string | undefined>(undefined);
  const [bannerUrl, setBannerUrl] = useState<string | undefined>(undefined);

  const { isLoading, settings } = useSettings();
  const { isLoading: isSaving, onUpdate } = useSettingsForm();

  useEffect(() => {
    if (settings) {
      form.setFieldsValue({
        name: settings.name,
        address: settings.address,
        contact_number: settings.contact_number,
        email: settings.email,
        code: settings.code,
      });
      
      if (settings?.logo) {
        setLogoUrl(__IMAGE_BASE_URL__ + '/uploads/settings/' + settings.logo);
      }
      
      if (settings?.icon) {
        setIconUrl(__IMAGE_BASE_URL__ + '/uploads/settings/' + settings.icon);
      }
      
      if (settings?.banner) {
        setBannerUrl(__IMAGE_BASE_URL__ + '/uploads/settings/' + settings.banner);
      }
    }
  }, [settings, form]);

  const onFinished = (values: any) => {
    const formData = new FormData();

    const bodyCopy = { ...values };
    
    delete bodyCopy.logo;
    delete bodyCopy.icon;
    delete bodyCopy.banner;

    formData.append('body', JSON.stringify(bodyCopy));

    if (values.logo) {
      formData.append('logo', values.logo);
    }
    
    if (values.icon) {
      formData.append('icon', values.icon);
    }
    
    if (values.banner) {
      formData.append('banner', values.banner);
    }

    onUpdate(formData);
  };

  return (
    <Card title="Settings">
      <Spin spinning={isLoading}>
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          onFinish={onFinished}
        >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: 'Please enter name' }]}
              >
                <Input placeholder="Enter name" />
              </Form.Item>
              <Form.Item
                label="Code"
                name="code"
                rules={[{ required: true, message: 'Please enter code' }]}
              >
                <Input placeholder="Enter code" />
              </Form.Item>
              <Form.Item
                label="Contact Number"
                name="contact_number"
                rules={[{ required: true, message: 'Please enter contact number' }]}
              >
                <Input placeholder="Enter contact number" />
              </Form.Item>
              <Form.Item
                label="Email"
                name="email"
              >
                <Input type="email" placeholder="Enter email" />
              </Form.Item>
              <Form.Item
                label="Address"
                name="address"
                rules={[{ required: true, message: 'Please enter address' }]}
              >
                <Input.TextArea rows={3} placeholder="Enter address" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item label="Logo">
                    <ImageCropper
                      fieldName="logo"
                      width={200}
                      height={200}
                      previewImageSrc={logoUrl ?? undefined}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Icon">
                    <ImageCropper
                      fieldName="icon"
                      width={40}
                      height={40}
                      previewImageSrc={iconUrl ?? undefined}
                    />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Banner" className="!mb-0">
                    <ImageCropper
                      fieldName="banner"
                      width={900}
                      height={1000}
                      previewImageSrc={bannerUrl ?? undefined}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>

          <Row className="mt-6">
            <Col span={24} className="text-right">
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={isSaving}
                disabled={!isFormValid}
              >
                Save Settings
              </Button>
            </Col>
          </Row>
        </Form>
      </Spin>
    </Card>
  );
};

export default SettingsDetails;
