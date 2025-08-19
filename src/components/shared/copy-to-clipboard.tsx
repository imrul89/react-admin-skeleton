import React from 'react';
import { App, Tooltip } from 'antd';

interface CopyToClipboardProps {
  content: string;
  children: React.ReactNode;
  className?: string;
}

const CopyToClipboard = ({
  content,
  children,
  className
}: CopyToClipboardProps) => {
  const { message } = App.useApp();
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      message.success('Copied to clipboard');
    } catch (err) {
      message.error('Failed to copy to clipboard');
    }
  };
  
  return (
    <span className={className}>
      <Tooltip className="cursor-pointer" title="Copy">
        <span onClick={handleCopy}>{children}</span>
      </Tooltip>
    </span>
  );
};

export default CopyToClipboard;
