import dayjs from 'dayjs';
import { useState } from 'react';
import { Form, Input, Button, Radio } from 'antd';
import { LockOutlined, UnlockOutlined, UserOutlined } from '@ant-design/icons';
import { useAuth } from '@hooks/auth/use-auth';

const LoginForm = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { onLogin, isLoading } = useAuth();
  
  return (
    <Form
      layout="vertical"
      initialValues={{
        username: 'admin',
        password: '',
        year: +dayjs().format('YYYY')
      }}
      requiredMark={false}
      onFinish={onLogin}
      className="max-w-[320px]"
      style={{ width: '100%' }}
    >
      <Form.Item
        name="username"
        label="Username"
        rules={[{ required: true, message: 'Username is required' }]}
      >
        <Input prefix={<UserOutlined />} placeholder="Username" />
      </Form.Item>
      <Form.Item
        name="password"
        label="Password"
        rules={[{ required: true, message: 'Password is required' }]}
      >
        <Input.Password
          prefix={passwordVisible ? <UnlockOutlined /> : <LockOutlined />}
          type="password"
          placeholder="Password"
          visibilityToggle={{ visible: passwordVisible, onVisibleChange: setPasswordVisible }}
        />
      </Form.Item>
      <Form.Item
        name="year"
        rules={[{ required: true, message: 'Year is required' }]}
      >
        <Radio.Group>
          <Radio.Button value={2025}>2025</Radio.Button>
          <Radio.Button value={2026}>2026</Radio.Button>
          <Radio.Button value={2027}>2027</Radio.Button>
        </Radio.Group>
      </Form.Item>
      <Form.Item>
        <Button loading={isLoading} type="primary" htmlType="submit" block>
          Log in
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;