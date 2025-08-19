import { Spin } from 'antd';

const PageLoader = () => {
  return (
    <div className="flex h-screen inset-0 items-center justify-center bg-white z-100">
      <Spin tip={'Loading'}>
        <div className={'p-12'}></div>
      </Spin>
    </div>
  );
};

export default PageLoader;
