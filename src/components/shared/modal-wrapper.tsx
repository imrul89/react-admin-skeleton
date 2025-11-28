import React, { useState } from 'react';
import { Modal } from 'antd';
import { MODAL_SIZES } from '@utils/constants';

interface ModalWrapperProps {
  clickArea: React.ReactNode | string;
  onClick?: () => void;
  title: React.ReactNode | string;
  children?: (close: () => void) => React.ReactNode;
  footer?: React.ReactNode | null;
  width?: number;
  centered?: boolean;
  top?: boolean;
  closable?: boolean;
}

const ModalWrapper = ({
  clickArea,
  onClick,
  title,
  children,
  footer = null,
  width = MODAL_SIZES.MEDIUM,
  centered = true,
  top = false,
  closable = true
}: ModalWrapperProps) => {
  const [open, setOpen] = useState(false);
  
  const handleCancel = () => {
    setOpen(false);
  };
  
  const onModalClick = () => {
    setOpen(true);
    onClick && onClick();
  };
  
  return (
    <>
      <span onClick={() => onModalClick()}>{clickArea}</span>
      <Modal
        open={open}
        title={title}
        onCancel={handleCancel}
        destroyOnHidden={true}
        footer={footer}
        width={width}
        centered={centered}
        closable={closable}
        maskClosable={false}
        className={!centered && top ? 'top-[20px]' : ''}
      >
        {children && children(handleCancel)}
      </Modal>
    </>
  );
};

export default ModalWrapper;
