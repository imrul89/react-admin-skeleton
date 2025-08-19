import { SorterResult } from 'antd/es/table/interface';
import _ from 'lodash';
import { useLocation, useNavigate } from 'react-router-dom';
import { TableProps } from 'antd';
import { QueryParams } from '@models/utils-model.ts';
import { DEFAULT_QUERY_PARAMS, PAGINATION_CONFIG } from '@utils/constants';
import { formatQueryParams } from '@utils/helpers';

interface Sorter {
  field: string;
  order: 'ascend' | 'descend' | undefined;
}

const useFilter = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const getQueryParams = (): QueryParams => {
    const params = Object.fromEntries(new URLSearchParams(location.search));
    
    const formattedParams = _.mapValues(params, value => {
      if (_.includes(value, ',')) {
        return _.map(_.split(value, ','), item => _.isFinite(_.toNumber(item)) ? _.toNumber(item) : item);
      } else if (_.isFinite(_.toNumber(value))) {
        return _.toNumber(value);
      } else {
        return value;
      }
    });
    
    return formattedParams;
  };
  
  const setQueryParams = (queryParams: QueryParams): void => {
    const queryParamsString = formatQueryParams({
      ...queryParams,
      offset: queryParams?.offset !== getQueryParams()?.offset ? queryParams?.offset : 0
    });
    
    navigate({
      pathname: location.pathname,
      search: `${queryParamsString}`
    });
  };
  
  const getDefaultQueryParams = () => {
    const queryParams = getQueryParams();
    
    return {
      limit: queryParams.limit || PAGINATION_CONFIG.pageSize,
      offset: queryParams.offset || DEFAULT_QUERY_PARAMS.offset,
      sort: queryParams.sort || DEFAULT_QUERY_PARAMS.sort
    };
  };
  
  const sortTableColumn: TableProps<any>['onChange'] = (_, __, sorter: SorterResult<any> | SorterResult<any>[]) => {
    const { field, order } = sorter as Sorter;
    
    setQueryParams({
      ...getQueryParams(),
      sort: order === 'ascend' ? field : `-${field}`
    });
  };
  
  return {
    getQueryParams,
    setQueryParams,
    getDefaultQueryParams,
    sortTableColumn
  };
};

export default useFilter;
