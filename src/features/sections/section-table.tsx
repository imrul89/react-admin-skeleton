import { useState } from 'react';
import { Table, Input, Card, Select } from 'antd';
import PaginationWrapper from '@components/shared/pagination-wrapper';
import TableSkeleton from '@components/shared/table-skeleton';
import { useSections } from '@hooks/use-sections';
import { useClassOptions } from '@hooks/use-school-classes';
import useFilter from '@hooks/utility-hooks/use-filter';
import { columns } from './section-table-columns';

const SectionTable = () => {
  const { getQueryParams, setQueryParams, sortTableColumn } = useFilter();
  const { isLoading, data } = useSections();
  const { classOptions } = useClassOptions();

  const [search, setSearch] = useState(getQueryParams().search as string);

  const onSearchHandle = (value: string) => {
    setQueryParams({
      ...getQueryParams(),
      search: value
    });
  };

  const handleClassFilter = (classId: number | null) => {
    setQueryParams({
      ...getQueryParams(),
      class_id: classId
    });
  };

  const handleStatusFilter = (status: number | null) => {
    setQueryParams({
      ...getQueryParams(),
      status: status
    });
  };

  return (
    <Card
      title="Sections"
      extra={(
        <div className="flex gap-4">
          <Select
            placeholder="Filter by Class"
            style={{ width: 200 }}
            options={classOptions}
            onChange={handleClassFilter}
            allowClear
            value={getQueryParams().class_id as number}
          />
          <Select
            placeholder="Filter by Status"
            style={{ width: 150 }}
            options={[
              { label: 'Active', value: 1 },
              { label: 'Inactive', value: 0 }
            ]}
            onChange={handleStatusFilter}
            allowClear
            value={getQueryParams().status as number}
          />
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
            columns={columns}
            dataSource={data?.sections}
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
    </Card>
  );
};

export default SectionTable;
