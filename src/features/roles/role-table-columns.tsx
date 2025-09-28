import { Link } from 'react-router-dom';
import { MenuProps, Dropdown, Button, TableProps } from 'antd';
import { MoreOutlined, EditOutlined, KeyOutlined } from '@ant-design/icons';
import TypographyWrapper from '@components/shared/typography-wrapper';
import { Role } from '@models/role-model';

const getActions = (record: Role): MenuProps['items'] => {
  return [
    {
      key: `edit-${record.id}`,
      label: <Link to={`/roles/${record.id}`}>
        <EditOutlined /> Edit
      </Link>
    },
    {
      key: `permissions-${record.id}`,
      label: <Link to={`/roles/${record.id}/permissions`}>
        <KeyOutlined /> Set Permissions
      </Link>
    }
  ];
};

const columns: TableProps<Role>['columns'] = [
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
