import { Pagination } from 'antd';
import { QueryParams } from '@models/utils-model.ts';
import { PAGINATION_CONFIG } from '@utils/constants';

interface InternalPaginationWrapperProps {
  totalItems: number;
  filter: QueryParams,
  setFilter: (filter: QueryParams) => void;
}

const InternalPaginationWrapper = (
  {
    totalItems,
    filter,
    setFilter
  }: InternalPaginationWrapperProps) => {
  
  const handlePaginationChange = (pageNo: number, pageSize?: number) => {
    setFilter({
      ...filter,
      limit: pageSize,
      offset: (pageNo && pageSize ? (pageNo - 1) * pageSize : 0)
    });
  };
  
  const getCurrentPage = () => {
    const offset = Number(filter.offset) || 0;
    const limit = Number(filter.limit) || 0;
    
    return filter.offset ? (offset / limit) + 1 : 1;
  };

  return (
    <Pagination
      total={totalItems}
      showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
      defaultPageSize={Number(filter.limit) || PAGINATION_CONFIG.pageSize}
      pageSizeOptions={[10, 25, 50, 100]}
      current={getCurrentPage()}
      onChange={handlePaginationChange}
    />
  );
};

export default InternalPaginationWrapper;
