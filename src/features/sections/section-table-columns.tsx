import { Link } from 'react-router-dom';
import { MenuProps, Dropdown, Button, TableProps } from 'antd';
import { MoreOutlined, EditOutlined } from '@ant-design/icons';
import TypographyWrapper from '@components/shared/typography-wrapper';
import { Section } from '@models/section-model';

const getActions = (record: Section): MenuProps['items'] => {
  return [
    {
      key: `edit-${record.id}`,
      label: <Link to={`/sections/${record.id}`}>
        <EditOutlined /> Edit
      </Link>
    }
  ];
};

const columns: TableProps<Section>['columns'] = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    sorter: true,
    render: (_, record) => (
      <TypographyWrapper type="text">
        {record.id}
      </TypographyWrapper>
    )
  },
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
    sorter: true,
    render: (_, record) => (
      <TypographyWrapper type="text">
        {record.title}
      </TypographyWrapper>
    )
  },
  {
    title: 'Class',
    dataIndex: ['class', 'title'],
    key: 'class',
    render: (_, record) => (
      <TypographyWrapper type="text">
        {record.class?.title || 'N/A'}
      </TypographyWrapper>
    )
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    sorter: true,
    render: (_, record) => (
      <TypographyWrapper type="text" textType={record.status === 1 ? 'success' : 'secondary'}>
        {record.status === 1 ? 'Active' : 'Inactive'}
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
