import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { App } from 'antd';
import { prepareDisplayedMessages } from '@utils/helpers/message-helpers';

const useResponseError = () => {
  const { message } = App.useApp();
  
  const displayError = (error: FetchBaseQueryError | SerializedError | unknown, duration = 5) => {
    if (isFetchBaseQueryError(error)) {
      const errorData = error.data as { messages?: Array<{ description: string }> } | undefined;
      
      if (errorData?.messages && Array.isArray(errorData.messages)) {
        const errorMessages: string[] = [];
        
        errorData.messages.forEach((msg) => {
          errorMessages.push(msg.description);
        });
        
        message.error({
          content: prepareDisplayedMessages(errorMessages),
          duration
        });
      } else {
        message.error({
          content: 'An error occurred: ' + (errorData?.messages?.[0]?.description || 'Unknown error'),
          duration
        });
      }
    } else if (isSerializedError(error)) {
      message.error({
        content: error.message || 'An unexpected error occurred',
        duration
      });
    } else {
      message.error({
        content: 'An unexpected error occurred',
        duration
      });
    }
  };
  
  const isFetchBaseQueryError = (error: any): error is FetchBaseQueryError => {
    return typeof error === 'object' && error !== null && 'status' in error;
  };
  
  const isSerializedError = (error: any): error is SerializedError => {
    return typeof error === 'object' && error !== null && 'name' in error;
  };
  
  return {
    displayError,
  };
};

export default useResponseError;
