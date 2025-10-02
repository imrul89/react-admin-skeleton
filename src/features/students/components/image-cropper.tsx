import ImgCrop from 'antd-img-crop';
import { useEffect, useState } from 'react';
import { Form, Upload, type UploadProps } from 'antd';
import { EditOutlined, FileImageOutlined } from '@ant-design/icons';
import {
  base64ToFile,
  getBase64BlobSize,
  getFileExtension,
  getImageBase64
} from '@utils/helpers';
import ImagePreview from './image-preview';

const { Dragger } = Upload;

interface ImageUrls {
  name: string;
  url: string;
}

interface ImageCropperProps {
  fieldName: string;
  previewImageSrc?: string;
  previewImageUrls?: ImageUrls[];
  setPreviewImageUrls?: (urls: ImageUrls[]) => void;
}

const IMAGE_ACCEPT_TYPES = ['.jpeg', '.jpg', '.png'];
const WIDTH = 320;
const HEIGHT = 350;

const ImageCropper = ({
  fieldName,
  previewImageSrc = '',
  previewImageUrls = [],
  setPreviewImageUrls
}: ImageCropperProps) => {
  const formInstance = Form.useFormInstance();
  
  const [previewImage, setPreviewImage] = useState('');
  const [hasPreviewImage, setHasPreviewImage] = useState(false);
  
  const props: UploadProps = {
    multiple: false,
    accept: '.jpeg, .jpg, .png',
    maxCount: 1,
    showUploadList: false,
    beforeUpload: async (file) => {
      const imageBase64 = await getImageBase64(file as File, WIDTH, HEIGHT);
      const imageSize = getBase64BlobSize(imageBase64);
      const extension = getFileExtension(file);
      
      if (!IMAGE_ACCEPT_TYPES.includes(`.${extension}`)) {
        formInstance.setFields([{
          name: fieldName,
          errors: ['Selected file is not supported']
        }]);
        
        return Upload.LIST_IGNORE;
      }
      
      if (imageSize > (1 * 1024 * 1024)) {
        formInstance.setFields([{
          name: fieldName,
          errors: [`File size should be less than 1MB`]
        }]);
        
        return Upload.LIST_IGNORE;
      }
      
      formInstance.setFieldsValue({
        [fieldName]: base64ToFile(imageBase64, file.name, file.type)
      });
      
      formInstance.setFields([{
        name: fieldName,
        errors: []
      }]);
      
      setPreviewImage(imageBase64);
      
      if (setPreviewImageUrls) {
        setPreviewImageUrls([
          ...previewImageUrls,
          { name: fieldName, url: imageBase64 }
        ]);
      }
      
      return false;
    }
  };
  
  const onRemoveImage = () => {
    setPreviewImage('');
    
    setPreviewImageUrls?.(previewImageUrls.filter((url) => url.name !== fieldName));
    formInstance.resetFields([fieldName]);
  };
  
  useEffect(() => {
    if (previewImageSrc) {
      setPreviewImage(previewImageSrc);
      setHasPreviewImage(true);
    }
  }, [previewImageSrc]);
  
  return (
    <Form.Item
      name={`${fieldName}`}
      className="!mb-0"
    >
      {previewImage ? (
        <>
          <ImagePreview
            src={previewImage}
            isRemoveEnabled={!hasPreviewImage}
            onRemove={onRemoveImage}
          />
          {hasPreviewImage && (
            <ImgCrop
              quality={1}
              aspect={WIDTH / HEIGHT}
              modalTitle="Crop Image"
              // eslint-disable-next-line require-await
              beforeCrop={async (file) => {
                const extension = getFileExtension(file);
                
                if (!IMAGE_ACCEPT_TYPES.includes(`.${extension}`)) {
                  return false;
                }

                return undefined;
              }}
            >
              <Upload {...props}>
                <div className="absolute right-4 top-3 cursor-pointer">
                  <EditOutlined />
                </div>
              </Upload>
            </ImgCrop>
          )}
        </>
      ) : (
        <ImgCrop
          quality={1}
          aspect={WIDTH / HEIGHT}
          modalTitle="Crop Image"
          beforeCrop={(file) => {
            const extension = getFileExtension(file);
            
            if (!IMAGE_ACCEPT_TYPES.includes(`.${extension}`)) {
              return false;
            }

            return undefined;
          }}
        >
          <Dragger {...props}>
            <div className="h-[255px] flex flex-col justify-center items-center">
              <p className="ant-upload-drag-icon">
                <FileImageOutlined />
              </p>
              <p className="text-gray-700">
                Browse or drag image to this area to upload
              </p>
              <p className="ant-upload-hint">Supported formats: .jpeg, .jpg, .png</p>
              <p className="ant-upload-hint">
                Dimension: {WIDTH} x {HEIGHT} px
              </p>
              <p className="ant-upload-hint">
                Max. file size: 1MB
              </p>
            </div>
          </Dragger>
        </ImgCrop>
      )}
    </Form.Item>
  );
};

export default ImageCropper;
