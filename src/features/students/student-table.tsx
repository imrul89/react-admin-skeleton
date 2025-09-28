import { useState } from 'react';
import { Table, Input, Card } from 'antd';
import PaginationWrapper from '@components/shared/pagination-wrapper';
import TableSkeleton from '@components/shared/table-skeleton';
import { useStudents } from '@hooks/use-students';
import useFilter from '@hooks/utility-hooks/use-filter';
import { columns } from './student-table-columns';

const StudentTable = () => {
  const { isLoading, data } = useStudents();

  const { getQueryParams, setQueryParams, sortTableColumn } = useFilter();
  const [search, setSearch] = useState(getQueryParams().search as string);

  const onSearchHandle = (value: string) => {
    setQueryParams({
      ...getQueryParams(),
      search: value
    });
  };
  
  return (
    <Card
      title="Students"
      extra={(
        <div className="my-6">
          <Input.Search
            placeholder={'Search'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onSearch={onSearchHandle}
            allowClear />
        </div>
      )}
    >
      {data?.students ?
        <>
          <Table
            columns={columns}
            dataSource={data?.students}
            loading={isLoading}
            pagination={false}
            onChange={sortTableColumn}
            rowKey="id"
            bordered
            sticky={{ offsetHeader: 64 }}
          />
          <div className={'flex justify-end mt-4'}>
            <PaginationWrapper totalItems={data?.totalNumberOfRows || 0} />
          </div>
        </>
        : <TableSkeleton />
      }
    </Card>
  );
};

export default StudentTable;
