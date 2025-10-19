import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import TuitionFeeHeadTable from '@features/tuition-fee-heads/tuition-fee-head-table';
import PageContent from '@layouts/partials/page-content';
import PageHeader from '@layouts/partials/page-header';

const TuitionFeeHeads = () => {
  return (
    <>
      <PageHeader
        title="Tuition Fee Heads"
        subTitle="Manage Tuition Fee Heads"
      >
        <Link to={'/tuition-fee-heads/create'}>
          <Button type={'primary'} icon={<PlusCircleOutlined />}>
            Create Tuition Fee Head
          </Button>
        </Link>
      </PageHeader>
      <PageContent>
        <TuitionFeeHeadTable />
      </PageContent>
    </>
  );
};

export default TuitionFeeHeads;