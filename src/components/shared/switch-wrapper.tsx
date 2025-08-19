import { Switch } from 'antd';

interface SwitchWrapperProps {
  name: string;
  value: boolean;
  onChange: (params: { name: string, value: boolean }) => void;
}

const SwitchWrapper = ({
  name,
  value,
  onChange
}: SwitchWrapperProps) => {
  const handleChange = (checked: boolean) => {
    onChange({ name, value: checked });
  };
  
  return (
    <Switch checked={value} onChange={handleChange} />
  );
};

export default SwitchWrapper;
