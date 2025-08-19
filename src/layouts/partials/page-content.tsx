import React from 'react';

const PageContent = ({
  children
}: {
  children: React.ReactNode;
}) => {
  
  return (
    <div className="py-4">
      {children}
    </div>
  );
};

export default PageContent;
