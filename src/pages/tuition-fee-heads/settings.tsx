import TuitionFeeHeadSettingsForm from '@features/tuition-fee-heads/tuition-fee-head-settings-form';
import PageContent from '@layouts/partials/page-content';
import PageHeader from '@layouts/partials/page-header';

const TuitionFeeHeadSettings = () => {
  return (
    <>
      <PageHeader
        title="Tuition Fee Head Settings"
        subTitle="Tuition fee head settings from here"
      />
      <PageContent>
        <TuitionFeeHeadSettingsForm />
      </PageContent>
    </>
  );
};

export default TuitionFeeHeadSettings;
