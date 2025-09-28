import SchoolClassForm from '@features/school-classes/school-class-form';
import PageContent from '@layouts/partials/page-content';
import PageHeader from '@layouts/partials/page-header';
import { SchoolClassPartial } from '@models/school-class-model.ts';

const SchoolClassCreate = () => {
  const initialValues = {} as SchoolClassPartial;

  return (
    <>
      <PageHeader
        title="Create Class"
        subTitle="Fill in the details to create a new class"
      />
      <PageContent>
        <SchoolClassForm initialValues={initialValues} />
      </PageContent>
    </>
  );
};

export default SchoolClassCreate;
