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
        <TypographyWrapper type="link" className="capitalize">
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
    title: 'Mobile No',
    dataIndex: 'mobile_no',
    width: 150,
    key: 'mobile_no',
    render: (_, record) => (
      <TypographyWrapper type="text">
        {record.mobile_no}
      </TypographyWrapper>
    )
  },
  {
    title: 'User Group',
    dataIndex: 'user_group',
    width: 150,
    key: 'user_group',
    render: (_, record) => (
      <TypographyWrapper type="text">
        {record.user_group?.name}
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
