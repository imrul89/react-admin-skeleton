import { Link } from 'react-router-dom';
import { MenuProps, Dropdown, Button, TableProps } from 'antd';
import { MoreOutlined, EditOutlined } from '@ant-design/icons';
import TypographyWrapper from '@components/shared/typography-wrapper';
import { SchoolClass } from '@models/school-class-model';

const getActions = (record: SchoolClass): MenuProps['items'] => {
  return [
    {
      key: `edit-${record.id}`,
      label: <Link to={`/classes/${record.id}`}>
        <EditOutlined /> Edit
      </Link>
    }
  ];
};

const columns: TableProps<SchoolClass>['columns'] = [
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
    render: (_, record) => (
      <TypographyWrapper type="text">
        {record.title}
      </TypographyWrapper>
    )
  },
  {
    title: 'Code',
    dataIndex: 'code',
    key: 'code',
    render: (_, record) => (
      <TypographyWrapper type="text">
        {record.code}
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
    title: 'Coaching Applicable',
    dataIndex: 'coaching_applicable',
    key: 'coaching_applicable',
    render: (_, record) => (
      <TypographyWrapper type="text">
        {record.coaching_applicable}
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
