import { useState } from 'react';
import { Table, Input, Card, Modal, Spin } from 'antd';
import { App } from 'antd';
import PaginationWrapper from '@components/shared/pagination-wrapper';
import TableSkeleton from '@components/shared/table-skeleton';
import { useSchoolClasses } from '@hooks/use-school-classes.ts';
import { useSchoolClassQuery, useSchoolClassSavedMutation } from '@services/school-classes-service';
import useFilter from '@hooks/utility-hooks/use-filter';
import { getColumns } from './school-class-table-columns';
import SchoolClassForm from './school-class-form';
import { SchoolClass } from '@models/school-class-model';

const SchoolClassTable = () => {
  const { getQueryParams, setQueryParams, sortTableColumn } = useFilter();
  const { isLoading, data } = useSchoolClasses();
  const { message } = App.useApp();

  const [search, setSearch] = useState(getQueryParams().search as string);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const { isLoading: isLoadingClass, data: schoolClass } = useSchoolClassQuery(selectedClassId || 0, {
    skip: !selectedClassId || !isModalVisible
  });
  const [updateClass, { isLoading: isUpdating }] = useSchoolClassSavedMutation();

  const onSearchHandle = (value: string) => {
    setQueryParams({
      ...getQueryParams(),
      search: value
    });
  };

  const handleConfigClick = (record: SchoolClass) => {
    setSelectedClassId(record.id);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedClassId(null);
  };

  // Custom form handler for modal (doesn't navigate)
  const handleFormSubmit = async (formData: SchoolClass) => {
    try {
      await updateClass(formData).unwrap();
      message.success('Class updated successfully.');
      handleModalClose();
      // RTK Query will automatically refetch due to cache invalidation
    } catch (error: any) {
      message.error(error?.data?.errors || 'Failed to update class');
    }
  };

  return (
    <Card
      title="Classes"
      extra={(
        <div className="my-4">
          <Input.Search
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onSearch={onSearchHandle}
            allowClear
          />
        </div>
      )}
    >
      {data ?
        <>
          <Table
            columns={getColumns({ onConfigClick: handleConfigClick })}
            dataSource={data?.classes}
            loading={isLoading}
            pagination={false}
            onChange={sortTableColumn}
            rowKey="id"
          />
          <div className="flex justify-end mt-4">
            <PaginationWrapper totalItems={data?.totalNumberOfRows || 0} />
          </div>
        </>
        : <TableSkeleton />
      }

      <Modal
        title="Coaching Configuration"
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={600}
        destroyOnClose
      >
        <Spin spinning={isLoadingClass}>
          {schoolClass && (
            <SchoolClassForm
              initialValues={schoolClass}
              isEditMode={true}
              onSaved={handleFormSubmit}
              isLoading={isUpdating}
              showCard={false}
            />
          )}
        </Spin>
      </Modal>
    </Card>
  );
};

export default SchoolClassTable;