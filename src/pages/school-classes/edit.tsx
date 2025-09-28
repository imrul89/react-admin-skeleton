import { useParams } from 'react-router-dom';
import { Spin } from 'antd';
import SchoolClassForm from '@features/school-classes/school-class-form';
import { useSchoolClass } from '@hooks/use-school-classes.ts';
import PageContent from '@layouts/partials/page-content';
import PageHeader from '@layouts/partials/page-header';

const SchoolClassEdit = () => {
  const params = useParams();
  const schoolClassId = Number(params.id);
  const { isLoading, schoolClass } = useSchoolClass(schoolClassId);

  return (
    <>
      <PageHeader
        title="Edit Class"
        subTitle="Update the class details below"
      />
      <PageContent>
        <Spin spinning={isLoading}>
          <SchoolClassForm initialValues={ schoolClass } isEditMode />
        </Spin>
      </PageContent>
    </>
  );
};

export default SchoolClassEdit;
