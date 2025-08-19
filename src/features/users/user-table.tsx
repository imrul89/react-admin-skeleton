import { useState } from 'react';
import { Table, Input, Card } from 'antd';
import PaginationWrapper from '@components/shared/pagination-wrapper';
import TableSkeleton from '@components/shared/table-skeleton';
import useFilter from '@hooks/utility-hooks/use-filter';
import { columns } from './user-table-columns';
import { useUsers } from '@/hooks/use-users';

const UserTable = () => {
  const { isLoading, data } = useUsers();

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
      title="Users"
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
      {data?.users ?
        <>
          <Table
            columns={columns}
            dataSource={data?.users}
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

export default UserTable;
