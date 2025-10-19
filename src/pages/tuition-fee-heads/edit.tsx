import { useParams } from 'react-router-dom';
import { Spin } from 'antd';
import TuitionFeeHeadForm from '@features/tuition-fee-heads/tuition-fee-head-form';
import { useTuitionFeeHead } from '@hooks/use-tuition-fee-heads.ts';
import PageContent from '@layouts/partials/page-content';
import PageHeader from '@layouts/partials/page-header';

const TuitionFeeHeadEdit = () => {
  const params = useParams();
  const tuitionFeeHeadId = Number(params.id);
  const { isLoading, tuitionFeeHead } = useTuitionFeeHead(tuitionFeeHeadId);

  return (
    <>
      <PageHeader
        title="Edit Tuition Fee Head"
        subTitle="Update the tuition fee head details below"
      />
      <PageContent>
        <Spin spinning={isLoading}>
          <TuitionFeeHeadForm initialValues={ tuitionFeeHead } isEditMode />
        </Spin>
      </PageContent>
    </>
  );
};

export default TuitionFeeHeadEdit;
