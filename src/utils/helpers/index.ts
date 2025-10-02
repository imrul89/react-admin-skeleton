import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SorterResult } from 'antd/es/table/interface';
import _ from 'lodash';
import React from 'react';
import { message } from 'antd';
import {
  Options,
  PreparedOption,
  QueryParams
} from '@models/utils-model';

export const isProd = import.meta.env.MODE === 'production';

export const isJsonString = (value: string) => {
  try {
    JSON.parse(value);
    return true;
  } catch {
    return false;
  }
};

export const displayResponseErrors = (error: FetchBaseQueryError | SerializedError) => {
  const [messageApi] = message.useMessage();
  
  if ('data' in error) {
    const errorData = error.data as { error: { error_description: string }[] | { error_description: string } };
    if (Array.isArray(errorData.error)) {
      errorData.error.forEach((el) => {
        messageApi.open({
          type: 'error',
          content: el.error_description
        });
      });
    } else {
      messageApi.open({
        type: 'error',
        content: errorData.error.error_description
      });
    }
  } else {
    messageApi.open({
      type: 'error',
      content: 'An unexpected error occurred'
    });
  }
};

export const formatQueryParams = (params: QueryParams) => {
  const queryParams: string[] = [];
  
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    
    if (Array.isArray(value)) {
      queryParams.push(`${key}=${value.join(',')}`);
    } else {
      queryParams.push(`${key}=${value.toString()}`);
    }
  });
  return queryParams.join('&');
};

export const toRemoveEmptyValue = (obj: QueryParams) => {
  return _.omitBy(obj, value =>
    _.isUndefined(value) || ((_.isString(value) && _.isEmpty(value)) || (_.isArray(value) && _.isEmpty(value)))
  );
};

export const prepareFormValues = <T>(values: Record<string, T>) => {
  return _.mapValues(values, value => {
    if (value === null) {
      return '';
    }
    
    return value;
  });
};

export const toNumberArray = (value: string | number | boolean | (string | number)[] | undefined) => {
  if (_.isString(value)) {
    return [_.toNumber(value)];
  }
  
  if (_.isArray(value)) {
    return _.map(value, _.toNumber);
  }
  
  return value;
};

export const formatNumber = (value: number, decimals: number = 0): string => {
  if (!_.isNumber(value)) {
    throw new TypeError('Value must be a number');
  }
  
  return value.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

export const numberFormatter = (value: number) => {
  const formattedNumber = new Intl.NumberFormat('en-US', {
    useGrouping: true
  }).format(value).replace(/,/g, ' ');
  
  return formattedNumber;
};

export const prepareTableColumnSorter = <T>(sorter: SorterResult<T> | SorterResult<T>[]) => {
  let sortOrder = '';
  let sortField = 'id';
  
  if (_.isArray(sorter)) {
    const firstSorter = _.head(sorter);
    if (firstSorter) {
      sortOrder = firstSorter.order === 'ascend' ? '' : '-';
      sortField = _.get(firstSorter, 'field', 'id').toString();
    }
  } else {
    sortOrder = sorter.order === 'ascend' ? '' : '-';
    sortField = _.get(sorter, 'field', 'id').toString();
  }
  
  return `${sortOrder}${sortField}`;
};

export const prepareOptions = (options: Options): PreparedOption[] => {
  return _.map(_.values(options), option => {
    return {
      label: option.label,
      value: option.value,
      title: ''
    };
  });
};

export const objectToFormData = (data: any) => {
  const formData = new FormData();
  
  Object.keys(data).forEach(key => {
    const value = (data as any)[key];
    
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        formData.append(`${key}[${index}]`, item);
      });
    } else {
      formData.append(key, value);
    }
  });
  
  return formData;
};

export const openWithNewTab = (url: string) => {
  window.open(url, '_blank', 'noopener, noreferrer');
};

export const numberValidation = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (!/[0-9]/.test(e.key)) {
    e.preventDefault();
  }
  
  return;
};

export const getBase64BlobSize = (base64: string): number => {
  const byteString = atob(base64.split(',')[1]);
  const ab = new Uint8Array(byteString.length);
  
  for (let i = 0; i < byteString.length; i++) {
    ab[i] = byteString.charCodeAt(i);
  }
  
  const blob = new Blob([ab]);
  return blob.size;
};

export const resizeCroppedImage = (imageSrc: string, width: number, height: number) => {
  const image = new Image();
  image.src = imageSrc;
  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = width;
  canvas.height = height;
  
  const imageType = imageSrc.substring(imageSrc.indexOf(':') + 1, imageSrc.indexOf(';'));
  
  return new Promise<string>((resolve) => {
    image.onload = () => {
      if (ctx) {
        ctx.drawImage(
          image,
          0,
          0,
          width,
          height
        );
        
        resolve(canvas.toDataURL(imageType));
      }
    };
  });
};

export const getFileExtension = (file: File) => {
  return file.name.split('.').pop();
};

export const getImageBase64 = (file: File, width?: number, height?: number, isCropEnabled = true): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(
      file.type === 'image/gif' || !isCropEnabled ? reader.result as string : resizeCroppedImage(reader.result as string, width!, height!)
    );
    reader.onerror = error => reject(error);
  });
};

export const getImageDimension = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;
      img.onload = () => {
        const { width, height } = img;
        resolve(`${width}x${height}`);
      };
    };
    reader.readAsDataURL(file);
    reader.onerror = error => reject(error);
  });
};

export const base64ToFile = (base64String: string, fileName: string, mimeType: string): File => {
  const byteString = atob(base64String.split(',')[1]);
  const byteArray = new Uint8Array(byteString.length);
  
  for (let i = 0; i < byteString.length; i++) {
    byteArray[i] = byteString.charCodeAt(i);
  }
  
  const blob = new Blob([byteArray], { type: mimeType });
  return new File([blob], fileName, { type: mimeType });
};

export const getAspectRatio = (dimension: string) => {
  const gcd = (a: number, b: number): number => {
    return b === 0 ? a : gcd(b, a % b);
  };
  
  const [width, height] = dimension.split('x').map(Number);
  
  const divisor = gcd(width, height);
  return (width / divisor) / (height / divisor);
};