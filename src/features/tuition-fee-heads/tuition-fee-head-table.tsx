import { useState } from 'react';
import { Table, Input, Card, Select, Flex } from 'antd';
import PaginationWrapper from '@components/shared/pagination-wrapper';
import TableSkeleton from '@components/shared/table-skeleton';
import { useTuitionFeeHeads } from '@hooks/use-tuition-fee-heads.ts';
import useFilter from '@hooks/utility-hooks/use-filter';
import { TUITION_FEE_HEAD_TYPE_OPTIONS } from '@utils/constants';
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
  
  const onChangeAccountType = (value: number) => {
    const params = {
      ...getQueryParams(),
      account_type_id: value
    };

    setQueryParams(params);
  };

  return (
    <Card
      title="Tuition Fee Heads"
      extra={(
        <div className="my-4">
          <Flex gap={16}>
            <Select
              options={TUITION_FEE_HEAD_TYPE_OPTIONS}
              onChange={onChangeAccountType}
              placeholder="Select Account Type"
              style={{minWidth: 200}}
              allowClear
            />
            
            <Input.Search
              placeholder="Search"
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
            dataSource={data?.tuitionFeeHeads}
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

export default TuitionFeeHeadTable;