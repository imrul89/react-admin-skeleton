import { Link } from 'react-router-dom';
import { TableProps, Tag, } from 'antd';
import TypographyWrapper from '@components/shared/typography-wrapper';
import UserTableColumnActions from '@features/users/user-table-column-actions';
import { User } from '@models/user-model';

const columns: TableProps<User>['columns'] = [
  {
    title: 'Name',
    dataIndex: 'name',
    sorter: true,
    key: 'name',
    className: 'break-all',
    width: 150,
    fixed: 'left',
    render: (_, record) => (
      <Link to={`/users/${record.id}`}>
        <TypographyWrapper type="text" className="capitalize">
          {record.name}
        </TypographyWrapper>
      </Link>
    )
  },
  {
    title: 'Email',
    dataIndex: 'email',
    width: 150,
    key: 'email',
    render: (_, record) => (
      <TypographyWrapper type="text">
        {record.email}
      </TypographyWrapper>
    )
  },
  {
    title: 'Username',
    dataIndex: 'username',
    width: 150,
    key: 'username',
    render: (_, record) => (
      <TypographyWrapper type="text">
        {record.username}
      </TypographyWrapper>
    )
  },
  {
    title: 'Roles',
    width: 150,
    key: 'roles',
    render: (_, record) => (
      <TypographyWrapper type="text">
        {record.roles.map((role) => (
          <Tag key={`${record}-${role.id}`}>
            {role.name}
          </Tag>
        ))}
      </TypographyWrapper>
    )
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: 150,
    align: 'center',
    render: (_, record) => (
      <TypographyWrapper type="text">
        {record.status === 1 ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>}
      </TypographyWrapper>
    )
  },
  {
    title: 'Action',
    key: 'action',
    fixed: 'right',
    align: 'center',
    width: 100,
    render: (_, record) => <UserTableColumnActions user={record as User} />
  }
];

export { columns };
