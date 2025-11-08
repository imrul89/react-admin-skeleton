import { useEffect, useState } from 'react';
import { Flex } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import AltImage from '@assets/alt-image.jpg';

interface ImagePreviewProps {
  src: string;
  isRemoveEnabled?: boolean;
  onRemove: () => void;
}

const ImagePreview = ({
  src,
  isRemoveEnabled = true,
  onRemove
}: ImagePreviewProps) => {
  const [previewSrc, setPreviewSrc] = useState(src);
  
  const handleError = () => {
    setPreviewSrc(AltImage);
  };
  
  useEffect(() => {
    setPreviewSrc(src);
  }, [src]);
  
  return (
    <Flex
      className="relative border border-dashed border-[#F0F0F0]
       bg-[#FAFAFA] p-2 rounded-md h-[200px]"
      justify="center"
      vertical
    >
      <div
        hidden={!isRemoveEnabled}
        className="absolute right-4 top-3 cursor-pointer text-red-500"
        onClick={onRemove}
      >
        <DeleteOutlined />
      </div>
      <Flex justify="center" className="mt-2">
        <img
          style={{
            maxWidth: '150px'
          }}
          src={previewSrc}
          onError={handleError}
          className="rounded-lg"
        />
      </Flex>
    </Flex>
  );
};

export default ImagePreview;
