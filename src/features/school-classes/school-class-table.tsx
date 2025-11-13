import { useState } from 'react';
import { Table, Input, Card } from 'antd';
import PaginationWrapper from '@components/shared/pagination-wrapper';
import TableSkeleton from '@components/shared/table-skeleton';
import { useSchoolClasses } from '@hooks/use-school-classes.ts';
import useFilter from '@hooks/utility-hooks/use-filter';
import { columns } from './school-class-table-columns';

const SchoolClassTable = () => {
  const { getQueryParams, setQueryParams, sortTableColumn } = useFilter();
  const { isLoading, data } = useSchoolClasses();

  const [search, setSearch] = useState(getQueryParams().search as string);

  const onSearchHandle = (value: string) => {
    setQueryParams({
      ...getQueryParams(),
      search: value
    });
  };

  return (
    <Card
      title="Classes"
      extra={(
        <div className="my-6">
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
    </Card>
  );
};

export default SchoolClassTable;