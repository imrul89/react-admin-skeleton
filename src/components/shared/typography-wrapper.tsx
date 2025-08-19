import React from 'react';
import { Typography } from 'antd';

const { Title, Text, Link } = Typography;

interface TypographyWrapperProps {
  type: 'title' | 'text' | 'link';
  level?: 1 | 2 | 3 | 4 | 5;
  textType?: 'secondary' | 'success' | 'warning' | 'danger';
  className?: string;
  href?: string;
  children: React.ReactNode;
}

const TypographyWrapper = ({
  type,
  level = 1,
  textType,
  className,
  href,
  children
}: TypographyWrapperProps) => {
  switch (type) {
    case 'title':
      return (
        <Title level={level} className={className}>
          {children}
        </Title>
      );
    case 'link':
      return (
        <Link href={href} className={className}>
          {children}
        </Link>
      );
    case 'text':
    default:
      return (
        <Text type={textType} className={className}>
          {children}
        </Text>
      );
  }
};

export default TypographyWrapper;