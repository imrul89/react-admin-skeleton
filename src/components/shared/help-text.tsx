import { FC, PropsWithChildren } from 'react';
import { Typography } from 'antd';

interface HelpTextProps extends PropsWithChildren {
  className?: string;
}

const HelpText: FC<HelpTextProps> = ({ children, className }) => {
  return (
    <Typography.Text type="secondary" className={`text-sm ${className}`}>{children}</Typography.Text>
  );
};

export default HelpText;