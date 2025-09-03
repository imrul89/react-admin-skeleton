export const validationMessage = (label: string, rule?: 'number' | 'email'): string => {
  const lowerCaseLabel = label.toLowerCase();
  
  switch (rule) {
    case 'number': {
      return `The ${lowerCaseLabel} field must be a number!`;
    }
    case 'email': {
      return `The ${lowerCaseLabel} field must be a valid email address!`;
    }
    default: {
      return `The ${lowerCaseLabel} field is required!`;
    }
  }
};

export const prepareDisplayedMessages = (messages: string[]) => {
  return (
    <div className="text-start">
      {messages.map((msg, index) => {
        return <p key={index}>{msg}</p>;
      })}
    </div>
  );
};
