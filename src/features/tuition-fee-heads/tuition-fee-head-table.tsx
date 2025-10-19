import { useState } from 'react';
import { Table, Input, Card } from 'antd';
import PaginationWrapper from '@components/shared/pagination-wrapper';
import TableSkeleton from '@components/shared/table-skeleton';
import { useTuitionFeeHeads } from '@hooks/use-tuition-fee-heads.ts';
import useFilter from '@hooks/utility-hooks/use-filter';
import { columns } from './tuition-fee-head-table-columns';

const TuitionFeeHeadTable = () => {
  const { getQueryParams, setQueryParams, sortTableColumn } = useFilter();
  const { isLoading, data } = useTuitionFeeHeads();

  const [search, setSearch] = useState(getQueryParams().search as string);

  const onSearchHandle = (value: string) => {
    setQueryParams({
      ...getQueryParams(),
      search: value
    });
  };

  return (
    <Card
      title="Tuition Fee Heads"
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
            dataSource={data?.tuitionFeeHeads}
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

export default TuitionFeeHeadTable;