import { Flex, Form, Switch } from 'antd';

interface SwitchLabelWrapperProps {
  name: string | string[];
  onChange?: (value: boolean) => void;
  disabled?: boolean;
  data?: string[];
  loading?: boolean
}

const SwitchLabelWrapper = ({
  name,
  onChange = () => {},
  disabled = false,
  data = ['Enabled', 'Disabled'],
  loading
}: SwitchLabelWrapperProps) => {
  const formInstance = Form.useFormInstance();
  const isChecked = formInstance.getFieldValue(name);
  
  return (
    <Flex align="center" gap={14}>
      <Form.Item name={name} noStyle>
        <Switch onChange={onChange} disabled={disabled} loading={loading}/>
      </Form.Item>
      <span>{isChecked ? data[0] : data[1]}</span>
    </Flex>
  );
};

export default SwitchLabelWrapper;
