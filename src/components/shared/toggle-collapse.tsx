import { Button } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';

interface ToggleCollapseProps {
  activeKeys: string[];
  handleToggleCollapse: () => void;
}

const ToggleCollapse = ({
  activeKeys,
  handleToggleCollapse
}: ToggleCollapseProps) => {
  return (
    <Button
      size="small"
      type="link"
      className="text-gray-900"
      onClick={handleToggleCollapse}
      icon={activeKeys.length === 0 ? <DownOutlined /> : <UpOutlined />}
    >
      {activeKeys.length === 0 ? 'EXPAND ALL' : 'COLLAPSE ALL'}
    </Button>
  );
};

export default ToggleCollapse;
