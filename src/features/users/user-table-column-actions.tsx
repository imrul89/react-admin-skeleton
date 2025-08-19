import { Link } from 'react-router-dom';
import { MenuProps, Dropdown, Button } from 'antd';
import { EditOutlined, MoreOutlined } from '@ant-design/icons';
import { User } from '@models/user-model';

const getActions = (record: User): MenuProps['items'] => {
  return [
    {
      key: `edit-${record.id}`,
      label: <Link to={`/users/${record.id}`}>
        <EditOutlined /> Edit
      </Link>,
    }
  ];
};

const UserTableColumnActions = ({ user }: { user: User }) => {
  return (
    <Dropdown
      menu={{ items: getActions(user) }}
      trigger={['click']}
      overlayClassName="grid-action"
    >
      <Button shape="circle" icon={<MoreOutlined />} />
    </Dropdown>
  );
};

export default UserTableColumnActions;
