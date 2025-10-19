import TuitionFeeHeadForm from '@features/tuition-fee-heads/tuition-fee-head-form';
import PageContent from '@layouts/partials/page-content';
import PageHeader from '@layouts/partials/page-header';
import { TuitionFeeHeadPartial } from '@models/tuition-fee-head-model.ts';

const TuitionFeeHeadCreate = () => {
  const initialValues = {
    type: 'COST'
  } as TuitionFeeHeadPartial;

  return (
    <>
      <PageHeader
        title="Create Tuition Fee Head"
        subTitle="Fill in the details to create a new tuition fee head"
      />
      <PageContent>
        <TuitionFeeHeadForm initialValues={initialValues} />
      </PageContent>
    </>
  );
};

export default TuitionFeeHeadCreate;
