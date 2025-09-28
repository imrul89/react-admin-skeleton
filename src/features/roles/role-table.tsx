import { useState } from 'react';
import { Table, Input, Card } from 'antd';
import PaginationWrapper from '@components/shared/pagination-wrapper';
import TableSkeleton from '@components/shared/table-skeleton';
import { useRoles } from '@hooks/use-roles';
import useFilter from '@hooks/utility-hooks/use-filter';
import { columns } from './role-table-columns';

const RoleTable = () => {
  const { getQueryParams, setQueryParams, sortTableColumn } = useFilter();
  const { isLoading, data } = useRoles();

  const [search, setSearch] = useState(getQueryParams().search as string);

  const onSearchHandle = (value: string) => {
    setQueryParams({
      ...getQueryParams(),
      search: value
    });
  };

  return (
    <Card
      title="Roles"
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
            dataSource={data?.roles}
            loading={isLoading}
            pagination={false}
            onChange={sortTableColumn}
            rowKey="id"
            bordered
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

export default RoleTable;