import { useState } from 'react';
import { Table, Input, Card, Select, Flex } from 'antd';
import PaginationWrapper from '@components/shared/pagination-wrapper';
import TableSkeleton from '@components/shared/table-skeleton';
import { useClassOptions } from '@hooks/use-school-classes';
import { useSections } from '@hooks/use-sections';
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

  return (
    <Card
      title="Sections"
      extra={(
        <div className="my-4">
          <Flex gap={16}>
            <Select
              placeholder="Select Class"
              options={classOptions}
              onChange={handleClassFilter}
              allowClear
              value={getQueryParams().class_id as number}
              style={{minWidth: 200}}
            />
            <Input.Search
              placeholder="Search by keyword"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onSearch={onSearchHandle}
              allowClear
            />
          </Flex>
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
