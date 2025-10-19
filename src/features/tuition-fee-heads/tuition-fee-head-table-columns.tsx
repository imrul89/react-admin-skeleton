import { Link } from 'react-router-dom';
import { MenuProps, Dropdown, Button, TableProps } from 'antd';
import { MoreOutlined, EditOutlined } from '@ant-design/icons';
import TypographyWrapper from '@components/shared/typography-wrapper';
import { TuitionFeeHead } from '@models/tuition-fee-head-model.ts';

const getActions = (record: TuitionFeeHead): MenuProps['items'] => {
  return [
    {
      key: `edit-${record.id}`,
      label: <Link to={`/tuition-fee-heads/${record.id}`}>
        <EditOutlined /> Edit
      </Link>
    }
  ];
};

const columns: TableProps<TuitionFeeHead>['columns'] = [
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
    render: (_, record) => (
      <TypographyWrapper type="text">
        {record.title}
      </TypographyWrapper>
    )
  },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
    render: (_, record) => (
      <TypographyWrapper type="text">
        {record.type}
      </TypographyWrapper>
    )
  },
  {
    title: 'Serial',
    dataIndex: 'serial',
    key: 'serial',
    render: (_, record) => (
      <TypographyWrapper type="text">
        {record.serial}
      </TypographyWrapper>
    )
  },
  {
    title: 'Action',
    key: 'action',
    fixed: 'right',
    align: 'center',
    width: 100,
    render: (_, record) => (
      <Dropdown
        key={`action-${record.id}`}
        menu={{ items: getActions(record) }}
        trigger={['click']}
        overlayClassName="grid-action"
      >
        <Button shape="circle" icon={<MoreOutlined />} />
      </Dropdown>
    )
  }
];

export { columns };
