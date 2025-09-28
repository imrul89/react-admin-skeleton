import { Link } from 'react-router-dom';
import { MenuProps, Dropdown, Button, TableProps } from 'antd';
import { MoreOutlined, EditOutlined } from '@ant-design/icons';
import TypographyWrapper from '@components/shared/typography-wrapper';
import { Permission } from '@models/permission-model';

const getActions = (record: Permission): MenuProps['items'] => {
  return [
    {
      key: `edit-${record.id}`,
      label: <Link to={`/permissions/${record.id}`}>
        <EditOutlined /> Edit
      </Link>
    }
  ];
};

const columns: TableProps<Permission>['columns'] = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    sorter: true,
    render: (_, record) => (
      <TypographyWrapper type="text">
        {record.name}
      </TypographyWrapper>
    )
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
    render: (_, record) => (
      <TypographyWrapper type="text">
        {record.description}
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
