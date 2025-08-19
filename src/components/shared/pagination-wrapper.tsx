import { Pagination } from 'antd';
import useFilter from '@hooks/utility-hooks/use-filter';
import { PAGINATION_CONFIG } from '@utils/constants';

const PaginationWrapper = ({ totalItems } : { totalItems: number; }) => {
  const { getQueryParams, setQueryParams } = useFilter();
  const queryParams = getQueryParams();
  
  const handlePaginationChange = (pageNo: number, pageSize: number) => {
    setQueryParams({
      ...getQueryParams(),
      limit: pageSize,
      offset: (pageNo && pageSize ? (pageNo - 1) * pageSize : 0)
    });
  };
  
  const getCurrentPage = () => {
    const offset = Number(queryParams.offset) || 0;
    const limit = Number(queryParams.limit) || 0;
    
    return queryParams.offset ? (offset / limit) + 1 : 1;
  };
  
  return (
    <Pagination
      total={totalItems}
      showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
      defaultPageSize={Number(queryParams.limit) || PAGINATION_CONFIG.pageSize}
      pageSizeOptions={[10, 25, 50, 100]}
      current={getCurrentPage()}
      onChange={handlePaginationChange}
    />
  );
};

export default PaginationWrapper;
