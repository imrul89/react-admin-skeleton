import _ from 'lodash';
import { useEffect, useState } from 'react';
import { Button, Flex, Popover, Radio, Segmented, Space } from 'antd';
import { CaretDownFilled, SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons';
import useFilter from '@hooks/utility-hooks/use-filter';

const MODULES = {
  campaign: [
    { label: 'ID', value: 'id' },
    { label: 'Name', value: 'name' }
  ],
  lineItem: [
    { label: 'ID', value: 'id' },
    { label: 'Name', value: 'name' }
  ],
  package: [
    { label: 'ID', value: 'id' },
    { label: 'Name', value: 'name' }
  ],
  creative: [
    { label: 'ID', value: 'id' },
    { label: 'Name', value: 'name' }
  ],
  domainBundle: [
    { label: 'ID', value: 'id' },
    { label: 'Name', value: 'name' }
  ],
  campaignEndDate: [
    { label: 'End Date', value: 'end_time' }
  ],
  lineItemEndDate: [
    { label: 'End Date', value: 'end_date' }
  ]
};

const TableColumnSorter = ({
  moduleName
}: {
  moduleName: 'campaign' | 'lineItem' | 'package' | 'creative' | 'domainBundle' | 'campaignEndDate' | 'lineItemEndDate';
}) => {
  const { getQueryParams, setQueryParams } = useFilter();

  const sort = getQueryParams().sort || '-id';
  const sortDirection = _.includes(sort, '-') ? 'desc' : 'asc';
  const field = sort.replace(/-/g, '');

  const [open, setOpen] = useState(false);
  const [fieldName, setFieldName] = useState(field);
  const [direction, setDirection] = useState(sortDirection);

  useEffect(() => {
    if (moduleName === 'campaignEndDate') {
      setFieldName('end_time');
    }
    if (moduleName === 'lineItemEndDate') {
      setFieldName('end_date');
    }
  }, [moduleName]);

  const handleSort = () => {
    setQueryParams({
      ...getQueryParams(),
      sort: `${direction === 'asc' ? '' : '-'}${fieldName}`
    });

    setOpen(false);
  };

  return (
    <Popover
      open={open}
      onOpenChange={(open) => setOpen(open)}
      content={
        <Flex gap={14} vertical>
          <Segmented
            defaultValue={direction}
            options={[
              { label: 'ASC', value: 'asc', icon: <SortAscendingOutlined /> },
              { label: 'DESC', value: 'desc', icon: <SortDescendingOutlined /> },
            ]}
            onChange={(direction) => setDirection(direction)}
          />
          {(moduleName !== 'campaignEndDate' && moduleName !== 'lineItemEndDate') && (
            <Radio.Group
              defaultValue={field}
              onChange={(e) => setFieldName(e.target.value)}
            >
              <Space direction="vertical">
                {MODULES[moduleName].map((module) => (
                  <Radio key={module.value} value={module.value}>
                    {module.label}
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
          )}

          <Flex>
            <Button
              size="small"
              type="primary"
              onClick={handleSort}
              block
            >
              Done
            </Button>
          </Flex>
        </Flex>
      }
      trigger="click"
    >
      <CaretDownFilled />
    </Popover>
  );
};

export default TableColumnSorter;
